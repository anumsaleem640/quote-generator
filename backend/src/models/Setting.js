import mongoose from "mongoose";

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
