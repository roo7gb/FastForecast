import { useState } from "react";

export default function ForecastForm({ onForecast }) {
  const [series, setSeries] = useState("");
  const [trend, setTrend] = useState("add");
  const [seasonal, setSeasonal] = useState("add");
  const [seasonalPeriods, setSeasonalPeriods] = useState(12);
  const [forecastSteps, setForecastSteps] = useState(12);
  const [logTransform, setLogTransform] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      series,
      trend,
      seasonal,
      seasonal_periods: seasonalPeriods,
      forecast_steps: forecastSteps,
      log_transform: logTransform,
    };
    onForecast(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
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

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={logTransform}
          onChange={(e) => setLogTransform(e.target.checked)}
          className="mr-2"
        />
        <label>Log-transform (stabilize variance, positive values only)</label>
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
