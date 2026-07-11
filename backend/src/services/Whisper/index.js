// src/services/whisper/index.js
const STTService = require("./stt");               // ligne 2, ton service de reconnaissance vocale
const TTSService = require("./tts");               // ligne 3, ton service de synthèse vocale

module.exports = { stt, tts };

