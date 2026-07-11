'use strict';
const Notifications = require('../models/Notifications.model');

const NotificationService = {
  async send(io, { userId, fromUserId, type, content, referenceId, referenceType }) {
    try {
      const notif = await Notifications.create({
        user_id: userId,
        from_user_id: fromUserId,
        type,
        content,
        reference_id: referenceId,
        reference_type: referenceType,
        is_read: false
      });

      // Envoi temps réel via Socket.IO
      io.to(`notifications:${userId}`).emit('notifications:new', notif);

      return notif;
    } catch (err) {
      console.error('❌ Erreur envoi notification:', err.message);
    }
  }
};

module.exports = NotificationService;