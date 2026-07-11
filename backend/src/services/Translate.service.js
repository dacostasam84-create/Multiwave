'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('../models'); // Assurez-vous que db contient Translation et User
const PythonService = require('./Python.service'); // Import du service Python

class TranslateService {
  // Traduction texte via PythonService
  static async translateText(text, targetLang) {
    if (!text || !targetLang) throw new Error('Texte et langue cible requis');
    try {
      // Appel réel à PythonService
      const translated = await PythonService.traduire('text', text, targetLang);
      return translated;
    } catch (err) {
      console.error('TranslateService.translateText error:', err);
      // fallback placeholder
      return `[${targetLang}] ${text}`;
    }
  }

  // Traduction audio (STT + traduction)
  static async translateAudio(audioFilePath, targetLang, userId = 1) {
    if (!audioFilePath || !targetLang) throw new Error('Audio et langue cible requis');

    try {
      // STT simulé → ici tu pourrais appeler PythonService.audioRealtime pour traitement réel
      const simulatedText = `Texte simulé depuis ${path.basename(audioFilePath)}`;

      // Traduction via PythonService
      const translated = await TranslateService.translateText(simulatedText, targetLang);

      // Sauvegarde en DB
      await db.Translation.create({
        user_id: userId,
        source_text: simulatedText,
        translated_text: translated,
        source_lang: 'auto',
        target_lang: targetLang,
        audio_path: audioFilePath,
      });

      return translated;
    } catch (err) {
      console.error('TranslateService.translateAudio error:', err);
      throw err;
    }
  }

  // Récupérer toutes les traductions, optionnellement par utilisateur
  static async getAll(userId = null) {
    const where = userId ? { user_id: userId } : {};
    return await db.Translation.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }],
    });
  }
}

module.exports = TranslateService;
