// backend/src/sockets/webrtc.socket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Nouvelle connexion WebRTC : ${socket.id}`);

    // Rejoindre une room
    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} rejoint la room ${roomId}`);
      socket.to(roomId).emit('user-joined', { userId });
    });

    // Signaler une offre ou réponse WebRTC
    socket.on('signal', ({ roomId, signalData, userId }) => {
      socket.to(roomId).emit('signal', { signalData, userId });
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`User déconnecté : ${socket.id}`);
      // Tu peux émettre un événement pour retirer le participant
    });
  });
};


