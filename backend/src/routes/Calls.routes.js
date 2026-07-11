// src/routes/calls.routes.js
const express = require('express');
const router = express.Router();
const CallsController = require('../controllers/calls.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Créer une salle d'appel
router.post('/rooms', authMiddleware, CallsController.createRoom);

// Envoyer un signal WebRTC
router.post('/rooms/:roomId/signal', authMiddleware, CallsController.sendSignal);

// Terminer un appel
router.post('/rooms/:roomId/end', authMiddleware, CallsController.endCall);

// Récupérer les participants d'une salle
router.get('/rooms/:roomId/participants', authMiddleware, CallsController.getParticipants);

module.exports = router;
