import { getCookie } from "./utils/cookies";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

export async function fetchCSRF() {
  await fetch(`${API_BASE}/auth/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

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

export async function login(username, password) {
  await fetchCSRF();
  const csrftoken = getCookie("csrftoken");

  const res = await fetch(`${API_BASE}/auth/login/`, {
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

export async function logout() {
  const csrftoken = getCookie("csrftoken");

  await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": csrftoken },
  });
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/user/`, {
    credentials: "include",
  });
  return await res.json();
}
