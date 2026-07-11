// src/services/Whisper.service.js
// ==========================================
// Service pour gérer Whisper (STT/TTS + DB)
// ==========================================

const fs = require("fs");                                    
const path = require("path");                                   

// ⚡ Services STT/TTS
const STTService = require(path.join(__dirname, 'whisper', 'stt'));
const TTSService = require(path.join(__dirname, 'whisper', 'tts'));

// ⚡ Modèle Whisper depuis l'index centralisé
const WhisperModel = require("../models/Whisper.model");

class WhisperService {
  /**
   * Convert audio file to text using STT
   * @param {string} audioFilePath
   * @returns {Promise<string>}
   */
  static async transcribe(audioFilePath) {
    if (!audioFilePath || !fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    try {
      const text = await STTService.speechToText(audioFilePath);
      return text;
    } catch (err) {
      console.error('❌ Error during STT transcription:', err);
      throw err;
    }
  }

  /**
   * Convert text to audio using TTS
   * @param {string} text
   * @returns {Promise<Object>} audio info
   */
  static async speak(text) {
    if (!text) throw new Error('Text is required for TTS');

    try {
      const audioData = await TTSService.textToSpeech(text);
      return audioData;
    } catch (err) {
      console.error('❌ Error during TTS synthesis:', err);
      throw err;
    }
  }

  /**
   * Save a Whisper entry in database
   * @param {object} data { senderId, receiverId, message, ephemeral?, expiresAt? }
   * @returns {Promise<object>}
   */
  static async createWhisper(data) {
    if (!data || !data.senderId || !data.receiverId || !data.message) {
      throw new Error('Données complètes requises pour créer Whisper');
    }

    try {
      const whisper = await Whisper.create(data);
      return whisper;
    } catch (err) {
      console.error('❌ Error creating Whisper entry:', err);
      throw err;
    }
  }

  /**
   * Retrieve Whisper by ID
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  static async getWhisperById(id) {
    if (!id) throw new Error('ID requis pour récupérer Whisper');

    try {
      const whisper = await Whisper.findByPk(id);
      return whisper;
    } catch (err) {
      console.error('❌ Error fetching Whisper:', err);
      throw err;
    }
  }
}

module.exports = WhisperService;

