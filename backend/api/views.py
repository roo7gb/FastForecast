#────────────────────────────────────────────────────────#
#                                                        #
# views.py                                               #   
# API views for time series data management and analysis #
#                                                        #
# Author: Jo Richmond                                    #
#                                                        #
#────────────────────────────────────────────────────────#
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Series, DataPoint
from .serializers import SeriesSerializer, DataPointSerializer
from django.shortcuts import get_object_or_404
import pandas as pd
from pmdarima import auto_arima
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from django.db import connection, reset_queries
from statsmodels.tsa.stattools import acf
from statsmodels.tsa.seasonal import seasonal_decompose

class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    lookup_field = "name"

class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        series_name = self.request.query_params.get("series")
        if series_name:
            qs = qs.filter(series__name=series_name)
        return qs
    
# ─────────────────────────────
# ADD SERIES
# ─────────────────────────────
@api_view(["POST"])
def upload_timeseries_view(request):
    description = request.data.get("description")
    points = request.data.get("points", [])
    title = request.data.get("title")


    if not title:
        return Response({"error": "title is required"}, status=400)

    if not isinstance(points, list) or len(points) == 0:
        return Response({"error": "points must be a non-empty list"}, status=400)

    # Create series
    series = Series.objects.create(name=title, description=description)

    # Build DataPoint objects
    to_create = []
    for p in points:
        try:
            ts = p["timestamp"]
            val = float(p["value"])
        except Exception:
            return Response(
                {"error": f"Invalid point format: {p}"},
                status=400
            )

        to_create.append(DataPoint(series=series, timestamp=ts, value=val))

    DataPoint.objects.bulk_create(to_create)

    return Response({"status": "ok", "id": series.id})

# ─────────────────────────────
# FORECAST - HOLT-WINTERS
# ─────────────────────────────
@api_view(['POST'])
def HWforecast_view(request):
    body = request.data
    series_name = body.get("series")
    if not series_name:
        return Response({"error": "series is required"}, status=400)

    print("Received forecast request:", body)
    print("Series found:", series_name)
    # Fetch series and filter by optional start/end
    s = get_object_or_404(Series, name=series_name)
    points = s.points.all()
    if body.get("start"):
        start_dt = parse_datetime(body["start"])
        if start_dt:
            points = points.filter(timestamp__gte=start_dt)
    if body.get("end"):
        end_dt = parse_datetime(body["end"])
        if end_dt:
            points = points.filter(timestamp__lte=end_dt)
    print("Points count:", points.count())

    if points.count() < 2:
        return Response({"error": "not enough data points"}, status=400)

    # Build pandas Series
    df = pd.DataFrame.from_records(list(points.values("timestamp", "value")))
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp').set_index('timestamp')
    ts = df['value'].asfreq(pd.infer_freq(df.index) or (df.index[1] - df.index[0]))
    if ts.isnull().any():
        ts = ts.interpolate().ffill().bfill()

    # Forecast parameters
    trend = body.get("trend") or None
    seasonal = body.get("seasonal") or None
    seasonal_periods = body.get("seasonal_periods")
    forecast_steps = int(body.get("forecast_steps", 12))
    smoothing_level = body.get("smoothing_level")
    smoothing_slope = body.get("smoothing_slope")
    smoothing_seasonal = body.get("smoothing_seasonal")

    if seasonal_periods is not None:
        try:
            seasonal_periods = int(seasonal_periods)
        except:
            seasonal_periods = None

    # Fit model
    try:
        model = ExponentialSmoothing(
            ts,
            trend=trend,
            seasonal=seasonal,
            seasonal_periods=seasonal_periods
        )
        fitted = model.fit(
            smoothing_level=smoothing_level,
            smoothing_slope=smoothing_slope,
            smoothing_seasonal=smoothing_seasonal,
            optimized=True
        )
        forecast = fitted.forecast(forecast_steps)

    except Exception as e:
        return Response({"error": "failed to fit model", "detail": str(e)}, status=400)

    # Build forecast timestamps
    last_ts = ts.index[-1]
    freq_str = ts.index.freqstr or pd.infer_freq(ts.index)
    if freq_str:
        forecast_index = pd.date_range(
            start=last_ts + pd.tseries.frequencies.to_offset(freq_str),
            periods=forecast_steps,
            freq=freq_str
        )
    else:
        delta = ts.index[-1] - ts.index[-2]
        forecast_index = [last_ts + (i + 1) * delta for i in range(forecast_steps)]

    forecast_list = [{"timestamp": ts_idx.isoformat(), "value": float(val)}
                     for ts_idx, val in zip(forecast_index, forecast.values)]
    history = [{"timestamp": idx.isoformat(), "value": float(v)} for idx, v in ts.items()]
    print(connection.queries)  # Debug: print all SQL queries executed
    connection.queries.clear()  # Clear queries after printing
    result = {
        "series": series_name,
        "history": history,
        "forecast": forecast_list,
        "model_params": {
            "trend": trend,
            "seasonal": seasonal,
            "seasonal_periods": seasonal_periods,
        }
    }

    return Response(result, status=200)

# ─────────────────────────────
# FORECAST - AUTOREGRESSIVE INTEGRATED MOVING AVERAGE (ARIMA)
# ─────────────────────────────

@api_view(['POST'])
def ARIMAforecast_view(request):
    body = request.data
    series_name = body.get("series")
    if not series_name:
        return Response({"error": "series is required"}, status=400)

    forecast_steps = int(body.get("forecast_steps", 12))
    seasonal = bool(body.get("seasonal", False))
    m = int(body.get("m", 1))

    s = get_object_or_404(Series, name=series_name)
    points = s.points.all()

    # Apply optional filters
    if body.get("start"):
        dt = parse_datetime(body["start"])
        if dt:
            points = points.filter(timestamp__gte=dt)

    if body.get("end"):
        dt = parse_datetime(body["end"])
        if dt:
            points = points.filter(timestamp__lte=dt)

    if points.count() < 5:
        return Response({"error": "not enough data points (min 5 required)"}, status=400)

    # Build dataframe
    df = pd.DataFrame.from_records(list(points.values("timestamp", "value")))
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values("timestamp").set_index("timestamp")

    ts = df["value"].astype(float)

    # Infer frequency or fallback
    freq = pd.infer_freq(ts.index)
    if freq is None:
        delta = ts.index[1] - ts.index[0]
        freq = delta

    # Fit ARIMA automatically
    try:
        model = auto_arima(
            ts,
            seasonal=seasonal,
            m=m,
            trace=True,
            error_action="ignore",
            suppress_warnings=True,
            stepwise=True
        )
    except Exception as e:
        return Response({"error": "failed to fit ARIMA model", "detail": str(e)}, status=400)

    try:
        forecast_values = model.predict(n_periods=forecast_steps)
    except Exception as e:
        return Response({"error": "forecast failed", "detail": str(e)}, status=400)

    # Build forecast timestamps
    if isinstance(freq, pd.Timedelta):
        forecast_index = [ts.index[-1] + (i+1) * freq for i in range(forecast_steps)]
    else:
        forecast_index = pd.date_range(start=ts.index[-1], periods=forecast_steps+1, freq=freq)[1:]

    # Serialize to JSON
    history = [
        {"timestamp": idx.isoformat(), "value": float(v)}
        for idx, v in ts.items()
    ]

    forecast = [
        {"timestamp": idx.isoformat(), "value": float(val)}
        for idx, val in zip(forecast_index, forecast_values)
    ]

    return Response({
        "series": series_name,
        "model": "auto_arima",
        "params": {
            "order": model.order,
            "seasonal_order": model.seasonal_order,
            "seasonal": seasonal,
            "m": m
        },
        "history": history,
        "forecast": forecast
    })

# ─────────────────────────────
# AUTOCORRELATION FUNCTION
# ─────────────────────────────
@api_view(['POST'])
def acf_view(request):
    body = request.data
    series_name = body.get("series")
    nlags = int(body.get("nlags", 40))

    if not series_name:
        return Response({"error": "series is required"}, status=400)

    s = get_object_or_404(Series, name=series_name)
    points = s.points.all()

    if body.get("start"):
        dt = parse_datetime(body["start"])
        if dt:
            points = points.filter(timestamp__gte=dt)

    if body.get("end"):
        dt = parse_datetime(body["end"])
        if dt:
            points = points.filter(timestamp__lte=dt)

    if points.count() < 2:
        return Response({"error": "not enough data points"}, status=400)

    df = pd.DataFrame(list(points.values("timestamp", "value")))
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values("timestamp").set_index("timestamp")
    ts = df["value"]

    N = len(ts)

    try:
        acf_values = acf(ts, nlags=nlags, fft=True)
    except Exception as e:
        return Response({"error": "ACF computation failed", "detail": str(e)}, status=400)

    ci = 1.96 / (N ** 0.5)

    data = [{"lag": i, "acf": float(acf_values[i])} for i in range(len(acf_values))]

    return Response({
        "series": series_name,
        "acf": data,
        "nlags": nlags,
        "ci_upper": ci,
        "ci_lower": -ci
    })

# ─────────────────────────────
# DECOMPOSITION
# ─────────────────────────────
@api_view(["POST"])
def decompose_view(request):
    """
    POST /api/decompose/
    {
      "series": "sales",
      "period": 12,
      "model": "additive" | "multiplicative"
    }
    """
    body = request.data
    name = body.get("series")
    period = int(body.get("period", 12))
    model = body.get("model", "additive")

    if not name:
        return Response({"error": "series is required"}, status=400)

    s = get_object_or_404(Series, name=name)
    points = s.points.all().order_by("timestamp")

    if points.count() < period * 2:
        return Response({"error": "not enough data to decompose"}, status=400)

    df = pd.DataFrame(list(points.values("timestamp", "value")))
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values("timestamp").set_index("timestamp")

    ts = df["value"]

    try:
        result = seasonal_decompose(ts, model=model, period=period)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    # Convert to JSON
    def to_list(series):
        return [
            {"timestamp": idx.isoformat(), "value": float(val) if pd.notnull(val) else None}
            for idx, val in series.items()
        ]

    return Response({
        "series": name,
        "observed": to_list(result.observed),
        "trend": to_list(result.trend),
        "seasonal": to_list(result.seasonal),
        "residual": to_list(result.resid),
        "period": period,
        "model": model,
    })

