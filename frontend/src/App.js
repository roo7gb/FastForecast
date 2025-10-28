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
    // fetch series with points
    fetch(`${API_BASE}/series/${name}/`)
      .then(res => res.json())
      .then(data => {
        setSelectedSeries(data);
        setHistory(data.points.map(p => ({timestamp: p.timestamp, value: p.value})));
        setForecast([]);
      });
  }

  function runForecast(params) {
    fetch(`${API_BASE}/forecast/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(params)
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json();
        alert("Forecast failed: " + (err.detail || err.error || JSON.stringify(err)));
        return;
      }
      const data = await res.json();
      console.log(data);
      setHistory(data.history);
      setForecast(data.forecast);
    }).catch(e => alert("Forecast failed: " + e.message));
  }

  return (
    <div style={{padding:20, fontFamily:"Arial, sans-serif"}}>
      <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer">Go to Admin</a>
      <h1>Time Series Forecaster</h1>
      <div style={{display:"flex", gap:20}}>
        <div style={{width:300}}>
          <SeriesList series={series} onSelect={loadSeries} apiBase={API_BASE} onCreated={()=>{
            // reload list
            fetch(`${API_BASE}/series/`).then(r=>r.json()).then(d=>setSeries(d));
          }}/>
        </div>

        <div style={{flex:1}}>
          {selectedSeries ? (
            <>
              <h2>Series: {selectedSeries.name}</h2>
              <p>{selectedSeries.description}</p>

              <ForecastForm onForecast={runForecast} />

              <ChartView history={history} forecast={forecast} />
            </>
          ) : (
            <div>Select a series to view and forecast</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
