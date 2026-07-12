import { Modal } from "bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { registerUser } from "../../services/authService.js";

/**
 * RegisterModal
 * Four-field registration form rendered as a Bootstrap modal.
 *
 * On success:
 *  1. Backend auto-generates a username and assigns 2 random categories.
 *  2. Tokens are returned in the response body.
 *  3. AuthContext.login() stores them; navigate() goes to /dashboard.
 *
 * Note on the email → username mapping:
 *  The backend generates the username silently. We never show it in the UI.
 *  Users log in with their email; the username exists for system use only.
 */
const RegisterModal = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const closeModal = () => {
    const el = document.getElementById("registerModal");
    const modal = Modal.getInstance(el);
    if (modal) modal.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await registerUser(form);
      const { accessToken, refreshToken, user } = data.data;

      login(user, accessToken, refreshToken);
      closeModal();
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="registerModal"
      tabIndex="-1"
      aria-labelledby="registerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <div>
              <h5
                className="modal-title fw-bold fs-4 mb-1"
                id="registerModalLabel"
              >
                Create your account
              </h5>
              <p className="text-muted small mb-0">
                Free forever. No credit card required.
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
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label
                    htmlFor="regFirstName"
                    className="form-label small fw-semibold"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="regFirstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="col-6">
                  <label
                    htmlFor="regLastName"
                    className="form-label small fw-semibold"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="regLastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Smith"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="regEmail"
                  className="form-label small fw-semibold"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="regEmail"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="regPassword"
                  className="form-label small fw-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="regPassword"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                />
                <div className="form-text">
                  At least 8 characters with uppercase, lowercase, and a number.
                </div>
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
                    Creating account…
                  </>
                ) : (
                  "Create free account"
                )}
              </button>

              <p
                className="text-center text-muted mt-3 mb-0"
                style={{ fontSize: "0.78rem" }}
              >
                By registering you agree to our Terms of Service.
              </p>
            </form>

            <hr className="my-4" />

            <p className="text-center text-muted small mb-0">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                style={{ color: "var(--brand-primary)" }}
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                onClick={closeModal}
              >
                Sign in →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
