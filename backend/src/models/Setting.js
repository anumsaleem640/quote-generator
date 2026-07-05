/**
 * Setting.js
 * Mongoose schema and model for global application settings.
 *
 * Key design decisions:
 *  - key-value pattern gives admin flexibility to add/change settings without
 *    schema migrations or code deployments
 *  - key is stored UPPERCASE by convention (e.g. MAX_FREE_CATEGORIES)
 *  - value is Schema.Types.Mixed — can hold any JavaScript type
 *  - isPublic flag controls whether the frontend can read this setting
 *
 * Example documents:
 *  { key: 'MAX_FREE_CATEGORIES',        value: 5,                         isPublic: true  }
 *  { key: 'DEFAULT_REFRESH_INTERVAL',   value: '1hour',                   isPublic: true  }
 *  { key: 'AVAILABLE_REFRESH_INTERVALS',value: ['1min','1hour','1day'],   isPublic: true  }
 *  { key: 'AUTO_ASSIGN_CATEGORIES_COUNT',value: 2,                        isPublic: false }
 */

const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // Unique identifier for the setting — always stored uppercase
    key: {
      type: String,
      required: [true, "Setting key is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Flexible value: number, string, boolean, array, or object
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Setting value is required"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // If true, this setting can be fetched by the frontend (safe to expose)
    // If false, it is only used server-side
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
// key has unique: true — gets a unique index automatically
// isPublic is queried when the frontend requests public settings
settingSchema.index({ isPublic: 1 });

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
