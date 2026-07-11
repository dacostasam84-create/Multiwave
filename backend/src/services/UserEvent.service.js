// Multiwave\backend\src\services\UserEvent.service.js

const UserEventModel = require("../models/UserEvent.model");
const UsersModel = require("../models/Users.model");       // si tu veux joindre les infos utilisateur
const { Op } = require("sequelize");                        // pour les conditions complexes

class UserEventService {
  // Créer un événement pour un utilisateur
  static async createEvent({ userId, type, description, metadata }) {
    if (!userId || !type) {
      throw new Error("userId et type sont obligatoires");
    }

    const event = await UserEventModel.create({
      user_id: userId,
      type,
      description,
      metadata: metadata || {},
    });

    return event;
  }

  // Récupérer les événements d’un utilisateur
  static async getUserEvents(userId, limit = 50) {
    if (!userId) throw new Error("userId manquant");

    const events = await UserEventModel.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      limit,
    });

    return events;
  }

  // Supprimer un événement
  static async deleteEvent(eventId, userId) {
    if (!eventId) throw new Error("eventId manquant");

    const deleted = await UserEventModel.destroy({
      where: {
        id: eventId,
        ...(userId ? { user_id: userId } : {}),
      },
    });

    return deleted > 0;
  }

  // Filtrer les événements par type
  static async getEventsByType(type, limit = 50) {
    if (!type) throw new Error("type manquant");

    const events = await UserEventModel.findAll({
      where: { type },
      order: [["createdAt", "DESC"]],
      limit,
    });

    return events;
  }
}

module.exports = UserEventService;
