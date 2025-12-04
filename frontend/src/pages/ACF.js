/*

    ACF.js

    Defines the page for running autocorrelations
    and displaying their associated correlograms
    as a React DOM node for rendering in App.js
    through Routes.

    author: Jo Richmond

*/

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Tooltip,
    Legend
} from "chart.js";
import { API_BASE } from "../utils/auth";
import { neonGlowPlugin } from "../utils/neonglow";

// Register Chart.js parts and pluginss
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Tooltip,
    Legend,
    annotationPlugin,
    neonGlowPlugin
);

export default function AcfPage() {
    const [seriesName, setSeriesName] = useState("");
    const [nlags, setNlags] = useState(40);
    const [acfData, setAcfData] = useState(null);
    const [ciUpper, setCiUpper] = useState(1.0);
    const [ciLower, setCiLower] = useState(-1.0);

    // Define the Chart.js chart options
    const options = {
        responsive: true,
        plugins: {
            annotation: {
                annotations: {
                    upperCI: {
                        type: "line",
                        yMin: ciUpper,
                        yMax: ciUpper,
                        borderColor: "#FF007F",
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        label: {
                            enabled: true,
                            content: `+${ciUpper.toFixed(3)}`
                        }
                    },
                    lowerCI: {
                        type: "line",
                        yMin: ciLower,
                        yMax: ciLower,
                        borderColor: "#FF007F",
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        label: {
                            enabled: true,
                            content: `${ciLower.toFixed(3)}`
                        }
                    }
                }
            }
        },

        scales: {
            y: { beginAtZero: true }
        }
    };

    // POST to the ACF endpoint
    const runACF = async () => {
        const res = await fetch(`${API_BASE}/acf/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ series: seriesName, nlags })
        });

        const data = await res.json();
        setAcfData(data.acf);
        setCiUpper(data.ci_upper);
        setCiLower(data.ci_lower);
    };

    // Define the data for the Chart.js chart
    const chartData = acfData ? {
        labels: acfData.map(d => d.lag),
        datasets: [
            {
                label: "ACF",
                data: acfData.map(d => d.acf),
                borderWidth: 1,
                borderColor: "#00F3FF",
                backgroundColor: "#00F3FF",
            }
        ]
    } : null;

    return (
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>Autocorrelation Function (ACF)</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <div style={{ 
                    justifyContent: "space-evenly",
                    display: "flex", 
                }}>
                    <input
                        placeholder="Series name"
                        value={seriesName}
                        onChange={e => setSeriesName(e.target.value)}
                    />
                    <input
                        type="number"
                        value={nlags}
                        onChange={e => setNlags(e.target.value)}
                    />
                    <button onClick={runACF}>Compute ACF</button>
                </div>

                {chartData && (
                    <div style={{ height: 450 }}>
                    <Bar data={chartData} options={options} />
                </div>
                )}
            </div>
        </div>
    );
}
