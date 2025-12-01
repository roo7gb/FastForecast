import React, { useState } from "react";
import { getCookie, API_BASE } from "../utils/auth";

export default function SqlConsole() {
    const [sql, setSql] = useState("");
    const [type, setType] = useState("SELECT");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function runQuery() {
        setError("");
        setResult(null);

        try {
            const res = await fetch(`${API_BASE}/sql/execute/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({ sql, type }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setResult(data);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="page-container" style={{ padding: 20 }}>
            <h1 className="page-title" style={{ textAlign: "center" }}>SQL Console</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="SELECT">SELECT</option>
                    <option value="INSERT">INSERT</option>
                    <option value="DELETE">DELETE</option>
                </select>

                <textarea
                    value={sql}
                    onChange={e => setSql(e.target.value)}
                    rows={8}
                    style={{ width: "100%", marginTop: 10 }}
                    placeholder="Enter SQL..."
                />

                <button onClick={runQuery}>Run SQL</button>

                {error && <pre style={{ color: "red" }}>{error}</pre>}

                {result && (
                    <pre style={{ marginTop: 20 }}>
                    {JSON.stringify(result.rows || result, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
