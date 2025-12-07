/*

    Decomposition.js

    Defines the page for running and diplaying Time Series Decomposition
    as a React DOM node for rendering in App.js through Routes.

    author: Jo Richmond

*/

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip,
    Legend
} from "chart.js";
import "chartjs-adapter-date-fns";
import { API_BASE } from "../utils/auth";
import "../App.css"
import { neonGlowPlugin } from "../utils/neonglow";

// Register Chart.js chart components and plugins
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip,
    Legend,
    neonGlowPlugin
);

// Define Chart.js chart options
const options = {
    scales: {
        x: {
        type: "time",
        time: {
            unit: "month",
            tooltipFormat: "PP"
        },
        title: { display: true, text: "Time" },
        },
        y: {
            title: { display: true, text: "Value" },
            beginAtZero: false,
            min: undefined,
            max: undefined
        }
    }
};

// Chart construction function
// It is a function in this file because there are no live updates
function makeSeries(data, label) {
    return {
        labels: data.map(d => d.timestamp),
        datasets: [
            {
                label,
                data: data.map(d => ({ x: d.timestamp, y: d.value })),
                borderColor: "#00F3FF",
                backgroundColor: "#00F3FF",
                borderWidth: 1,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#00F3FF",
                pointBorderColor: "#FFFFFF",
                pointBorderWidth: 1,
            }
        ]
    };
}

export default function Decomposition() {
    const [seriesName, setSeriesName] = useState("");
    const [period, setPeriod] = useState(12);
    const [model, setModel] = useState("additive");

    const [result, setResult] = useState(null);

    // POST to the decomposition endpoint
    const runDecomposition = async () => {
        const res = await fetch(`${API_BASE}/decompose/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                series: seriesName,
                period,
                model
            })
        });

        const data = await res.json();
        setResult(data);
    };

    return (
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>Time Series Decomposition</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <div style={{ 
                    justifyContent: "space-evenly",
                    display: "flex", 
                }}>
                    <div>
                        <label>Series Name: </label>
                        <input
                            placeholder="Series name"
                            value={seriesName}
                            onChange={(e) => setSeriesName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Seasonal Periods: </label>
                        <input
                            type="number"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Seasonal: </label>
                        <select value={model} onChange={(e) => setModel(e.target.value)}>
                            <option value="additive">Additive</option>
                            <option value="multiplicative">Multiplicative</option>
                        </select>
                    </div>

                    <button onClick={runDecomposition} style={{ marginLeft: 15 }}>
                        Decompose
                    </button>
                </div>

                {result && (
                    <div>
                        <h2>Observed</h2>
                        <Line data={makeSeries(result.observed, "Observed")} options={options} />

                        <h2>Trend</h2>
                        <Line data={makeSeries(result.trend, "Trend")} options={options} />

                        <h2>Seasonal</h2>
                        <Line data={makeSeries(result.seasonal, "Seasonal")} options={options} />

                        <h2>Residual</h2>
                        <Line data={makeSeries(result.residual, "Residual")} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
}
