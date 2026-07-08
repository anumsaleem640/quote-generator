"use strict";

import Quote from "../models/Quote.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// ── getRandomQuote ─────────────────────────────────────────────────────────────

/**
 * Returns one random active quote from the user's selected categories.
 *
 * Aggregate pipeline stages:
 *  $match  — only active quotes whose categoryId is in the user's list
 *  $sample — MongoDB picks 1 at random (server-side, efficient on any scale)
 *  $lookup — joins the categories collection to get the category name
 *  $unwind — flattens [ {category} ] array into a plain {category} object
 *  $project — shapes the final output (only the fields the client needs)
 */
export const getRandomQuote = async (userId) => {
  // One DB call to get the user and their category IDs
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found.");

  if (!user.selectedCategories || user.selectedCategories.length === 0) {
    throw new ApiError(
      "You have not selected any categories yet. " +
        "Visit your dashboard to choose which topics you want quotes from.",
      404,
    );
  }

  // The full aggregate pipeline — runs entirely inside MongoDB
  const [quote] = await Quote.aggregate([
    // Stage 1: Filter to active quotes in the user's chosen categories only
    {
      $match: {
        categoryId: { $in: user.selectedCategories },
        isActive: true,
      },
    },

    // Stage 2: Pick exactly 1 document at random.
    // $sample is more efficient than sorting by a random field because MongoDB
    // uses reservoir sampling under the hood rather than sorting the entire set.
    { $sample: { size: 1 } },

    // Stage 3: JOIN — fetch the matching Category document by _id.
    // The result is an array field called "category" on each quote document.
    {
      $lookup: {
        from: "categories", // the MongoDB collection name (lowercase plural)
        localField: "categoryId", // field on the Quote document
        foreignField: "_id", // field on the Category document
        as: "category", // output array field name
      },
    },

    // Stage 4: Flatten [ {name, _id, ...} ] → {name, _id, ...}
    // $lookup always produces an array. $unwind converts the single-element
    // array to a plain embedded object.
    { $unwind: "$category" },

    // Stage 5: Shape the output — return only the fields the client needs.
    // This keeps response payloads small and avoids leaking internal fields.
    {
      $project: {
        _id: 1,
        quoteText: 1,
        author: 1,
        category: {
          _id: "$category._id",
          name: "$category.name",
        },
      },
    },
  ]);

  if (!quote) {
    throw new ApiError(
      "No quotes found in your selected categories. " +
        "An admin needs to add quotes before you can see them here.",
      404,
    );
  }

  // fetchedAt is added server-side so every client — web, mobile — shows
  // the same authoritative timestamp regardless of device clock differences.
  return {
    ...quote,
    fetchedAt: new Date().toISOString(),
  };
};

// ── getQuoteCount ──────────────────────────────────────────────────────────────

/**
 * Returns how many active quotes exist across the user's selected categories.
 * Used by the mobile splash screen to display a "X quotes available" stat.
 */
export const getQuoteCount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found.");

  if (!user.selectedCategories || user.selectedCategories.length === 0) {
    return { count: 0 };
  }

  const count = await Quote.countDocuments({
    categoryId: { $in: user.selectedCategories },
    isActive: true,
  });

  return { count };
};

export default { getRandomQuote, getQuoteCount };
