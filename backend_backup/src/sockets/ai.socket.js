// src/sockets/ai.socket.js
require('')
require('')
const logger = console;

module.exports = (io, socket) => {

  // ===============================
  // JOIN IA ROOM
  // ===============================
  socket.on('ai:join', (userId) => {
    const room = `ai:${userId}`;
    socket.join(room);
    logger.log(`🟢 Socket ${socket.id} a rejoint la room ${room}`);
  });

  // ===============================
  // DEMANDE RÉSUMÉ / TRADUCTION
  // ===============================
  socket.on('ai:summary', async (data) => {
    try {
      const { userId, content, context, langueCible } = data;

      // Utilisation Python API pour traduction
      const result = await PythonService.traduire("texte_live", content, langueCible || "en");

      io.to(`ai:${userId}`).emit('ai:summary:result', result);
      logger.log(`📄 Résumé/traduction envoyé à ${userId}`);
    } catch (err) {
      logger.error('❌ AI summary error:', err.message);
      socket.emit('ai:error', { action: 'summary', message: err.message });
    }
  });

  // ===============================
  // MODÉRATION IA
  // ===============================
  socket.on('ai:moderate', async (data) => {
    try {
      const { userId, messageId, content } = data;
      const moderation = await AiService.moderateContent({ userId, messageId, content });
      io.to(`ai:${userId}`).emit('ai:moderation:result', moderation);
      logger.log(`🛡️ Modération envoyée à ${userId}`);
    } catch (err) {
      logger.error('❌ AI moderation error:', err.message);
      socket.emit('ai:error', { action: 'moderation', message: err.message });
    }
  });

  // ===============================
  // SCORING UTILISATEUR IA
  // ===============================
  socket.on('ai:score', async (data) => {
    try {
      const { userId, targetUserId } = data;
      const score = await AiService.calculateUserScore({ userId, targetUserId });
      io.to(`ai:${userId}`).emit('ai:score:result', score);
      logger.log(`🏆 Score IA envoyé à ${userId}`);
    } catch (err) {
      logger.error('❌ AI score error:', err.message);
      socket.emit('ai:error', { action: 'score', message: err.message });
    }
  });

  // ===============================
  // AUDIO / VIDÉO TEMPS RÉEL (OPTIONNEL)
  // ===============================
  socket.on('ai:audio-realtime', async (data) => {
    try {
      const { userId, langueCible } = data;
      const result = await PythonService.audioRealtime(langueCible || "en");
      io.to(`ai:${userId}`).emit('ai:audio-realtime:result', result);
    } catch (err) {
      logger.error('❌ AI audio realtime error:', err.message);
      socket.emit('ai:error', { action: 'audio-realtime', message: err.message });
    }
  });

  socket.on('ai:video-realtime', async (data) => {
    try {
      const { userId, videoPath, langueCible } = data;
      const result = await PythonService.videoRealtime(videoPath, langueCible || "en");
      io.to(`ai:${userId}`).emit('ai:video-realtime:result', result);
    } catch (err) {
      logger.error('❌ AI video realtime error:', err.message);
      socket.emit('ai:error', { action: 'video-realtime', message: err.message });
    }
  });

  // ===============================
  // DÉCONNEXION
  // ===============================
  socket.on('disconnect', () => {
    logger.log(`🔴 AI socket déconnecté: ${socket.id}`);
  });
};

