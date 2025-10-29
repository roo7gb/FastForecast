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

const neonGlowPlugin = {
  id: 'neonGlow',
  beforeDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = 'rgba(168, 85, 247, 0.75)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  },
  afterDraw(chart) {
    chart.ctx.restore();
  }
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend, neonGlowPlugin);

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
    borderColor: "#00F3FF",       // Neon Cyan
    backgroundColor: "#00F3FF",
    borderWidth: 1,               // Ultra-thin line
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
    borderColor: "#FF007F",       // Neon Pink
    backgroundColor: "#FF007F",
    borderWidth: 1,               // Ultra-thin line
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
