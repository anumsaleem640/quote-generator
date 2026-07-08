"use strict";

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    // Soft delete: set to false to hide from users without destroying data
    isActive: {
      type: Boolean,
      default: true,
    },

    // The admin user who created this category
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
// name has unique: true — gets a unique index automatically
// isActive is queried frequently when building the category list for users
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
