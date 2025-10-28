import React, { useState } from "react";

export default function SeriesList({ series, onSelect, apiBase, onCreated }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  function createSeries() {
    fetch(`${apiBase}/series/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc })
    }).then((r) => {
      if (!r.ok) {
        r.json().then((j) => alert(JSON.stringify(j)));
        return;
      }
      setName("");
      setDesc("");
      onCreated && onCreated();
    });
  }

  return (
    <div className="card">
      <h3 className="section-title">Series</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {series.map((s) => (
          <li key={s.name} style={{ marginBottom: "8px" }}>
            <button className="series-button" onClick={() => onSelect(s.name)}>
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      <h4 className="section-title">Create Series</h4>
      <input
        className="input-field"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        className="input-field"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <br />
      <button className="create-button" onClick={createSeries}>
        Create
      </button>
    </div>
  );
}
