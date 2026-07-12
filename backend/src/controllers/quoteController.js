"use strict";

import quoteService from "../services/quoteService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ── GET /api/quotes/random ─────────────────────────────────────────────────────
export const getRandom = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next(
        ApiError.forbidden("The quote feed is for registered users only."),
      );
    }

    const userId = req.user._id.toString();
    const quote = await quoteService.getRandomQuote(userId);

    return ApiResponse.success(res, "Quote fetched.", { quote });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/quotes/count ──────────────────────────────────────────────────────
export const getCount = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next(
        ApiError.forbidden("The quote feed is for registered users only."),
      );
    }

    const userId = req.user._id.toString();
    const data = await quoteService.getQuoteCount(userId);

    return ApiResponse.success(res, "Quote count fetched.", data);
  } catch (error) {
    next(error);
  }
};

// export default { getRandom, getCount };
