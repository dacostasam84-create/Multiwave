// src/routes/comments.routes.js
'use strict';

const express = require("express");
const router = express.Router();
const CommentsController = require("../controllers/comments.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// ✅ Créer un commentaire
router.post("/", authMiddleware, CommentsController.createComment);

// ✅ Récupérer tous les commentaires d’un post
router.get("/post/:postId", CommentsController.getCommentsByPost);

// ✅ Supprimer un commentaire
router.delete("/:id", authMiddleware, CommentsController.deleteComment);

module.exports = router;
