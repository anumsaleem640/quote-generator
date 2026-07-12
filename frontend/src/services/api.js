import axios from "axios";

/**
 * api.js
 * Single Axios instance shared by every service file.
 *
 * Why a shared instance?
 * It lets us configure base URL, default headers, timeouts, and
 * interceptors in one place. Every API call inherits these settings
 * automatically — no repetition across service files.
 *
 * Environment variable:
 *   VITE_API_URL=http://localhost:5000/api  (set in frontend/.env)
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000, // 10-second request timeout
});

// ── Request interceptor ────────────────────────────────────────────────────────
// Runs before every request is sent.
// Reads the token from localStorage and attaches it as a Bearer header.
// This means you never have to manually add the token in service files.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("qg_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ───────────────────────────────────────────────────────
// Runs after every response (or error) arrives.
// On 401: the token is expired or invalid — clear credentials and
// redirect to home so the user can log in again.
// On everything else: pass the error through so calling code can handle it.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials
      ["qg_user", "qg_access_token", "qg_refresh_token"].forEach((k) =>
        localStorage.removeItem(k),
      );
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
