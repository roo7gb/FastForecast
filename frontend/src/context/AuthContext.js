import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE, fetchCSRF, getCookie } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/auth/user/`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.username || null))
      .catch(() => setUser(null));
  }, []);

  const login = async (username, password) => {
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

    if (!res.ok) throw new Error ("Login failed!");

    const data = await res.json;
    setUser(data.username);
  };

  const logout = async () => {
    const csrftoken = getCookie("csrftoken");

    await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrftoken },
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
