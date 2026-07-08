// "use strict";

// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import path from "path";
// import { fileURLToPath } from "url";
// import Setting from "../models/Setting.js";

// // Recreate CJS __dirname safely in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables from backend/.env
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// // ─── SEED DATA ────────────────────────────────────────────────────────────────

// const defaultSettings = [
//   {
//     key: "MAX_FREE_CATEGORIES",
//     value: 5,
//     description: "Maximum number of categories a free user can select",
//     isPublic: true,
//   },
//   {
//     key: "DEFAULT_REFRESH_INTERVAL",
//     value: "1hour",
//     description: "Default quote refresh interval assigned to new users",
//     isPublic: true,
//   },
//   {
//     key: "AVAILABLE_REFRESH_INTERVALS",
//     value: ["1min", "1hour", "1day"],
//     description: "All available options for quote refresh interval",
//     isPublic: true,
//   },
//   {
//     key: "AUTO_ASSIGN_CATEGORIES_COUNT",
//     value: 2,
//     description: "Number of random categories auto-assigned on registration",
//     isPublic: false,
//   },
//   {
//     key: "APP_NAME",
//     value: "Quote Generator",
//     description: "Application display name",
//     isPublic: true,
//   },
//   {
//     key: "APP_VERSION",
//     value: "1.0.0",
//     description: "Current application version",
//     isPublic: true,
//   },
// ];

// // ─── SEED FUNCTION ────────────────────────────────────────────────────────────

// const seed = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error("MONGODB_URI is not defined in .env");
//     }

//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ Connected to MongoDB\n");

//     // Clear existing settings to ensure a clean slate
//     const deleted = await Setting.deleteMany({});
//     console.log(`🗑  Cleared ${deleted.deletedCount} existing settings`);

//     // Insert all default settings
//     const inserted = await Setting.insertMany(defaultSettings);
//     console.log(`✅ Seeded ${inserted.length} settings:\n`);

//     inserted.forEach((s) => {
//       const valueDisplay = Array.isArray(s.value)
//         ? JSON.stringify(s.value)
//         : s.value;
//       console.log(`   ${s.key.padEnd(35)} = ${valueDisplay}`);
//     });

//     console.log("\n\x1b[32m✅ Database seeding complete!\x1b[0m");
//     console.log(
//       "ℹ  Create categories and quotes via the Admin Panel at /admin\n",
//     );

//     // Close the mongoose link connection pool cleanly
//     await mongoose.disconnect();
//     process.exit(0);
//   } catch (error) {
//     console.error("\n❌ Seeding failed:", error.message);
//     process.exit(1);
//   }
// };

// // ─── EXECUTE SCRIPT IMMEDIATELY ───────────────────────────────────────────────
// seed();

// export default seed;

// "use strict";

// import dotenv from "dotenv";
// import mongoose from "mongoose";

// dotenv.config();

// const ADMIN_ID = "6a4aa3185a601c9454dc2567";

// const categories = [
//   {
//     name: "Motivation",
//     description: "Resilience and growth.",
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//     isActive: true,
//   },
//   {
//     name: "Philosophy",
//     description: "Ancient and modern thinkers.",
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//     isActive: true,
//   },
//   {
//     name: "Humor",
//     description: "Witty and lighthearted.",
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//     isActive: true,
//   },
//   {
//     name: "Mindfulness",
//     description: "Presence and inner peace.",
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//     isActive: true,
//   },
//   {
//     name: "Creativity",
//     description: "Inspiration for innovators.",
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//     isActive: true,
//   },
// ];

// const run = async () => {
//   try {
//     // 1. Check URI configurations
//     const rawUri = process.env.MONGODB_URI;
//     console.log(`📡 Attempting connection using string: "${rawUri}"`);

//     await mongoose.connect(rawUri);
//     const db = mongoose.connection.db;

//     // 2. Print explicit target details
//     console.log(`📌 TARGET DATABASE NAME IN MONGO: "${db.databaseName}"`);

//     // Clear and re-insert
//     await db.collection("categories").deleteMany({});

//     const cleanCategories = categories.map((cat) => ({
//       ...cat,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));

//     const result = await db
//       .collection("categories")
//       .insertMany(cleanCategories);
//     console.log(
//       `✅ MongoDB confirmed insertion of ${result.insertedCount} items.`,
//     );

//     // 4. IMMEDIATE VERIFICATION CHECK
//     console.log("\n🔍 Checking database directly right now...");
//     const currentRecords = await db.collection("categories").find({}).toArray();

//     if (currentRecords.length === 0) {
//       console.log(
//         "❌ Strange... The database returned 0 records immediately after writing!",
//       );
//     } else {
//       console.log(
//         `🎉 Found ${currentRecords.length} records sitting inside collection "${db.databaseName}.categories":`,
//       );
//       console.table(
//         currentRecords.map((c) => ({ ID: c._id.toString(), Name: c.name })),
//       );
//     }
//   } catch (err) {
//     console.error("❌ Failed:", err);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected.");
//     process.exit(0);
//   }
// };

// run();

// "use strict";

// import dotenv from "dotenv";
// import mongoose from "mongoose";

// dotenv.config();

// const ADMIN_ID = "6a4aa3185a601c9454dc2567";

// // Define our real Category IDs from your Atlas database output
// const CATEGORIES = {
//   Motivation: "6a4aa8aea6e5a0bed994a003",
//   Philosophy: "6a4aa8aea6e5a0bed994a004",
//   Humor: "6a4aa8aea6e5a0bed994a005",
//   Mindfulness: "6a4aa8aea6e5a0bed994a006",
//   Creativity: "6a4aa8aea6e5a0bed994a007",
// };

// const quotesData = [
//   // --- Motivation ---
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Motivation),
//     quoteText: "The only way to do great work is to love what you do.",
//     author: "Steve Jobs",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Motivation),
//     quoteText:
//       "It does not matter how slowly you go, as long as you do not stop.",
//     author: "Confucius",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Motivation),
//     quoteText:
//       "Success is not final, failure is not fatal: it is the courage to continue that counts.",
//     author: "Winston Churchill",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },

//   // --- Philosophy ---
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Philosophy),
//     quoteText: "Know thyself.",
//     author: "Socrates",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Philosophy),
//     quoteText: "The unexamined life is not worth living.",
//     author: "Socrates",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Philosophy),
//     quoteText:
//       "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
//     author: "Aristotle",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },

//   // --- Humor ---
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Humor),
//     quoteText:
//       "I am so clever that sometimes I don't understand a single word of what I am saying.",
//     author: "Oscar Wilde",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Humor),
//     quoteText: "People say nothing is impossible, but I do nothing every day.",
//     author: "A. A. Milne",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Humor),
//     quoteText:
//       "The safe way to double your money is to fold it over once and put it in your pocket.",
//     author: "Kin Hubbard",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },

//   // --- Mindfulness ---
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Mindfulness),
//     quoteText:
//       "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
//     author: "Buddha",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Mindfulness),
//     quoteText:
//       "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
//     author: "Thich Nhat Hanh",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Mindfulness),
//     quoteText: "Be here now.",
//     author: "Ram Dass",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },

//   // --- Creativity ---
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Creativity),
//     quoteText: "Creativity is intelligence having fun.",
//     author: "Albert Einstein",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Creativity),
//     quoteText:
//       "You can't use up creativity. The more you use, the more you have.",
//     author: "Maya Angelou",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
//   {
//     categoryId: new mongoose.Types.ObjectId(CATEGORIES.Creativity),
//     quoteText:
//       "Every child is an artist. The problem is how to remain an artist once he grows up.",
//     author: "Pablo Picasso",
//     isActive: true,
//     createdBy: new mongoose.Types.ObjectId(ADMIN_ID),
//   },
// ];

// const run = async () => {
//   try {
//     const rawUri = process.env.MONGODB_URI;
//     console.log(`📡 Connecting to cluster via URI configuration...`);

//     await mongoose.connect(rawUri);
//     const db = mongoose.connection.db;

//     console.log(`📌 TARGET DATABASE: "${db.databaseName}"`);

//     // Clear out any old records in the quotes collection to avoid bad data sets
//     await db.collection("quotes").deleteMany({});

//     // Build operational objects containing standard database metadata timestamps
//     const cleanQuotes = quotesData.map((quote) => ({
//       ...quote,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));

//     const result = await db.collection("quotes").insertMany(cleanQuotes);
//     console.log(
//       `✅ Success! Seeded ${result.insertedCount} quotes into the database collection.`,
//     );

//     // Quick verification lookup
//     const verifyCount = await db.collection("quotes").countDocuments();
//     console.log(
//       `🚀 Double check count: ${verifyCount} active quotes now live online.`,
//     );
//   } catch (err) {
//     console.error("❌ Failed to seed quotes:", err);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected safely from MongoDB Atlas.");
//     process.exit(0);
//   }
// };

// run();
