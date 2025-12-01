import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    const linkStyle = {
        margin: "1rem",
        textDecoration: "none",
        color: "#00f3ff",
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            color: "#00f3ff",
            fontWeight: "bolder",
            fontSize: "1rem",
        }}>
            <Link to="/" style={ linkStyle } >Home</Link>

            {!user && (
                <>
                    <Link to="/login" style={ linkStyle } >Login</Link>
                    <Link to="/signup" style={ linkStyle } >Sign Up</Link>
                </>
            )}

            {user && (
                <>
                    <Link to="/forecast" style={ linkStyle } >Forecast</Link>
                    <Link to="/acf" style={ linkStyle } >ACF</Link>
                    <Link to="/decomposition" style={ linkStyle } >Decomposition</Link>
                    <Link to="/console" style={ linkStyle } >SQL Console</Link>
                </>
            )}
        
            <Link to="/about" style={ linkStyle } >About</Link>
            <Link to="/help" style={ linkStyle } >Help</Link>

            {user && (
                <button onClick={logout}>Logout</button>
            )}
        </div>
    );
}
