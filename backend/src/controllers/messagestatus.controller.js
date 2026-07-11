const MessageStatusService = require("../services/MessageStatus.service");

module.exports = {

  async updateStatus(req, res) {
    try {
      const { messageId, status } = req.body;

      if (!messageId || !status) {
        return res.status(400).json({ error: 'Champs manquants' });
      }

      const record = await MessageStatusService.updateStatus({
        messageId,
        userId: req.user.id,
        status
      });

      res.json({
        message: 'Status mis à jour',
        data: record
      });

    } catch (err) {
      console.error('updateStatus:', err.message);
      res.status(400).json({ error: err.message });
    }
  },

  async getStatusesForMessage(req, res) {
    try {
      const { messageId } = req.params;

      const statuses = await MessageStatusService.getStatusesForMessage(messageId);
      res.json(statuses);

    } catch (err) {
      console.error('getStatusesForMessage:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getMyStatuses(req, res) {
    try {
      const statuses = await MessageStatusService.getStatusesForUser(req.user.id);
      res.json(statuses);

    } catch (err) {
      console.error('getMyStatuses:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

