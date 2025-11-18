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

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  annotationPlugin
);

export default function AcfPage() {
  const [seriesName, setSeriesName] = useState("");
  const [nlags, setNlags] = useState(40);
  const [acfData, setAcfData] = useState(null);
  const [ciUpper, setCiUpper] = useState(1.0);
  const [ciLower, setCiLower] = useState(-1.0);

  const options = {
    responsive: true,
    plugins: {
      annotation: {
        annotations: {
          upperCI: {
            type: "line",
            yMin: ciUpper,
            yMax: ciUpper,
            borderColor: "#FF6F61",
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
            borderColor: "#FF6F61",
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

  const chartData = acfData
    ? {
        labels: acfData.map(d => d.lag),
        datasets: [
          {
            label: "ACF",
            data: acfData.map(d => d.acf),
            borderColor: "#8884d8",
            backgroundColor: "#8884d8",
            borderWidth: 1
          }
        ]
      }
    : null;

  return (
    <div>
      <h1>Autocorrelation Function (ACF)</h1>

      <div style={{ marginBottom: 20 }}>
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
  );
}
