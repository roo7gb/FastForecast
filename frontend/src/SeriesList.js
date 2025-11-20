/*

    SeriesList.js

    Defines the interactive list of Time Series displayed on
    the Forecasting/Viewing page.

    author: Jo Richmond

*/

import React, { useState } from "react";

export default function SeriesList({ series, onSelect, apiBase, onCreated }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    function createSeries() {
        fetch(`${apiBase}/series/`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name, description: desc})
        }).then(r => {
            if (!r.ok) {
                r.json().then(j => alert(JSON.stringify(j)));
                return;
            }
            setName(""); setDesc("");
            onCreated && onCreated();
        });
    }

    return (
    <div>
    <h3>Series</h3>
    <ul>
    {series.map(s => (
    <li key={s.name}><button onClick={() => onSelect(s.name)}>{s.name}</button></li>
    ))}
    </ul>

    <h4>Create series</h4>
    <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
    <br/>
    <input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
    <br/>
    <button onClick={createSeries}>Create</button>
    </div>
    );
}
