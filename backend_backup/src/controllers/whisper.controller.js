require('')

const WhisperController = {
  async createWhisper(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier audio reçu' });
      const userId = req.user.id;

      const whisper = await WhisperService.createWhisper(userId, req.file);
      res.status(201).json({ success: true, data: whisper });
    } catch (err) {
      console.error('WhisperController.createWhisper:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getWhispersByUser(req, res) {
    try {
      const { userId } = req.params;
      const whispers = await WhisperService.getWhispersByUser(userId);
      res.json({ success: true, data: whispers });
    } catch (err) {
      console.error('WhisperController.getWhispersByUser:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async deleteWhisper(req, res) {
    try {
      const { whisperId } = req.params;
      await WhisperService.deleteWhisper(whisperId);
      res.json({ success: true, message: 'Whisper supprimé avec succès' });
    } catch (err) {
      console.error('WhisperController.deleteWhisper:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = WhisperController;

