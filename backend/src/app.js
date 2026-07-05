"use strict";

/**
 * app.js  (Phase 14 update)
 *
 * Changes from Phase 3:
 *  1. Removed the single global rate limiter on /api — replaced with
 *     endpoint-specific limiters imported from rateLimiters.js and applied
 *     directly on the route files that need them (see authRoutes.js).
 *     A general fallback limiter still protects all other /api/* routes.
 *
 *  2. Helmet is now configured with an explicit Content Security Policy (CSP).
 *     The default Helmet call sets useful headers but leaves CSP disabled.
 *     An explicit CSP blocks the most common XSS injection vectors.
 *
 *  3. Additional security headers beyond Helmet's defaults:
 *     - Permissions-Policy: disables browser APIs the app doesn't use
 *     - X-Content-Type-Options, Referrer-Policy: already in Helmet defaults,
 *       but documented here for visibility
 *
 *  4. express-mongo-sanitize is now configured with replaceWith: '_' so
 *     operators in field names are replaced rather than stripped, making
 *     the sanitization visible in logs during debugging.
 */

import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { generalLimiter } from "./middleware/rateLimiters.js";
import routes from "./routes/index.js";

const app = express();

// Trust the first proxy hop (required on Render / Railway / Heroku)
app.set("trust proxy", 1);

// ── 1. Helmet — security headers ───────────────────────────────────────────────
app.use(
  helmet({
    // Content Security Policy — the single most effective XSS mitigation
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Bootstrap inline styles
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // HSTS — force HTTPS for 1 year (only active in production)
    hsts:
      process.env.NODE_ENV === "production"
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    // Helmet already sets these; listed here for documentation
    xContentTypeOptions: true, // nosniff
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginEmbedderPolicy: false, // required for some CDN fonts
  }),
);

// Permissions-Policy: disable browser APIs the app doesn't use
// Reduces the attack surface of a compromised script
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  next();
});

// ── 2. CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  // Add additional allowed origins here for staging environments
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
);

// ── 3. General rate limit — fallback for all /api/* routes ────────────────────
// Auth-specific limits (login, register, refresh) are applied in authRoutes.js
// and are stricter than this fallback.
app.use("/api", generalLimiter);

// ── 4. Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── 5. NoSQL injection sanitization ───────────────────────────────────────────
// replaceWith: '_' makes sanitization visible ($ → _) rather than silently
// removing operators, which is easier to spot in logs and error messages.
app.use(mongoSanitize({ replaceWith: "_" }));

// ── 6. Gzip compression ────────────────────────────────────────────────────────
app.use(compression());

// ── 7. HTTP request logging ────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // In production, log only errors and slow requests
  app.use(
    morgan("combined", {
      skip: (req, res) => res.statusCode < 400,
    }),
  );
}

// ── 8. API routes ──────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 9. 404 handler ─────────────────────────────────────────────────────────────
app.use(notFound);

// ── 10. Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// module.exports = app;
export default app;
