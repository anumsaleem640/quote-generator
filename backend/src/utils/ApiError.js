"use strict";

/**
 * ApiError.js
 * Custom error class for known, operational errors.
 *
 * Why extend Error?
 * Throwing a plain Error gives you only a message and a stack trace.
 * ApiError adds statusCode and isOperational so the error handler can
 * decide: was this an expected failure (send the message) or an unexpected
 * bug (send a generic "Internal Server Error" instead)?
 *
 * Usage:
 *   throw new ApiError('User not found', 404);
 *   throw ApiError.unauthorized('Invalid credentials');
 *   next(new ApiError('Category limit reached', 403));
 */

class ApiError extends Error {
  /**
   * @param {string} message    - Human-readable description shown to the client
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 500…)
   */
  constructor(message, statusCode) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;

    // 'fail' for 4xx (client made a mistake), 'error' for 5xx (server problem)
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    // isOperational = true means this is an expected, intentional error.
    // The error handler will use this flag to decide whether to expose the
    // message or return a generic "Internal Server Error" instead.
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor itself from the trace.
    // Makes debugging cleaner — the stack starts at the throw site, not here.
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Static factory methods ─────────────────────────────────────────────────────
// Convenience shortcuts for the most common HTTP errors.
// Usage: throw ApiError.notFound('Quote not found');

ApiError.badRequest = (msg) => new ApiError(msg || "Bad request", 400);
ApiError.unauthorized = (msg) =>
  new ApiError(msg || "Authentication required", 401);
ApiError.forbidden = (msg) => new ApiError(msg || "Access denied", 403);
ApiError.notFound = (msg) => new ApiError(msg || "Resource not found", 404);
ApiError.conflict = (msg) =>
  new ApiError(msg || "Resource already exists", 409);
ApiError.internal = (msg) => new ApiError(msg || "Internal server error", 500);

// module.exports = ApiError;
export default ApiError;
