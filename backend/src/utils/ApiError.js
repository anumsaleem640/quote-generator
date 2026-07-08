"use strict";

class apiError extends Error {
  /**
   * @param {string} message    - Human-readable description shown to the client
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 500…)
   */
  constructor(message, statusCode) {
    super(message);

    this.name = "apiError";
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
// Usage: throw apiError.notFound('Quote not found');

apiError.badRequest = (msg) => new apiError(msg || "Bad request", 400);
apiError.unauthorized = (msg) =>
  new apiError(msg || "Authentication required", 401);
apiError.forbidden = (msg) => new apiError(msg || "Access denied", 403);
apiError.notFound = (msg) => new apiError(msg || "Resource not found", 404);
apiError.conflict = (msg) =>
  new apiError(msg || "Resource already exists", 409);
apiError.internal = (msg) => new apiError(msg || "Internal server error", 500);

// module.exports = apiError;
export default apiError;
