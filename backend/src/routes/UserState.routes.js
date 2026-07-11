// src/routes/userstate.routes.js
const express = require("express");
const router = express.Router();

// 🔹 Import correct du middleware d’authentification
const { authMiddleware } = require("../middlewares/auth.middleware"); 

const UserStateController = require("../controllers/userstate.controller");

// Définir / mettre à jour l’état de l’utilisateur connecté
router.post('/', authMiddleware, UserStateController.setState);

// Récupérer l’état de l’utilisateur connecté
router.get('/', authMiddleware, UserStateController.getState);

// Supprimer l’état de l’utilisateur connecté
router.delete('/', authMiddleware, UserStateController.deleteState);

module.exports = router;