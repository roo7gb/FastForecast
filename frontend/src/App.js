import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import Admin from "./pages/ACF";
import About from "./pages/About";
import ACF from "./pages/ACF";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 15 }}>Home</Link>
        <Link to="/forecast" style={{ marginRight: 15 }}>Forecast</Link>
        <Link to="/acf" style={{ marginRight: 15 }}>ACF</Link>
        <Link to="/about">About</Link>
      </nav>

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/acf" element={<ACF />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
