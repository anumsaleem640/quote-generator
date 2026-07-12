"use strict";

/**
 * adminQuoteService.js
 * Quote management for the admin panel.
 *
 * Admin sees ALL quotes (active and inactive).
 * Every write operation validates that the target category is active
 * before allowing the change — you can't add a quote to a deleted category.
 */

import Category from "../models/Category.js";
import Quote from "../models/Quote.js";
import ApiError from "../utils/ApiError.js";

// ── getAllQuotesAdmin ──────────────────────────────────────────────────────────

/**
 * Paginated list of all quotes with their category name populated.
 * Supports optional filters:
 *  ?categoryId=<id>   — filter by a specific category
 *  ?search=<text>     — case-insensitive search within quoteText
 *  ?page=1&limit=20   — pagination
 */
export const getAllQuotesAdmin = async ({
  page = 1,
  limit = 20,
  categoryId,
  search,
} = {}) => {
  const query = {};
  if (categoryId) query.categoryId = categoryId;
  if (search) query.quoteText = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  const [quotes, total] = await Promise.all([
    Quote.find(query)
      .populate("categoryId", "name isActive")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Quote.countDocuments(query),
  ]);

  return {
    quotes,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ── getQuoteById ──────────────────────────────────────────────────────────────

export const getQuoteById = async (id) => {
  const quote = await Quote.findById(id).populate(
    "categoryId",
    "name isActive",
  );
  if (!quote) throw ApiError.notFound("Quote not found.");
  return quote;
};

// ── createQuote ────────────────────────────────────────────────────────────────

/**
 * Creates a new quote inside an active category.
 * Rejecting quotes for inactive categories prevents content from
 * appearing in a category that users cannot see.
 */
export const createQuote = async ({
  categoryId,
  quoteText,
  author = "Unknown",
}) => {
  const category = await Category.findOne({ _id: categoryId, isActive: true });
  if (!category) {
    throw ApiError.notFound("Category not found or is currently inactive.");
  }

  const quote = await Quote.create({
    categoryId,
    quoteText: quoteText.trim(),
    author: author.trim(),
    createdBy: null, // hardcoded admin has no DB document
  });

  // Return with populated category so the admin UI doesn't need a second fetch
  return Quote.findById(quote._id).populate("categoryId", "name");
};

// ── updateQuote ────────────────────────────────────────────────────────────────

/**
 * Partial update — change any combination of quoteText, author, categoryId,
 * or isActive. Setting isActive: true re-activates a soft-deleted quote.
 */
export const updateQuote = async (
  id,
  { quoteText, author, categoryId, isActive },
) => {
  // Validate the new category if one is being assigned
  if (categoryId) {
    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
    });
    if (!category) {
      throw ApiError.notFound("Target category not found or is inactive.");
    }
  }

  const patch = {};
  if (quoteText !== undefined) patch.quoteText = quoteText.trim();
  if (author !== undefined) patch.author = author.trim();
  if (categoryId !== undefined) patch.categoryId = categoryId;
  if (isActive !== undefined) patch.isActive = isActive;

  const quote = await Quote.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name");

  if (!quote) throw ApiError.notFound("Quote not found.");
  return quote;
};

// ── deleteQuote ────────────────────────────────────────────────────────────────

/**
 * Soft delete — sets isActive: false.
 * The quote remains in MongoDB. Phase 5's $match filter (isActive: true)
 * automatically excludes it from the random quote pipeline.
 */
export const deleteQuote = async (id) => {
  const quote = await Quote.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!quote) throw ApiError.notFound("Quote not found.");
  return quote;
};

export default {
  getAllQuotesAdmin,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
