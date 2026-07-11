require('')

class CallsController {
  // Créer une salle d'appel
  static async createRoom(req, res) {
    try {
      const { roomName } = req.body;
      if (!roomName) {
        return res.status(400).json({ success: false, message: 'Nom de la salle manquant' });
      }

      // Ici tu peux ajouter la logique pour créer une salle dans la DB
      const room = {
        id: Math.floor(Math.random() * 100000), // juste un exemple temporaire
        name: roomName,
        createdBy: req.user.id,
        createdAt: new Date()
      };

      res.status(201).json({ success: true, message: 'Salle créée', data: room });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Envoyer un signal WebRTC
  static async sendSignal(req, res) {
    try {
      const { roomId } = req.params;
      const { signal, userId } = req.body;

      if (!signal || !userId) {
        return res.status(400).json({ success: false, message: 'Données manquantes' });
      }

      // TODO: gérer l'envoi du signal WebRTC via Socket.IO

      res.json({ success: true, message: `Signal envoyé dans la salle ${roomId}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Terminer un appel
  static async endCall(req, res) {
    try {
      const { roomId } = req.params;

      // TODO: mettre à jour le statut de l'appel dans la DB

      res.json({ success: true, message: `Appel ${roomId} terminé` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Récupérer les participants d'une salle
  static async getParticipants(req, res) {
    try {
      const { roomId } = req.params;

      // Appel correct du service avec roomId
      const participants = await CallParticipantsService.listByCall(roomId);

      res.json({ success: true, data: participants });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = CallsController;

