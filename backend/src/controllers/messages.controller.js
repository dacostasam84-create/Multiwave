const MessagesService = require("../services/Messages.service");

module.exports = {

  async sendMessage(req, res) {
    try {
      const { receiverId, content } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ error: 'Champs manquants' });
      }

      const msg = await MessagesService.send(
        req.user.id,
        receiverId,
        content
      );

      res.status(201).json(msg);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getConversation(req, res) {
    try {
      const { userId } = req.params;

      const messages = await MessagesService.conversation(
        req.user.id,
        userId
      );

      res.json(messages);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async removeMessage(req, res) {
    try {
      const ok = await MessagesService.delete(
        req.params.id,
        req.user.id
      );

      if (!ok) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      res.json({ success: true });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

