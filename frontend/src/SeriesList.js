/*

    SeriesList.js

    Defines the interactive list of Time Series displayed on
    the Forecasting/Viewing page.

    author: Jo Richmond

*/

import React, { useState } from "react";
import { API_BASE, getCookie } from "./utils/auth";

export default function SeriesList({ series, onSelect, apiBase, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [csvText, setCsvText] = useState("");
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState("");

    function parseIsoTimestamp(input) {
        const trimmed = input.trim();

        const native = Date.parse(trimmed);
        if (!Number.isNaN(native)) return new Date(native);

        const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[+\-]\d{2}:\d{2})?)?$/;

        if (isoRegex.test(trimmed)) {
            const d = new Date(trimmed);
            if (!Number.isNaN(d.getTime())) return d;
        }

        return null;
    }

    function validateCsv(text) {
        const rows = text.split(/\r?\n/).filter((r) => r.trim() !== "");
        const result = [];

        for (let i = 1; i < rows.length; i++) {
            const [timestamp, value] = rows[i].split(",");

            if (!timestamp || !value) {
                return { ok: false, error: "Each CSV row must be: timestamp,value" };
            }

            const parsedDate = parseIsoTimestamp(timestamp);
            if (!parsedDate) {
                return { ok: false, error: `Invalid timestamp: ${timestamp}` };
            }

            const num = Number(value);
            if (Number.isNaN(num)) {
                return { ok: false, error: `Invalid numeric value: ${value}` };
            }

            result.push({
                timestamp: parsedDate.toISOString(),
                value: num
            });
        }

        return { ok: true, data: result };
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            setCsvText(text);

            const parsed = validateCsv(text);
            if (!parsed.ok) {
                setError(parsed.error);
                setParsedData(null);
            } else {
                setError("");
                setParsedData(parsed.data);
            }
        };
        reader.readAsText(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!parsedData) {
            setError("No valid CSV data to submit.");
            return;
        }

        const payload = {
            title,
            description,
            points: parsedData
        };

        try {
            const csrftoken = getCookie("csrftoken");
            const res = await fetch(`${API_BASE}/upload/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                setError("Upload failed: " + JSON.stringify(data));
                return;
            }

            alert("Series uploaded successfully!");
            setTitle("");
            setDescription("");
            setCsvText("");
            setParsedData(null);
            setError("");
            onCreated();

        } catch (err) {
            setError("Request error: " + err.message);
        }
    }


    return (
    <div>
        <h3>Series</h3>
        <ul>
            {series.map(s => (
                <li key={s.name}><button onClick={() => onSelect(s.name)}>{s.name}</button></li>
            ))}
        </ul>

        <div style={{ maxWidth: 600, margin: "20px auto" }}>
            <h2>Upload Time Series CSV</h2>

            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 10 }}
                />

                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "100%", marginBottom: 10 }}
                />

                <label>CSV File:</label>
                <input type="file" accept=".csv" onChange={handleFileUpload} />

                {error && (
                    <div style={{ color: "red", marginTop: 10 }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {parsedData && (
                    <div style={{ marginTop: 20 }}>
                        <h4>Preview (first 5 rows):</h4>
                        <pre style={{ background: "#eee", padding: 10 }}>
                            {JSON.stringify(parsedData.slice(0, 5), null, 2)}
                        </pre>
                    </div>
                )}

                <button
                    type="submit"
                    style={{ marginTop: 20, padding: "10px 20px" }}
                    disabled={!parsedData}
                >
                    Upload Series
                </button>
            </form>
        </div>
    </div>
  );
}
