'use strict';

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const UserEventController = require("../controllers/userEvent.controller"); // ⚡ nom correct

// Ajouter un événement utilisateur
router.post('/', authMiddleware, UserEventController.addEvent);

// Récupérer les événements de l’utilisateur connecté
router.get('/', authMiddleware, UserEventController.getEvents);

// Supprimer un événement par ID
router.delete('/:eventId', authMiddleware, UserEventController.deleteEvent);

module.exports = router;