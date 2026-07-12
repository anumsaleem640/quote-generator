import api from "./api.js";

/**
 * userService.js
 * Calls the backend user endpoints for profile, category selection,
 * and refresh interval settings.
 */

// ── Profile ────────────────────────────────────────────────────────────────────
export const getUserProfile = () => api.get("/users/profile");

// ── Category selection ─────────────────────────────────────────────────────────
// categoryIds — array of MongoDB ObjectId strings
export const updateCategories = (categoryIds) =>
  api.put("/users/categories", { categoryIds });

// ── Refresh interval ───────────────────────────────────────────────────────────
// quoteRefreshInterval — one of '1min' | '1hour' | '1day'
export const updateSettings = (quoteRefreshInterval) =>
  api.put("/users/settings", { quoteRefreshInterval });
