"use strict";

/**
 * env.js
 * Validates required environment variables before the server starts.
 *
 * Why? Two reasons:
 *  1. Fail fast — crash at startup with a clear message instead of crashing
 *     mid-request with a cryptic error when a missing variable is first accessed.
 *  2. Self-documentation — this file is the canonical list of every env var
 *     the application requires.
 */

// Every variable here MUST exist in .env or the server will not start.
const REQUIRED = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      [
        "❌ Missing required environment variables:",
        ...missing.map((k) => `   → ${k}`),
        "",
        "   Copy backend/.env.example to backend/.env and fill in the values.",
      ].join("\n"),
    );
  }

  // In development, warn about optional vars that are using defaults.
  // This helps catch misconfigured environments before they cause subtle bugs.
  if (process.env.NODE_ENV === "development") {
    const OPTIONAL_DEFAULTS = {
      PORT: "5000",
      NODE_ENV: "development",
      CLIENT_URL: "http://localhost:5173",
      JWT_EXPIRES_IN: "7d",
      JWT_REFRESH_EXPIRES_IN: "30d",
      RATE_LIMIT_WINDOW_MS: "900000",
      RATE_LIMIT_MAX_REQUESTS: "100",
    };

    Object.entries(OPTIONAL_DEFAULTS).forEach(([key, fallback]) => {
      if (!process.env[key]) {
        console.warn(`⚠️  ${key} is not set — using default: ${fallback}`);
      }
    });
  }
};

// module.exports = { validateEnv };
export { validateEnv };
