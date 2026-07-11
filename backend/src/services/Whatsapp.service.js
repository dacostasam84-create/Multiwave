'use strict';

const fs = require('fs');
const path = require('path');
const WhatsAppMessage = require('../models/Whatsapp.model');
const MediaService = require(path.join(__dirname, 'Whatsapp/media'));

const WhatsappService = {
  async sendMessage({ userId, message, mediaBuffer, mediaFilename }) {
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
      sender_id: userId,
      receiver_id: null, // à définir si nécessaire
      content: message || null,
      media_path: mediaPath,
      created_at: new Date()
    });

    return newMessage;
  },

  async deleteMessage(id) {
    if (!id) throw new Error('ID du message requis');

    const message = await WhatsAppMessage.findByPk(id);
    if (!message) throw new Error('Message introuvable');

    if (message.media_path && fs.existsSync(message.media_path)) {
      MediaService.deleteMedia(message.media_path);
    }

    await message.destroy();
    return true;
  },

  async getMessagesByUser(userId) {
    if (!userId) throw new Error('userId est requis');

    const messages = await WhatsAppMessage.findAll({
      where: { sender_id: userId },
      order: [['created_at', 'DESC']]
    });

    return messages;
  }
};

module.exports = WhatsappService;