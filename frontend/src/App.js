import React, { useEffect, useState } from "react";
import SeriesList from "./SeriesList";
import ForecastForm from "./ForecastForm";
import ChartView from "./ChartView";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

function App() {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState([]);

  // Load series when app starts
  useEffect(() => {
    fetch(`${API_BASE}/series/`)
      .then((res) => res.json())
      .then((data) => setSeries(data));
  }, []);

  // Load a selected series
  function loadSeries(name) {
    fetch(`${API_BASE}/series/${name}/`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedSeries(data);
        setHistory(
          data.points.map((p) => ({
            timestamp: p.timestamp,
            value: p.value,
          }))
        );
        setForecast([]); // Clear forecast when changing series
      });
  }

  // Run forecast using ForecastForm parameters
  function runForecast(params) {
    if (!selectedSeries) {
      alert("Please select a series first.");
      return;
    }
    fetch(`${API_BASE}/forecast/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        series: selectedSeries.name,
        ...params,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.forecast_points) {
          setForecast(data.forecast_points);
        } else {
          alert("Error running forecast.");
        }
      });
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Admin Link */}
      <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer">
        Go to Admin
      </a>

      {/* Title */}
      <h1 className="app-title">Time Series Forecaster</h1>

      {/* Main Glowing Container */}
      <div
        className="glowing-container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* STEP 1 & 2: Create Series + Existing Series List (always visible) */}
        <SeriesList
          series={series}
          onSelect={loadSeries}
          apiBase={API_BASE}
          onCreated={() => {
            fetch(`${API_BASE}/series/`)
              .then((r) => r.json())
              .then((d) => setSeries(d));
          }}
        />

        {/* STEP 3: ForecastForm (only visible after a series is selected) */}
        {selectedSeries && (
          <div style={{ marginTop: "30px" }}>
            <ForecastForm onForecast={runForecast} />
          </div>
        )}

        {/* STEP 4: Chart (only visible after series is selected) */}
        <div style={{ marginTop: "30px" }}>
          {selectedSeries ? (
            <ChartView history={history} forecast={forecast} />
          ) : (
            <p>Select a series to view chart</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
