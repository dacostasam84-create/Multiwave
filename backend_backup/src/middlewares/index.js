'use strict';

const authMiddleware = require("./auth.middleware");
const errorMiddleware = require("./error.middleware");
const uploadMiddleware = require("./upload.middleware");
const aiMiddleware = require("./ai.middleware");
const checkDurationMiddleware = require("./checkduration.middleware");
const rateLimitMiddleware = require("./ratelimit.middleware");
const ephemeralMiddleware = require("./ephemeral.middleware");

module.exports = {
  authMiddleware,
  errorMiddleware,
  uploadMiddleware,
  aiMiddleware,
  checkDurationMiddleware,
  rateLimitMiddleware,
  ephemeralMiddleware
};