/*

    Forecast.js

    Defines the page for forecasting and viewing time series as
    a React DOM node for rendering in App.js through Routes.

    author: Jo Richmond

*/

import React, { useEffect, useState } from "react";
import SeriesList from "../SeriesList";
import ForecastForm from "../ForecastForm";
import ChartView from "../ChartView";
import { API_BASE } from "../utils/auth";
import "../App.css";

export default function Forecast() {
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [history, setHistory] = useState([]);
    const [forecast, setForecast] = useState([]);

    // For the series reloading
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

    // POST to the Holt-Winters endpoint
    function runForecastHW(params) {
        fetch(`${API_BASE}/forecast/hw/`, {
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
    
    // POST to the arima endpoint
    function runForecastARIMA(params) {
        fetch(`${API_BASE}/forecast/arima/`, {
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
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>Time Series Forecaster</h1>
            <div className="glowing-container" style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px",
            }}>
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
                            
                            <ForecastForm
                                // pass the functions as props to the form component
                                onForecastHW={runForecastHW} onForecastARIMA={runForecastARIMA} 
                            />

                            <ChartView
                                // pass the points to the chart element as props
                                history={history} forecast={forecast} 
                            />
                            </>
                        ) : (
                            <div>Select a series to view and forecast</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
