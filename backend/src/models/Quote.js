/**
 * Quote.js
 * Mongoose schema and model for individual quotes.
 *
 * Key design decisions:
 *  - categoryId is required — every quote must belong to a category
 *  - The compound index on { categoryId, isActive } is the most critical
 *    index in the project — it powers the core "get random quote" query
 *  - author defaults to 'Unknown' rather than being required
 *  - isActive enables soft delete, same pattern as Category
 */

const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // Which category this quote belongs to
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    quoteText: {
      type: String,
      required: [true, "Quote text is required"],
      trim: true,
      minlength: [10, "Quote must be at least 10 characters long"],
      maxlength: [1000, "Quote cannot exceed 1000 characters"],
    },

    author: {
      type: String,
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
      default: "Unknown",
    },

    // Soft delete — deactivated quotes are hidden from users
    isActive: {
      type: Boolean,
      default: true,
    },

    // The admin user who added this quote
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
/**
 * Compound index on categoryId + isActive.
 *
 * This is the most-executed query in the entire application:
 *   Quote.find({ categoryId: { $in: userCategories }, isActive: true })
 *
 * Without this index: MongoDB scans EVERY quote document.
 * With this index: MongoDB jumps directly to matching documents.
 *
 * MongoDB can also use this compound index for queries on categoryId alone
 * (the leftmost field), so we don't need a separate single-field index.
 */
quoteSchema.index({ categoryId: 1, isActive: 1 });

const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;
