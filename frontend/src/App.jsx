import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";

/**
 * Admin panel placeholder — replaced when Phase 9+ builds the real admin UI.
 */
const AdminPlaceholder = () => (
  <div className="container py-5 mt-5 text-center">
    <div className="display-1 mb-4">⚙️</div>
    <h2 className="fw-bold mb-2">Admin Panel</h2>
    <p className="text-muted mb-4">
      Admin authenticated. Full UI coming in a later phase.
    </p>
    <a href="/" className="btn btn-primary px-4">
      ← Back to home
    </a>
  </div>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Protected — any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected — admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPlaceholder />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
