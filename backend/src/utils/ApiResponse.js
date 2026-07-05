"use strict";

/**
 * ApiResponse.js
 * Centralises all API response formatting.
 *
 * Why does this exist?
 * Without it, every controller independently decides the response shape.
 * One might return { ok: true, result: {} }, another { data: {} }, another
 * { success: 1 }. The frontend and mobile app then need to handle all these
 * variations. ApiResponse enforces a single contract:
 *
 *   Success:  { "success": true,  "message": "...", "data": {...} }
 *   Created:  { "success": true,  "message": "...", "data": {...} }   (201)
 *   Error:    { "success": false, "message": "...", "errors": [...] } (handled by errorHandler)
 *
 * Usage in a controller:
 *   return ApiResponse.success(res, 'Quote fetched', { quote });
 *   return ApiResponse.created(res, 'User registered', { user });
 */

class ApiResponse {
  /**
   * 200 OK — general success response
   * @param {object} res - Express response object
   * @param {string} message - Success message shown to the client
   * @param {*} [data=null] - Payload (object, array, or null)
   */
  static success(res, message, data = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * 201 Created — use after successfully creating a new resource
   * (new user, new quote, new category)
   */
  static created(res, message, data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * 200 OK — paginated list response
   * Includes pagination metadata alongside the data array.
   *
   * @param {object} pagination - { page, limit, total, totalPages }
   *
   * Example:
   *   ApiResponse.paginated(res, 'Quotes fetched', quotes, {
   *     page: 1, limit: 10, total: 247, totalPages: 25
   *   });
   */
  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

// module.exports = ApiResponse;
export default ApiResponse;
