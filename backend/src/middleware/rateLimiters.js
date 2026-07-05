"use strict";

/**
 * rateLimiters.js
 * Endpoint-specific rate limiting middleware.
 *
 * ── Why not one global rate limit? ────────────────────────────────────────
 * A single 100 req/15min limit protects against basic abuse but allows
 * 100 login attempts in 15 minutes — still brute-forceable for short passwords.
 * Endpoint-specific limits apply the right constraint to the right endpoint:
 *
 *   /api/auth/login     → 10 attempts per 15 min per IP (very strict)
 *   /api/auth/register  → 5  registrations per hour per IP
 *   /api/auth/refresh   → 30 per 15 min per IP (legitimate apps refresh often)
 *   All other /api/*    → 150 per 15 min per IP (generous for real usage)
 *
 * ── skipSuccessfulRequests ────────────────────────────────────────────────
 * On the login limiter, successful logins don't count against the limit.
 * This means a user who mistypes their password 9 times, then succeeds,
 * still has one attempt before hitting the limit rather than being blocked
 * after a burst of typos. Only FAILED requests consume the budget.
 *
 * ── standardHeaders + legacyHeaders ──────────────────────────────────────
 * standardHeaders: true  → sends RateLimit-Limit, RateLimit-Remaining,
 *                           RateLimit-Reset headers so clients know their budget
 * legacyHeaders: false   → removes deprecated X-RateLimit-* headers
 */

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
