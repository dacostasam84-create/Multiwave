// src/routes/stt.routes.js
const express = require("express");
const router = express.Router();                       // ✅ déclaration unique
const SttController = require("../controllers/stt.controller"); 
const { authMiddleware } = require("../middlewares/auth.middleware"); // selon export

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----------------------
// ROUTES STT
// ----------------------

// Création / upload d'un STT
router.post('/', authMiddleware, upload.single('audio'), SttController.create);

// Récupérer tous les STT
router.get('/', authMiddleware, SttController.getAll);

module.exports = router;