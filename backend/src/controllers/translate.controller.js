const path = require('path');
const fs = require('fs');
const TranslateService = require('../services/Translate.service');

const TranslateController = {
  // Traduction texte
  async translateText(req, res) {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) return res.status(400).json({ error: 'Texte et langue cible requis' });

      const translated = await TranslateService.translateText(text, targetLang);
      res.json({ message: 'Texte traduit', translated });
    } catch (err) {
      console.error('TranslateController.translateText:', err);
      res.status(500).json({ error: 'Erreur serveur traduction' });
    }
  },

  // Traduction audio (STT + traduction)
  async speechToText(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Fichier audio requis' });

      const audioFileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadDir = require('../config/paths').uploadDir('translate');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, audioFileName);
      fs.writeFileSync(filePath, req.file.buffer);

      const targetLang = req.body.targetLang || 'fr';
      const translated = await TranslateService.translateAudio(filePath, targetLang);

      res.status(201).json({ message: 'Audio traduit', translated });
    } catch (err) {
      console.error('TranslateController.speechToText:', err);
      res.status(500).json({ error: 'Erreur serveur traduction audio' });
    }
  }
};

module.exports = TranslateController;

