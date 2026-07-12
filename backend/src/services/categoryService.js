"use strict";

import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

// ── getAllCategories ────────────────────────────────────────────────────────────

/**
 * Returns every active category, alphabetically sorted, each with a
 * quoteCount field showing how many active quotes belong to it.
 *
 * Pipeline:
 *  $match  — only active categories
 *  $lookup — join with quotes collection to get all matching quote documents
 *  $project — compute quoteCount by filtering joined docs to isActive: true
 *  $sort   — alphabetical by name
 */
export const getAllCategories = async () => {
  return Category.aggregate([
    { $match: { isActive: true } },

    // Join with the quotes collection — adds a "quotes" array to each category
    {
      $lookup: {
        from: "quotes",
        localField: "_id",
        foreignField: "categoryId",
        as: "quotes",
      },
    },

    {
      $project: {
        name: 1,
        description: 1,
        // Count only the active quotes within the joined array.
        // $filter removes inactive ones; $size counts what remains.
        quoteCount: {
          $size: {
            $filter: {
              input: "$quotes",
              as: "q",
              cond: { $eq: ["$$q.isActive", true] },
            },
          },
        },
      },
    },

    { $sort: { name: 1 } },
  ]);
};

// ── getCategoryById ────────────────────────────────────────────────────────────

/**
 * Returns a single active category by its MongoDB _id.
 * Throws 404 if the ID doesn't exist or the category is inactive.
 */
export const getCategoryById = async (id) => {
  const category = await Category.findOne({ _id: id, isActive: true }).select(
    "name description",
  );

  if (!category) throw ApiError.notFound("Category not found.");
  return category;
};

export default {
  getAllCategories,
  getCategoryById,
};
