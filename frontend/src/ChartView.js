/*

    ChartView.js

    Defines the chart used for the page for Time Series viewing
    and forecasting. Gets its own file due to it updating its render
    to add points, unlike the other charts on other pages.

    author: Jo Richmond

*/

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip,
    Legend
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { useRef, useEffect } from "react";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend);

export default function ChartView({ history = [], forecast = [] }) {
    const data = useMemo(() => {
        const historyPoints = history.map(h => ({
            x: new Date(h.timestamp),
            y: h.value
        }));

        const forecastPoints = forecast.map(f => ({
            x: new Date(f.timestamp),
            y: f.value
        }));

        return {
            datasets: [
                {
                    label: "History",
                    data: historyPoints,
                    borderColor: "#8884d8",
                    backgroundColor: "#8884d8",
                    borderWidth: 1,
                    tension: 0.2,
                    pointRadius: 1,
                },
                {
                    label: "Forecast",
                    data: forecastPoints,
                    borderColor: "#FF6F61",
                    backgroundColor: "#FF6F61",
                    borderDash: [6, 4],
                    borderWidth: 1,
                    tension: 0.2,
                    pointRadius: 1,
                }
            ]
        };
    }, [history, forecast]);
    
    const options = useMemo(() => ({
        parsing: false,
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "nearest",
            intersect: false
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                    }
                }
            },
            legend: {
                position: "top"
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "month",
                    tooltipFormat: "PP"
                },
                title: { display: true, text: "Time" },
                min: new Date(history[0].timestamp),
                max: forecast.length > 0 ? new Date(forecast[forecast.length - 1].timestamp) : new Date(history[history.length - 1].timestamp)
            },
            y: {
                title: { display: true, text: "Concentration" },
                beginAtZero: false,
                min: undefined,
                max: undefined
            }
        }
    }), [history, forecast]);

    return (
        <div style={{ height: 400 }}>
            <Line
                key={`${history.length}-${forecast.length}`} // force re-render on new data
                data={data}
                options={options}
            />
        </div>
    );
}
