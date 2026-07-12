"use strict";

import apiError from "../utils/apiError.js";

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(
      apiError.forbidden("Admin access required. This incident may be logged."),
    );
  }
  next();
};

export default { adminOnly };
