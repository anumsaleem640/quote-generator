import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute
 * Wraps any route element that requires authentication.
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *
 * If isAuthenticated is false: redirect to "/" immediately.
 * If isAuthenticated is true:  render the children (the real page).
 *
 * Why not check this inside Dashboard.jsx?
 * Putting the guard here means Dashboard never even mounts when the user
 * is not logged in. The Dashboard component can then safely assume
 * req.user always exists without defensive checks everywhere inside it.
 *
 * adminOnly (optional): if true, also requires role === 'admin'.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // replace:true replaces the history entry so the browser back button
    // doesn't take the user back to /dashboard (which would redirect again).
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
