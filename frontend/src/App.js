/*

    App.js

    Routes to the other pages in the website, is the virtual DOM node
    that is rendered in index.js.

    author: Jo Richmond

*/

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import ACF from "./pages/ACF";
import Decomposition from "./pages/Decomposition";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/forecast" element={ 
                        <ProtectedRoute>
                            <Forecast />
                        </ProtectedRoute> } />
                    <Route path="/acf" element={ 
                        <ProtectedRoute>
                            <ACF />
                        </ProtectedRoute> } />
                    <Route path="/decomposition" element={ 
                        <ProtectedRoute>
                            <Decomposition />
                        </ProtectedRoute> } />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
