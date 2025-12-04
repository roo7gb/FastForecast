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
import { neonGlowPlugin } from "./utils/neonglow"

// register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend, neonGlowPlugin);

export default function ChartView({ history = [], forecast = [] }) {
	// useMemo because it needs to update as soon as it gets new data
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
					borderColor: "#00F3FF",
					backgroundColor: "#00F3FF",
					borderWidth: 1,
					tension: 0.4,
					pointRadius: 0,
					pointHoverRadius: 4,
					pointBackgroundColor: "#00F3FF",
					pointBorderColor: "#FFFFFF",
					pointBorderWidth: 1,
				},
				{
					label: "Forecast",
					data: forecastPoints,
					borderColor: "#FF007F",
					backgroundColor: "#FF007F",
					borderWidth: 1,
					tension: 0.4,
					pointRadius: 0,
					pointHoverRadius: 4,
					pointBackgroundColor: "#FF007F",
					pointBorderColor: "#FFFFFF",
					pointBorderWidth: 1,
				}
			]
		};
	}, [history, forecast]);

	const purple = "#a855f7";
	const gridPurple = "rgba(168, 85, 247, 0.2)";

	// update the x-axis when there is new data
	const options = useMemo(() => {
		const firstDate = history.length ? new Date(history[0].timestamp) : null;
		const lastHistoryDate = history.length ? new Date(history[history.length - 1].timestamp) : null;
		const lastForecastDate = forecast.length ? new Date(forecast[forecast.length - 1].timestamp) : null;

		return {
			parsing: false,
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: "nearest",
				intersect: false
			},
			plugins: {
				tooltip: {
					backgroundColor: "#161b22",
					titleColor: purple,
					bodyColor: "#e6e6e6",
					borderColor: purple,
					borderWidth: 1,
					callbacks: {
						label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
					}
				},
				legend: {
					position: "top",
					labels: {
						color: purple
					}
				}
			},
			scales: {
				x: {
					type: "time",
					time: { unit: "month", tooltipFormat: "PP" },
					title: { display: true, text: "Time", color: purple },
					ticks: { color: purple },
					grid: { color: gridPurple },
					min: firstDate,
					max: lastForecastDate || lastHistoryDate
				},
				y: {
					title: { display: true, text: "Value", color: purple },
					ticks: { color: purple },
					grid: { color: gridPurple },
					beginAtZero: false
				}
			}
		};
	}, [history, forecast]);

	return (
		<div style={{ height: 400 }}>
			<Line
				key={`${history.length}-${forecast.length}`}
				data={data}
				options={options}
			/>
		</div>
	);
}
