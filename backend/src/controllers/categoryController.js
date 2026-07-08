"use strict";

import categoryService from "../services/categoryService.js";
import ApiResponse from "../utils/ApiResponse.js";

// ── GET /api/categories ────────────────────────────────────────────────────────
export const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return ApiResponse.success(res, "Categories fetched.", { categories });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/categories/:id ────────────────────────────────────────────────────
export const getById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return ApiResponse.success(res, "Category fetched.", { category });
  } catch (error) {
    next(error);
  }
};
