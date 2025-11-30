/*
    App.js

    Routes to the other pages in the website, is the virtual DOM node
    that is rendered in index.js.

    author: Jo Richmond
*/

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import ACF from "./pages/ACF";
import Decomposition from "./pages/Decomposition";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";

export default function App() {
    return (
        <Router>
            <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
                <Link to="/" style={{ marginRight: 15 }}>Home</Link>
                <Link to="/forecast" style={{ marginRight: 15 }}>Forecast</Link>
                <Link to="/acf" style={{ marginRight: 15 }}>ACF</Link>
                <Link to="/decomposition" style={{ marginRight: 15 }}>Decomposition</Link>
                <Link to="/about" style={{ marginRight: 15 }}>About</Link>
                <Link to="/signup" style={{ marginRight: 15 }}>Sign Up</Link>
                <Link to="/login" style={{ marginLeft: 15 }}>Log In</Link>
            </nav>

            <div style={{ padding: 20 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/forecast" element={<Forecast />} />
                    <Route path="/acf" element={<ACF />} />
                    <Route path="/decomposition" element={<Decomposition />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}
