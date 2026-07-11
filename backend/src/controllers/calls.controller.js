// src/controllers/calls.controller.js
const CallsService = require('../services/Calls.service');
const CallParticipantsService = require('../services/CallParticipant.service');

class CallsController {
  static async createRoom(req, res) {
    try {
      const { roomName } = req.body;
      if (!roomName) return res.status(400).json({ success: false, message: 'Nom de la salle manquant' });

      // Exemple de création de salle (temporaire)
      const room = {
        id: Math.floor(Math.random() * 100000),
        name: roomName,
        createdBy: req.userId,
        createdAt: new Date()
      };

      res.status(201).json({ success: true, message: 'Salle créée', data: room });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async sendSignal(req, res) {
    try {
      const { roomId } = req.params;
      const { signal, userId } = req.body;

      if (!signal || !userId) return res.status(400).json({ success: false, message: 'Données manquantes' });

      // TODO: envoyer le signal via Socket.IO
      res.json({ success: true, message: `Signal envoyé dans la salle ${roomId}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async endCall(req, res) {
    try {
      const { roomId } = req.params;

      // TODO: mettre à jour le statut dans la DB
      res.json({ success: true, message: `Appel ${roomId} terminé` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getParticipants(req, res) {
    try {
      const { roomId } = req.params;
      const participants = await CallParticipantsService.listByCall(roomId);
      res.json({ success: true, data: participants });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = CallsController;
