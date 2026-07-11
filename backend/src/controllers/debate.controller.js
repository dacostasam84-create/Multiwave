const DebateService = require("../services/Debate.service");
class DebateController {

  // Créer une salle de débat
  static async createRoom(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Titre requis' });
      }

      const debate = await DebateService.createDebate({
        title,
        description,
        host_id: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: 'Salle créée',
        data: debate
      });
    } catch (err) {
      console.error('createRoom:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Démarrer un débat
  static async startDebate(req, res) {
    try {
      const { debateId } = req.body;
      const result = await DebateService.startDebate(debateId, req.user.id);

      return res.json({ success: true, message: 'Débat démarré', data: result });
    } catch (err) {
      console.error('startDebate:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Terminer un débat
  static async endDebate(req, res) {
    try {
      const { debateId } = req.body;
      const result = await DebateService.endDebate(debateId, req.user.id);

      return res.json({ success: true, message: 'Débat terminé', data: result });
    } catch (err) {
      console.error('endDebate:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Ajouter un participant
  static async addParticipant(req, res) {
    try {
      const { debateId } = req.body;
      await DebateService.addParticipant(debateId, req.user.id);

      return res.json({ success: true, message: 'Participant ajouté' });
    } catch (err) {
      console.error('addParticipant:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Supprimer un participant
  static async removeParticipant(req, res) {
    try {
      const { debateId, userId } = req.body;
      await DebateService.removeParticipant(debateId, userId, req.user.id);

      return res.json({ success: true, message: 'Participant supprimé' });
    } catch (err) {
      console.error('removeParticipant:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Liste des participants
  static async getParticipants(req, res) {
    try {
      const { debateId } = req.params;
      const participants = await DebateService.getParticipants(debateId);

      return res.json({ success: true, data: participants });
    } catch (err) {
      console.error('getParticipants:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = DebateController;

