/*

    ForecastForm.js

    Defines the form for forecasting used in the page for Time
    Series viewing and forecasting.

    author: Jo Richmond

*/

import { useState } from "react";

export default function ForecastForm({ onForecastHW, onForecastARIMA }) {
    const [arima, setARIMA] = useState(false);
    const [series, setSeries] = useState("");
    const [trend, setTrend] = useState("add");
    const [seasonal, setSeasonal] = useState("add");
    const [seasonalARIMA, setSeasonalARIMA] = useState(true);
    const [seasonalARIMAStr, setSeasonalARIMAStr] = useState("false")
    const [seasonalPeriods, setSeasonalPeriods] = useState(12);
    const [forecastSteps, setForecastSteps] = useState(12);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (arima) {
            const payload = {
                series,
                forecast_steps: forecastSteps,
                seasonal: seasonalARIMA,
                m: seasonalPeriods
            };
            onForecastARIMA(payload);
        } else {
            const payload = {
                series,
                trend,
                seasonal,
                seasonal_periods: seasonalPeriods,
                forecast_steps: forecastSteps,
            };
            onForecastHW(payload);
        }
        
    };

    function handleARIMA(e) {
        if (e == "hw") { setARIMA(false); }
        if (e == "arima") { setARIMA(true); }
    }

    function handleSeasonalARIMA(e) {
        setSeasonalARIMAStr(e);
        if (e == "false") { setSeasonalARIMA(false); }
        if (e == "true") { setSeasonalARIMA(true); }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4" style={{ backgroundColor: "transparent", border: "none" }}>
            <div>
                <label>Forecast Type: </label>
                <select
                    onChange={(e) => handleARIMA(e.target.value)}
                    className="border p-1 rounded ml-2"
                >
                    <option value="hw">Holt-Winters</option>
                    <option value="arima">ARIMA (DO NOT RUN WITH LARGE SETS)</option>
                </select>
            </div>
            <div>
                <label>Series Name:</label>
                <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    required
                    className="border p-1 rounded ml-2"
                />
            </div>
            {arima ? (
                <div>
                    <label>Seasonal ARIMA:</label>
                    <select
                        value={seasonalARIMAStr}
                        onChange={(e) => handleSeasonalARIMA(e.target.value)}
                        className="border p-1 rounded ml-2"
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            ) : (
                <>
                    <div>
                        <label>Trend:</label>
                        <select
                            value={trend}
                            onChange={(e) => setTrend(e.target.value)}
                            className="border p-1 rounded ml-2"
                        >
                            <option value="add">Additive</option>
                            <option value="mul">Multiplicative</option>
                            <option value="">None</option>
                        </select>
                    </div>

                    <div>
                        <label>Seasonal:</label>
                        <select
                            value={seasonal}
                            onChange={(e) => setSeasonal(e.target.value)}
                            className="border p-1 rounded ml-2"
                        >
                            <option value="add">Additive</option>
                            <option value="mul">Multiplicative</option>
                            <option value="">None</option>
                        </select>
                    </div>
                </>
            )}

            <div>
                <label>Seasonal Periods:</label>
                <input
                    type="number"
                    value={seasonalPeriods}
                    onChange={(e) => setSeasonalPeriods(Number(e.target.value))}
                    min={1}
                    className="border p-1 rounded ml-2 w-20"
                />
            </div>

            <div>
                <label>Forecast Steps:</label>
                <input
                    type="number"
                    value={forecastSteps}
                    onChange={(e) => setForecastSteps(Number(e.target.value))}
                    min={1}
                    className="border p-1 rounded ml-2 w-20"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Forecast
            </button>
        </form>
    );
}
