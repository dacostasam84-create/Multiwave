/**
 * sockets/index.js
 * 
 * Centralisation du branchement de tous les sockets
 * AI, WhatsApp, et futurs sockets si ajoutés
 */

const logger = console;

module.exports = (io) => {

  io.on('connection', (socket) => {
    logger.log(`🔵 Socket connecté: ${socket.id}`);

    // ----------------------------
    // SOCKET AI
    // ----------------------------
    try {
require('')
      logger.log(`✅ AI Socket branché pour ${socket.id}`);
    } catch (err) {
      logger.error('❌ Erreur branchement AI socket:', err.message);
    }

    // ----------------------------
    // SOCKET WhatsApp
    // ----------------------------
    try {
require('')
      logger.log(`✅ WhatsApp Socket branché pour ${socket.id}`);
    } catch (err) {
      logger.error('❌ Erreur branchement WhatsApp socket:', err.message);
    }

    // ----------------------------
    // Déconnexion
    // ----------------------------
    socket.on('disconnect', () => {
      logger.log(`🔴 Socket déconnecté: ${socket.id}`);
    });
  });

};

