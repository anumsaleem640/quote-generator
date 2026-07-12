"use strict";

/**
 * adminCategoryService.js
 * Category management for the admin panel.
 *
 * Key decision: admin sees ALL categories (active and inactive).
 * A soft-deleted category is still in the database and can be reactivated.
 * The user-facing categoryService only shows isActive: true.
 */

import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

// ── getAllCategoriesAdmin ──────────────────────────────────────────────────────

/**
 * Returns ALL categories (including soft-deleted) with a live quote count.
 * The aggregate pipeline computes the count server-side so N+1 queries
 * are avoided — one round-trip regardless of how many categories exist.
 */
export const getAllCategoriesAdmin = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const total = await Category.countDocuments();

  const categories = await Category.aggregate([
    // Stage 1: join with the quotes collection
    {
      $lookup: {
        from: "quotes",
        localField: "_id",
        foreignField: "categoryId",
        as: "quotes",
      },
    },
    // Stage 2: project only the fields we need + computed quoteCount
    {
      $project: {
        name: 1,
        description: 1,
        isActive: 1,
        createdAt: 1,
        // Count only active quotes — inactive quotes don't affect the user experience
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
    { $skip: skip },
    { $limit: limit },
  ]);

  return {
    categories,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ── createCategory ─────────────────────────────────────────────────────────────

/**
 * Creates a new category.
 * Name uniqueness is case-insensitive — "Motivation" and "motivation"
 * are treated as the same category.
 *
 * createdBy is null because the hardcoded admin is not a database document.
 * Phase 14 (production hardening) can swap this for a real admin user _id.
 */
export const createCategory = async ({ name, description = "" }) => {
  const duplicate = await Category.findOne({
    name: {
      $regex: new RegExp(
        `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    },
  });
  if (duplicate) {
    throw ApiError.conflict(`A category named "${name}" already exists.`);
  }

  return Category.create({ name: name.trim(), description, createdBy: null });
};

// ── updateCategory ─────────────────────────────────────────────────────────────

/**
 * Partial update — only fields present in the `updates` object are changed.
 * Setting isActive: true on a soft-deleted category reactivates it.
 */
export const updateCategory = async (id, { name, description, isActive }) => {
  // Prevent renaming to an existing category's name (case-insensitive, exclude self)
  if (name) {
    const duplicate = await Category.findOne({
      name: {
        $regex: new RegExp(
          `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i",
        ),
      },
      _id: { $ne: id },
    });
    if (duplicate) {
      throw ApiError.conflict(`A category named "${name}" already exists.`);
    }
  }

  // Build update payload — only include fields that were explicitly provided
  const patch = {};
  if (name !== undefined) patch.name = name.trim();
  if (description !== undefined) patch.description = description;
  if (isActive !== undefined) patch.isActive = isActive;

  const category = await Category.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  });

  if (!category) throw ApiError.notFound("Category not found.");
  return category;
};

// ── deleteCategory ─────────────────────────────────────────────────────────────

/**
 * Soft delete — sets isActive: false.
 * The category document remains in MongoDB.
 * Existing quotes that reference this categoryId are preserved.
 * Users will no longer see quotes from this category (Phase 5 queries
 * filter isActive: true), but history is intact.
 */
export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!category) throw ApiError.notFound("Category not found.");
  return category;
};

export default {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
};
