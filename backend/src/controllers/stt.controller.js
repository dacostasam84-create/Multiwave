const STTService = require("../services/Stt.service");
const STTController = {
  async create(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Fichier audio requis' });

      const stt = await STTService.create({
        userId: req.user.id,
        audioFile: req.file
      });

      res.status(201).json({ message: 'Transcription créée', transcription: stt });
    } catch (err) {
      console.error('STTController.create:', err);
      res.status(500).json({ error: 'Erreur serveur STT' });
    }
  },

  async getAll(req, res) {
    try {
      const stts = await STTService.getAll(req.user?.id);
      res.json({ message: 'Transcriptions récupérées', transcriptions: stts });
    } catch (err) {
      console.error('STTController.getAll:', err);
      res.status(500).json({ error: 'Erreur serveur STT' });
    }
  }
};

module.exports = STTController;

