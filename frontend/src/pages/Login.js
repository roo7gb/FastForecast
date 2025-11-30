/*

    Login.js

    Defines the page for user verification as a React DOM
    node for rendering in App.js through Routes

    author: Jo Richmond

*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await login(username, password);
        if (result.error) setMsg(result.error);
        else {
            setMsg("Login successful!");
            navigate("/");
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                <button type="submit">Log In</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}
