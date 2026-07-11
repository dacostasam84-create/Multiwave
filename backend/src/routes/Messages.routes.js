// src/routes/messages.routes.js
'use strict';

const express = require("express");
const router = express.Router();
const MessagesController = require("../controllers/messages.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Envoyer un message
router.post("/", authMiddleware, MessagesController.sendMessage);

// Récupérer la conversation avec un utilisateur
router.get("/conversation/:userId", authMiddleware, MessagesController.getConversation);

// Supprimer un message (soft delete)
router.delete("/:id", authMiddleware, MessagesController.removeMessage);

module.exports = router;
