import React, { useEffect, useState } from "react";
import SeriesList from "./SeriesList";
import ForecastForm from "./ForecastForm";
import ChartView from "./ChartView";
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

function App() {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/series/`)
      .then(res => res.json())
      .then(data => setSeries(data));
  }, []);

  function loadSeries(name) {
    fetch(`${API_BASE}/series/${name}/`)
      .then(res => res.json())
      .then(data => {
        setSelectedSeries(data);
        setHistory(data.points.map(p => ({ timestamp: p.timestamp, value: p.value })));
        setForecast([]); // Forecast disabled for now
      });
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer">Go to Admin</a>
      <h1 className="app-title">Time Series Forecaster</h1>

      {/* Series Selector Box (Compact and Centered) */}
      <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <SeriesList
          series={series}
          onSelect={loadSeries}
          apiBase={API_BASE}
          onCreated={() => {
            fetch(`${API_BASE}/series/`).then(r => r.json()).then(d => setSeries(d));
          }}
        />
      </div>

      {/* Full-Width Chart (Wider, Centered Below) */}
      {selectedSeries ? (
        <div style={{ maxWidth: "1200px", margin: "40px auto 0 auto" }}>
          <ChartView history={history} forecast={forecast} />
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          Select a series to view and forecast
        </div>
      )}
    </div>
  );
}

export default App;
