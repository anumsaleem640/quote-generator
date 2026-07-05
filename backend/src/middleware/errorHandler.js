"use strict";

/**
 * errorHandler.js
 * Global error handling middleware — must be the LAST app.use() in app.js.
 *
 * Express recognises error handlers by their 4-parameter signature: (err, req, res, next).
 * Any middleware that calls next(err) will skip all normal middleware and land here.
 *
 * This handler normalises six categories of error into consistent ApiError instances:
 *   1. Our own ApiError instances (from controllers and services)
 *   2. Mongoose CastError    — invalid ObjectId format in a URL param
 *   3. Mongoose code 11000   — duplicate key (unique index violation)
 *   4. Mongoose ValidationError — schema validation failure
 *   5. JsonWebTokenError     — malformed JWT token
 *   6. TokenExpiredError     — JWT that has passed its expiry time
 *   7. Everything else       — unexpected/programming errors
 */

import ApiError from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // ── Development: log full details ─────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    console.error("\n❌ Error caught by errorHandler:");
    console.error(`   ${req.method} ${req.originalUrl}`);
    console.error(`   ${err.name}: ${err.message}`);
    if (err.stack) console.error(`\n${err.stack}\n`);
  }

  // ── Mongoose: CastError ────────────────────────────────────────────────────
  // Triggered when a route parameter like /api/quotes/:id receives a value
  // that cannot be cast to a MongoDB ObjectId (e.g. "/api/quotes/not-an-id").
  if (err.name === "CastError") {
    error = new ApiError(`Invalid ID format: '${err.value}'`, 400);
  }

  // ── Mongoose: Duplicate Key ────────────────────────────────────────────────
  // Triggered when a unique index is violated (e.g. registering with an
  // email that already exists in the database).
  // err.code 11000 is MongoDB's duplicate key error code.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    error = new ApiError(
      `'${value}' is already registered for field '${field}'`,
      409,
    );
  }

  // ── Mongoose: Validation Error ─────────────────────────────────────────────
  // Triggered when a document fails schema validation (e.g. missing required
  // field, value outside enum, string too long).
  // Collect all validation messages and join them into one readable string.
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(messages.join(" | "), 400);
  }

  // ── JWT: Malformed token ────────────────────────────────────────────────────
  // Triggered when the token cannot be decoded — tampered or incorrectly formed.
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(
      "Invalid or malformed token. Please log in again.",
      401,
    );
  }

  // ── JWT: Expired token ──────────────────────────────────────────────────────
  // Triggered when a valid token is presented after its exp timestamp has passed.
  if (err.name === "TokenExpiredError") {
    error = new ApiError("Your session has expired. Please log in again.", 401);
  }

  // ── Build and send the response ────────────────────────────────────────────
  const statusCode = error.statusCode || 500;

  // Only expose the specific message for operational errors (things we threw intentionally).
  // For unexpected bugs (isOperational is falsy), hide internals from the client.
  const message = error.isOperational ? error.message : "Internal Server Error";

  const body = { success: false, message };

  // In development, attach the stack trace to help with debugging.
  // NEVER send stack traces in production — they expose implementation details.
  if (process.env.NODE_ENV === "development" && !error.isOperational) {
    body.debug = { stack: err.stack };
  }

  res.status(statusCode).json(body);
};

// module.exports = errorHandler;

export default errorHandler;
