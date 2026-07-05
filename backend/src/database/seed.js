import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ─── IMPORT SCHEMAS ───────────────────────────────────────────────────────────
// Adjust this path if your Setting model is located somewhere else!
import Setting from "../models/Setting.js";

// Recreate CJS __dirname safely in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const defaultSettings = [
  {
    key: "MAX_FREE_CATEGORIES",
    value: 5,
    description: "Maximum number of categories a free user can select",
    isPublic: true,
  },
  {
    key: "DEFAULT_REFRESH_INTERVAL",
    value: "1hour",
    description: "Default quote refresh interval assigned to new users",
    isPublic: true,
  },
  {
    key: "AVAILABLE_REFRESH_INTERVALS",
    value: ["1min", "1hour", "1day"],
    description: "All available options for quote refresh interval",
    isPublic: true,
  },
  {
    key: "AUTO_ASSIGN_CATEGORIES_COUNT",
    value: 2,
    description: "Number of random categories auto-assigned on registration",
    isPublic: false,
  },
  {
    key: "APP_NAME",
    value: "Quote Generator",
    description: "Application display name",
    isPublic: true,
  },
  {
    key: "APP_VERSION",
    value: "1.0.0",
    description: "Current application version",
    isPublic: true,
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Clear existing settings to ensure a clean slate
    const deleted = await Setting.deleteMany({});
    console.log(`🗑  Cleared ${deleted.deletedCount} existing settings`);

    // Insert all default settings
    const inserted = await Setting.insertMany(defaultSettings);
    console.log(`✅ Seeded ${inserted.length} settings:\n`);

    inserted.forEach((s) => {
      const valueDisplay = Array.isArray(s.value)
        ? JSON.stringify(s.value)
        : s.value;
      console.log(`   ${s.key.padEnd(35)} = ${valueDisplay}`);
    });

    console.log("\n\x1b[32m✅ Database seeding complete!\x1b[0m");
    console.log(
      "ℹ  Create categories and quotes via the Admin Panel at /admin\n",
    );

    // Close the mongoose link connection pool cleanly
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

// ─── EXECUTE SCRIPT IMMEDIATELY ───────────────────────────────────────────────
seed();

export default seed;
