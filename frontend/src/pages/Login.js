/*

    Login.js

    Defines the page for user verification as a React DOM
    node for rendering in App.js through Routes

    author: Jo Richmond

*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
        navigate("/");
        window.location.reload();
    };


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
