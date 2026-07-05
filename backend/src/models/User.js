/**
 * User.js
 * Mongoose schema and model for application users.
 *
 * Key design decisions:
 *  - passwordHash uses select: false — never returned in queries by default
 *  - username is auto-generated from email (never shown to the user)
 *  - selectedCategories stores an array of Category ObjectIds (many-to-many)
 *  - timestamps: true auto-manages createdAt and updatedAt
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Creates a unique index automatically
      lowercase: true, // Stored as lowercase — prevents john@example.com vs John@example.com duplicates
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    // Auto-generated from email. Stored for system use only — never displayed in UI.
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // NEVER store plain text passwords. This holds the bcrypt hash.
    // select: false means this field is excluded from all query results by default.
    // To include it: User.findById(id).select('+passwordHash')
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Array of Category ObjectIds. Mongoose's populate() replaces these IDs
    // with full Category documents when needed.
    selectedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // How often the user wants a new quote
    quoteRefreshInterval: {
      type: String,
      enum: {
        values: ["1min", "1hour", "1day"],
        message: "{VALUE} is not a valid refresh interval",
      },
      default: "1hour",
    },

    // Controls feature access throughout the app
    subscriptionType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    // Soft delete flag — set to false instead of deleting the document
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds and manages createdAt and updatedAt fields
    timestamps: true,
  },
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
// email and username have unique: true above, which creates indexes automatically.
// These explicit index calls are for non-unique fields we query frequently.

userSchema.index({ isActive: 1 });

// ─── INSTANCE METHODS ─────────────────────────────────────────────────────────
// Instance methods are called on a specific user document:
//   const user = await User.findById(id).select('+passwordHash');
//   const isValid = await user.comparePassword('entered_password');

/**
 * Compare a plain-text password against the stored bcrypt hash.
 * Used during login to verify credentials.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Check whether the user can add another category to their selection.
 * Free users are limited to MAX_FREE_CATEGORIES (default: 5).
 */
userSchema.methods.canAddCategory = function (maxFreeCategories = 5) {
  if (this.subscriptionType === "premium") return true;
  return this.selectedCategories.length < maxFreeCategories;
};

// ─── STATIC METHODS ───────────────────────────────────────────────────────────
// Static methods are called on the Model itself:
//   const username = await User.generateUsername('john@example.com');

/**
 * Generate a unique username from an email address.
 * Extracts the local part, strips non-alphanumeric characters,
 * and appends a counter if the username already exists.
 *
 * Examples:
 *   john@gmail.com        → john
 *   john.smith@gmail.com  → johnsmith
 *   john@gmail.com (2nd)  → john1
 */
userSchema.statics.generateUsername = async function (email) {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // Keep only lowercase letters and digits

  let username = base;
  let counter = 1;

  // Increment counter until we find an available username
  while (await this.exists({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
};

// const User = mongoose.model("User", userSchema);
export default User;
