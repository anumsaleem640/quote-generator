import { Modal } from "bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { loginUser } from "../../services/authService.js";

/**
 * LoginModal
 * Rendered inside Home.jsx so Bootstrap can find it via data-bs-target="#loginModal".
 *
 * Key patterns:
 *  - Controlled inputs: every keystroke updates React state via handleChange.
 *  - Bootstrap.Modal.getInstance(): lets us programmatically close the modal
 *    after a successful login without re-mounting the component.
 *  - Generic error message: the backend already returns "Invalid email or password"
 *    for both wrong email and wrong password — we surface it as-is.
 *  - Role-based navigation: user.role determines whether to go to /dashboard or /admin.
 */
const LoginModal = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(""); // clear error as user types
  };

  const closeModal = () => {
    const el = document.getElementById("loginModal");
    const modal = Modal.getInstance(el);
    if (modal) modal.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await loginUser(form);
      const { accessToken, refreshToken, user } = data.data;

      login(user, accessToken, refreshToken);
      closeModal();
      setForm({ email: "", password: "" }); // reset for next open

      // The backend returns role: 'admin' for admin logins, 'user' for everyone else
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <div>
              <h5
                className="modal-title fw-bold fs-4 mb-1"
                id="loginModalLabel"
              >
                Welcome back
              </h5>
              <p className="text-muted small mb-0">
                Sign in to see your daily quotes.
              </p>
            </div>
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 pt-3 pb-4">
            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label
                  htmlFor="loginEmail"
                  className="form-label small fw-semibold"
                >
                  Email address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="loginPassword"
                  className="form-label small fw-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <hr className="my-4" />

            <p className="text-center text-muted small mb-0">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                style={{ color: "var(--brand-primary)" }}
                data-bs-toggle="modal"
                data-bs-target="#registerModal"
                onClick={closeModal}
              >
                Create one free →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
