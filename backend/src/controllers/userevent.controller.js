// src/controllers/userEvent.controller.js
const UserEventService = require("../services/UserEvent.service");

const UserEventController = {
  // Ajouter un événement utilisateur
  async addEvent(req, res) {
    try {
      const { type, metadata } = req.body;
      const userId = req.user.id;

      if (!type) {
        return res.status(400).json({ success: false, message: 'Type requis' });
      }

      const event = await UserEventService.addEvent(userId, type, metadata || {});
      res.status(201).json({ success: true, data: event });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Récupérer les événements de l’utilisateur connecté
  async getEvents(req, res) {
    try {
      const userId = req.user.id;
      const events = await UserEventService.getEvents(userId);
      res.json({ success: true, data: events });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Supprimer un événement
  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      await UserEventService.deleteEvent(eventId);
      res.json({ success: true, message: 'Événement supprimé' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

module.exports = UserEventController;

