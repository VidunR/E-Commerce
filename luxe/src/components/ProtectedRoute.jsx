import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

/**
 * ProtectedRoute
 * Prevents access to routes unless the user is logged in
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If user is NOT logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User exists → allow access
  return children;
}
