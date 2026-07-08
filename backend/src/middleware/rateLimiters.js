"use strict";

import rateLimit from "express-rate-limit";

// ── Auth: Login ────────────────────────────────────────────────────────────────
// Strictest limit in the application. 10 failed attempts before 15-min lockout.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true, // only count failed logins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login attempts from this IP. " +
      "Please wait 15 minutes before trying again.",
  },
});

// ── Auth: Register ─────────────────────────────────────────────────────────────
// Prevents account farming (creating thousands of accounts).
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many accounts created from this IP. " +
      "Please wait 1 hour before registering again.",
  },
});

// ── Auth: Token Refresh ────────────────────────────────────────────────────────
// Generous — mobile apps and SPAs legitimately refresh tokens often.
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many token refresh requests. Please wait 15 minutes.",
  },
});

// ── General API ─────────────────────────────────────────────────────────────────
// Applied to all /api/* routes not covered by a specific limiter above.
// More generous than the auth limits — legitimate dashboard usage is frequent.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
});

export { generalLimiter, loginLimiter, refreshLimiter, registerLimiter };
