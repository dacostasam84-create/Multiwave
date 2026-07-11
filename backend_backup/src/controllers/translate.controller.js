'use strict';

const fs = require('fs');
const path = require('path');
const TranslateService = require('../services/Translate.service');

const TranslateController = {
  // Traduction texte
  async translateText(req, res) {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: 'Texte et langue cible requis' });
      }

      const translated = await TranslateService.translateText(text, targetLang);
      return res.json({ message: 'Texte traduit', translated });
    } catch (err) {
      console.error('TranslateController.translateText:', err);
      return res.status(500).json({ error: 'Erreur serveur traduction' });
    }
  },

  // Traduction audio (STT + traduction)
  async speechToText(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Fichier audio requis' });
      }

      const uploadDir = path.join(__dirname, '../../uploads/translate');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const audioFileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, audioFileName);
      fs.writeFileSync(filePath, req.file.buffer);

      const targetLang = req.body.targetLang || 'fr';
      const userId = req.user?.id || 1;
      const translated = await TranslateService.translateAudio(filePath, targetLang, userId);

      return res.status(201).json({ message: 'Audio traduit', translated });
    } catch (err) {
      console.error('TranslateController.speechToText:', err);
      return res.status(500).json({ error: 'Erreur serveur traduction audio' });
    }
  },

  // Récupérer toutes les traductions (optionnel)
  async getAll(req, res) {
    try {
      const userId = req.query.userId || null;
      const translations = await TranslateService.getAll(userId);
      return res.json({ success: true, data: translations });
    } catch (err) {
      console.error('TranslateController.getAll:', err);
      return res.status(500).json({ error: 'Erreur serveur récupération traductions' });
    }
  },
};

module.exports = TranslateController;