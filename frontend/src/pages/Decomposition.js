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

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip,
    Legend
);

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
            title: { display: true, text: "Concentration" },
            beginAtZero: false,
            min: undefined,
            max: undefined
        }
    }
};

function makeSeries(data, label) {
    return {
        labels: data.map(d => d.timestamp),
        datasets: [
            {
                label,
                data: data.map(d => ({ x: d.timestamp, y: d.value })),
                borderColor: "#8884d8",
                backgroundColor: "#8884d8",
                borderWidth: 1,
                tension: 0.2,
                pointRadius: 0
            }
        ]
    };
}

export default function Decomposition() {
    const [seriesName, setSeriesName] = useState("");
    const [period, setPeriod] = useState(30);
    const [model, setModel] = useState("additive");

    const [result, setResult] = useState(null);

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
        <div>
            <h1>Time Series Decomposition</h1>

            <div style={{ marginBottom: 20 }}>
                <input
                    placeholder="Series name"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                />
                <input
                    type="number"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                />
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="additive">Additive</option>
                    <option value="multiplicative">Multiplicative</option>
                </select>

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
    );
}
