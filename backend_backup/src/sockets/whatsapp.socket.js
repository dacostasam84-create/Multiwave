/**
 * WhatsApp SOCKET
 * - Messages temps réel
 * - Statuts (sent / delivered / read)
 * - Media streaming
 */

require('')
const logger = console;

module.exports = (io, socket) => {

  /* ===============================
     JOIN WhatsApp ROOM (par utilisateur)
  ================================ */
  socket.on('whatsapp:join', (userId) => {
    const room = `whatsapp:${userId}`;
    socket.join(room);
    logger.log(`📱 Socket ${socket.id} a rejoint la room ${room}`);
  });

  /* ===============================
     ENVOI DE MESSAGE
  ================================ */
  socket.on('whatsapp:send', async (data) => {
    try {
      const { userId, message } = data;
      // Appelle le service WhatsApp
      const result = await WhatsAppService.sendMessage(userId, message);

      io.to(`whatsapp:${userId}`).emit('whatsapp:receive', result);
      logger.log(`✉️ Message envoyé à ${userId}`);
    } catch (err) {
      logger.error('❌ WhatsApp send error:', err.message);
      socket.emit('whatsapp:error', { action: 'send', message: err.message });
    }
  });

  /* ===============================
     DÉCONNEXION
  ================================ */
  socket.on('disconnect', () => {
    logger.log(`🔴 WhatsApp socket déconnecté: ${socket.id}`);
  });

};

