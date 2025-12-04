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
        <div className="page-container">
            <h1 className="page-title" style={{ textAlign: "center" }}>Create Account</h1>
            <div className="glowing-container" style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}>
                <div style={{ 
                    justifyContent: "space-evenly",
                    display: "flex" ,
                }}>
                    <form onSubmit={handleSubmit}>
                        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                        <button type="submit">Sign Up</button>
                    </form>
                    <p>{msg}</p>
                </div>
            </div>
        </div>
    );
}
