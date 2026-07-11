'use strict';
const Notifications = require('../models/Notifications.model');
const Users = require('../models/Users.model');

module.exports = (io, socket) => {

  // JOIN room notifications personnelle
  socket.on('notifications:join', async (userId) => {
    socket.join(`notifications:${userId}`);
    socket.userId = userId;
    console.log(`🔔 User ${userId} rejoint notifications room`);

    // Envoyer les notifications non lues au client
    try {
      const unread = await Notifications.findAll({
        where: { user_id: userId, is_read: false },
        order: [['created_at', 'DESC']],
        limit: 20
      });
      socket.emit('notifications:unread', unread);
    } catch (err) {
      console.error('❌ Erreur notifications:', err.message);
    }
  });

  // Marquer une notification comme lue
  socket.on('notifications:read', async ({ notificationId }) => {
    try {
      await Notifications.update(
        { is_read: true },
        { where: { id: notificationId } }
      );
      socket.emit('notifications:read:done', { notificationId });
    } catch (err) {
      console.error('❌ Erreur read notification:', err.message);
    }
  });

  // Marquer toutes comme lues
  socket.on('notifications:read:all', async ({ userId }) => {
    try {
      await Notifications.update(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
      );
      socket.emit('notifications:read:all:done');
    } catch (err) {
      console.error('❌ Erreur read all notifications:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Notifications socket déconnecté: ${socket.id}`);
  });
};