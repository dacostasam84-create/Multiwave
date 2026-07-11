// src/routes/translate.routes.js
const express = require("express");
const router = express.Router(); // ✅ une seule déclaration
const TranslateController = require("../controllers/translate.controller"); 
const { authMiddleware } = require("../middlewares/auth.middleware"); // corrige si tu exportes un objet

const multer = require("multer");
const storage = multer.memoryStorage();
const audioUpload = multer({ storage });

// Routes traduction texte
router.post('/text', authMiddleware, TranslateController.translateText);

// Routes traduction audio
router.post('/speech-to-text', authMiddleware, audioUpload.single('audio'), TranslateController.speechToText);

module.exports = router;