"use strict";

/**
 * adminController.js
 * Thin HTTP handlers for all admin endpoints.
 * Each function: extract from req → call service → send ApiResponse.
 * No business logic here — it all lives in the three admin services.
 */

import adminCategoryService from "../services/adminCategoryService.js";
import adminQuoteService from "../services/adminQuoteService.js";
import adminService from "../services/adminService.js";
import ApiResponse from "../utils/ApiResponse.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/admin/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return ApiResponse.success(res, "Dashboard statistics fetched.", { stats });
  } catch (error) {
    next(error);
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/admin/categories?page=1&limit=50
export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const data = await adminCategoryService.getAllCategoriesAdmin({
      page: Number(page),
      limit: Number(limit),
    });
    return ApiResponse.paginated(
      res,
      "Categories fetched.",
      data.categories,
      data.pagination,
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/categories
export const createCategory = async (req, res, next) => {
  try {
    const category = await adminCategoryService.createCategory(req.body);
    return ApiResponse.created(res, "Category created.", { category });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const category = await adminCategoryService.updateCategory(
      req.params.id,
      req.body,
    );
    return ApiResponse.success(res, "Category updated.", { category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/categories/:id  (soft delete)
export const deleteCategory = async (req, res, next) => {
  try {
    await adminCategoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, "Category deactivated.", null);
  } catch (error) {
    next(error);
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUOTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/admin/quotes?page=1&limit=20&categoryId=xxx&search=xxx
export const getQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, categoryId, search } = req.query;
    const data = await adminQuoteService.getAllQuotesAdmin({
      page: Number(page),
      limit: Number(limit),
      categoryId: categoryId || undefined,
      search: search || undefined,
    });
    return ApiResponse.paginated(
      res,
      "Quotes fetched.",
      data.quotes,
      data.pagination,
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/quotes/:id
export const getQuote = async (req, res, next) => {
  try {
    const quote = await adminQuoteService.getQuoteById(req.params.id);
    return ApiResponse.success(res, "Quote fetched.", { quote });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/quotes
export const createQuote = async (req, res, next) => {
  try {
    const quote = await adminQuoteService.createQuote(req.body);
    return ApiResponse.created(res, "Quote created.", { quote });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/quotes/:id
export const updateQuote = async (req, res, next) => {
  try {
    const quote = await adminQuoteService.updateQuote(req.params.id, req.body);
    return ApiResponse.success(res, "Quote updated.", { quote });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/quotes/:id  (soft delete)
export const deleteQuote = async (req, res, next) => {
  try {
    await adminQuoteService.deleteQuote(req.params.id);
    return ApiResponse.success(res, "Quote deactivated.", null);
  } catch (error) {
    next(error);
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/admin/users?page=1&limit=20&search=xxx
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const data = await adminService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
    });
    return ApiResponse.paginated(
      res,
      "Users fetched.",
      data.users,
      data.pagination,
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched.", { user });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.updateUserStatus(
      req.params.id,
      req.body.isActive,
    );
    const action = req.body.isActive ? "activated" : "deactivated";
    return ApiResponse.success(res, `User account ${action}.`, { user });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/subscription
export const updateUserSubscription = async (req, res, next) => {
  try {
    const user = await adminService.updateUserSubscription(
      req.params.id,
      req.body.subscriptionType,
    );
    return ApiResponse.success(res, "Subscription plan updated.", { user });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getUsers,
  getUser,
  updateUserStatus,
  updateUserSubscription,
};
