import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
            <Link to="/">Home</Link>

            {!user && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </>
            )}

            {user && (
                <>
                    <Link to="/forecast">Forecast</Link>
                    <Link to="/acf">ACF</Link>
                    <Link to="/decomposition">Decomposition</Link>
                    <Link to="/console">SQL Console</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        
            <Link to="/about">About</Link>
        </nav>
    );
}
