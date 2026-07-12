import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logoutUser } from "../services/authService.js";

/**
 * Navbar
 * Fixed at the top of every page.
 *
 * When unauthenticated: shows marketing nav links and Login / Get Started buttons.
 *   - Buttons use data-bs-toggle="modal" + data-bs-target to open Bootstrap
 *     modals without any JavaScript — Bootstrap's bundled JS handles it.
 *
 * When authenticated: shows "Welcome, FirstName" + Dashboard/Admin + Logout.
 *
 * Scroll behaviour: adds a shadow class once the user scrolls past 20px.
 */
const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(); // tells backend to acknowledge (stateless, so optional)
    } catch {
      // Ignore network errors on logout — we clear locally regardless
    }
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top ${scrolled ? "scrolled" : ""}`}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-5" to="/">
          <span className="gradient-text">💬 QuoteGen</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Marketing links — hidden once logged in */}
          {!isAuthenticated && (
            <ul className="navbar-nav me-auto ms-3 gap-1">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#pricing">
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          )}

          {/* Right-side auth controls */}
          <div className="ms-auto d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {isAuthenticated ? (
              <>
                <span className="text-white-50 small me-1">
                  Welcome,{" "}
                  <span className="text-white fw-semibold">
                    {user?.firstName}
                  </span>
                </span>

                {isAdmin ? (
                  <Link to="/admin" className="btn btn-sm btn-outline-warning">
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="btn btn-sm btn-outline-light"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* data-bs-toggle + data-bs-target open Bootstrap modals — no JS needed */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#registerModal"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
