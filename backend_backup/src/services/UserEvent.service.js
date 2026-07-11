require('')

class UserEventService {
  // Ajouter un événement utilisateur
  static async addEvent(userId, type, metadata = {}) {
    return await db.UserEvent.create({
      user_id: userId,
      type,
      metadata,
    });
  }

  // Récupérer tous les événements d’un utilisateur
  static async getEvents(userId, limit = 50) {
    return await db.UserEvent.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit
    });
  }

  // Supprimer un événement
  static async deleteEvent(eventId) {
    const event = await db.UserEvent.findByPk(eventId);
    if (!event) throw new Error('Événement introuvable');
    await event.destroy();
    return true;
  }
}

module.exports = UserEventService;

