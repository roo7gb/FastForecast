/*

    ProtectedRoute.js

    Defines the protected route component used
	to protect certain routes when there is no
	user logged in.

    author: Jo Richmond

*/

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  	const { user } = useAuth();

  	if (!user) {
    	return <Navigate to="/login" replace />;
  	}

  	return children;
}
