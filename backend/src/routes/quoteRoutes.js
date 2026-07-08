"use strict";

import router from "express";
import { getCount, getRandom } from "../controllers/quoteController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/random", protect, getRandom);
router.get("/count", protect, getCount);

export default router;
