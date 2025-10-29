import React, { useState } from "react";

export default function ForecastForm({ onRun }) {
  const [method, setMethod] = useState("additive");
  const [periods, setPeriods] = useState(10);
  const [confidence, setConfidence] = useState(95);

  function handleSubmit(e) {
    e.preventDefault();
    onRun({
      method,
      periods: Number(periods),
      confidence: Number(confidence),
    });
  }

  return (
    <div className="card" style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      maxWidth: "400px",
      margin: "0 auto"
    }}>
      <h3>Forecast Settings</h3>
      <form onSubmit={handleSubmit}>
        <label>Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="additive">Additive</option>
          <option value="multiplicative">Multiplicative</option>
        </select>
        <br />

        <label>Forecast Periods:</label>
        <input
          type="number"
          value={periods}
          onChange={(e) => setPeriods(e.target.value)}
        />
        <br />

        <label>Confidence Interval (%):</label>
        <input
          type="number"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
        />
        <br />

        <button type="submit">Run Forecast</button>
      </form>
    </div>
  );
}
