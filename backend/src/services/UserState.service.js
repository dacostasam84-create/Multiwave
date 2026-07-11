'use strict';

// Import du modèle UserState correctement
const UserState = require('../models/UserState.model'); // <-- remplacer par le chemin correct

class UserStateService {
  /**
   * Crée ou met à jour l'état d'un utilisateur
   * @param {number} userId
   * @param {string} state
   * @returns {Promise<object>}
   */
  static async setState(userId, state) {
    if (!userId || !state) throw new Error('userId et state sont requis');

    try {
      const [record] = await UserState.upsert(
        { user_id: userId, state, last_active: new Date() },
        { returning: true }
      );

      return record;
    } catch (err) {
      console.error('❌ Error setting user state:', err);
      throw err;
    }
  }

  /**
   * Récupère l'état actuel d'un utilisateur
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  static async getState(userId) {
    if (!userId) throw new Error('userId requis');

    try {
      const record = await UserState.findOne({ where: { user_id: userId } });
      return record;
    } catch (err) {
      console.error('❌ Error getting user state:', err);
      throw err;
    }
  }

  /**
   * Supprime l'état d'un utilisateur
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  static async deleteState(userId) {
    if (!userId) throw new Error('userId requis');

    try {
      const deleted = await UserState.destroy({ where: { user_id: userId } });
      return deleted > 0;
    } catch (err) {
      console.error('❌ Error deleting user state:', err);
      throw err;
    }
  }
}

module.exports = UserStateService;
