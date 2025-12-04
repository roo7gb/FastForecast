/*

    auth.js

    Defines crucial constants and functions for authentication,
    API calls, and CSRF cookie fetching.

    author: Jo Richmond

*/

// this const is used for all HTML methods, already prod ready but my env kept not working so
// a manual or got added
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

// get csrf token
export async function fetchCSRF() {
    await fetch(`${API_BASE}/auth/csrf/`, {
        method: "GET",
        credentials: "include",
    });
}

// POST to signup endpoint
export async function signup(username, password) {
    await fetchCSRF();
    const csrftoken = getCookie("csrftoken");

    const res = await fetch(`${API_BASE}/auth/signup/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ username, password }),
    });

    return await res.json();
}

// cookie parsing
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
