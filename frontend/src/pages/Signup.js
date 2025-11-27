/*

    Signup.js

    Defines the page for account creation as 
    a React DOM node for rendering in App.js
    through Routes.

    author: Jo Richmond

*/

import React, { useState } from "react";
import { signup } from "../utils/auth";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await signup(username, password);
        if (result.error) setMsg(result.error);
        else setMsg("Signup successful! You can now log in.");
    }

    return (
        <div>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}
