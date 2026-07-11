// src/routes/AiLog.routes.js
const express = require("express");
const router = express.Router();
const AiLogController = require("../controllers/aiLog.controller");
// Toutes les routes AI nécessitent authentification
router.post('/summarize', authMiddleware, AiLogController.summarize);
router.post('/moderate', authMiddleware, AiLogController.moderate);

module.exports = router;

