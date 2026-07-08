"use strict";

class apiResponse {
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
   *   apiResponse.paginated(res, 'Quotes fetched', quotes, {
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

export default apiResponse;
