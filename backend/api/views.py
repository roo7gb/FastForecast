from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Series, DataPoint
from .serializers import SeriesSerializer, DataPointSerializer
from django.shortcuts import get_object_or_404
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from django.db import connection, reset_queries

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


@api_view(['POST'])
def forecast_view(request):
    """
    Robust Holt-Winters forecasting without use_boxcox.
    Optional: log-transform for variance stabilization.
    """
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

    # Optional log transform
    log_transform = body.get("log_transform", False)
    if log_transform:
        if (ts <= 0).any():
            return Response({"error": "All values must be > 0 for log transform"}, status=400)
        ts = np.log(ts)

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

        # If log-transform was applied, invert it
        if log_transform:
            forecast = np.exp(forecast)
            ts = np.exp(ts)

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
            "log_transform": log_transform
        }
    }

    return Response(result, status=200)
