// src/services/Whatsapp.service.js
// ==========================================
// Service pour gérer les messages et médias WhatsApp
// ==========================================

require('')
require('')

// ⚡ Import du modèle WhatsAppMessage depuis le dossier models
// Assurez-vous que le modèle s'appelle exactement WhatsAppMessage dans src/models/index.js
require('')

// ⚡ Import du service Media pour gérer les fichiers médias
const MediaService = require(path.join(__dirname, 'media'));

const WhatsappService = {
  /**
   * Crée un message WhatsApp avec option média
   * @param {Object} data { userId, message, mediaBuffer, mediaFilename }
   * @returns {Promise<Object>} message créé
   */
  async sendMessage(data) {
    const { userId, message, mediaBuffer, mediaFilename } = data;

    if (!userId) throw new Error('userId est requis');
    if (!message && !mediaBuffer) throw new Error('Message ou média est requis');

    let mediaPath = null;

    // Sauvegarde du média si présent
    if (mediaBuffer && mediaFilename) {
      mediaPath = MediaService.saveMedia(mediaBuffer, mediaFilename);
      if (!mediaPath) console.warn('⚠ MediaService n’a pas pu sauvegarder le média');
    }

    // Crée l'entrée en base
    const newMessage = await WhatsAppMessage.create({
      user_id: userId,
      message: message || null,
      media_path: mediaPath,
      created_at: new Date()
    });

    return newMessage;
  },

  /**
   * Supprime un message WhatsApp (et le média associé)
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async deleteMessage(id) {
    if (!id) throw new Error('ID du message requis');

    const message = await WhatsAppMessage.findByPk(id);
    if (!message) throw new Error('Message introuvable');

    // Supprime le média si existant
    if (message.media_path && fs.existsSync(message.media_path)) {
      MediaService.deleteMedia(message.media_path);
    }

    await message.destroy();
    return true;
  },

  /**
   * Récupère tous les messages d'un utilisateur
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async getMessagesByUser(userId) {
    if (!userId) throw new Error('userId est requis');

    const messages = await WhatsAppMessage.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    return messages;
  }
};

module.exports = WhatsappService;

