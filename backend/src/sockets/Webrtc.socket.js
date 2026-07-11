'use strict';
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const STT = require('../models/STT.model');
const Users = require('../models/Users.model');
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:5000';

function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .audioFrequency(16000)
      .audioChannels(1)
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}

module.exports = (io, socket) => {

  // ===============================
  // JOIN ROOM — avec langue préférée
  // ===============================
  socket.on('join-room', async ({ roomId, userId }) => {
    socket.join(roomId);
    socket.userId = userId;
    socket.roomId = roomId;

    try {
      const user = await Users.findByPk(userId, {
        attributes: ['id', 'username', 'preferred_language']
      });
      socket.preferredLang = user?.preferred_language || 'fr';

      console.log(`✅ User ${userId} rejoint ${roomId} — langue: ${socket.preferredLang}`);

      socket.to(roomId).emit('user-joined', {
        userId,
        preferredLang: socket.preferredLang
      });

      socket.emit('language-confirmed', {
        userId,
        preferredLang: socket.preferredLang
      });

    } catch (err) {
      console.error('❌ Erreur récupération langue:', err.message);
      socket.preferredLang = 'fr';
      socket.to(roomId).emit('user-joined', { userId, preferredLang: 'fr' });
    }
  });

  // ===============================
  // SIGNAL WebRTC
  // ===============================
  socket.on('signal', ({ roomId, signalData, userId }) => {
    socket.to(roomId).emit('signal', { signalData, userId });
  });

  // ===============================
  // AUDIO CHUNK — STT + Traduction
  // ===============================
  socket.on('audio-chunk', async ({ roomId, userId, audioBuffer, targetLang }) => {
    // Utilise langue préférée si targetLang non fourni
    const lang = targetLang || socket.preferredLang || 'fr';

    const tempDir = path.join(__dirname, '../../uploads/temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const webmFile = path.join(tempDir, `${socket.id}_${Date.now()}.webm`);
    const wavFile = webmFile.replace('.webm', '.wav');

    try {
      const buf = audioBuffer instanceof Buffer
        ? audioBuffer
        : Buffer.from(new Uint8Array(audioBuffer));

      fs.writeFileSync(webmFile, buf);
      await convertToWav(webmFile, wavFile);

      const form = new FormData();
      form.append('file', fs.createReadStream(wavFile), 'audio.wav');

      const response = await axios.post(
        `${PYTHON_API_URL}/stt/transcribe?target_lang=${lang}`,
        form,
        { headers: form.getHeaders() }
      );

      const data = response.data.transcription || response.data;
      const { original, detected_language, translated } = data;

      // Envoi transcription à toute la room
      io.to(roomId).emit('transcription', {
        userId,
        original,
        detected_language,
        translated,
        target_language: lang,
        timestamp: new Date()
      });

      console.log(`🎤 ${original} → ${translated}`);

      // Sauvegarde en DB
      if (original && userId) {
        await STT.create({
          user_id: userId,
          text: original,
          translated_text: translated,
          language: detected_language,
          target_language: lang,
          audio_path: null
        });
      }

    } catch (err) {
      console.error('❌ STT WebRTC error:', err.message);
      socket.emit('transcription-error', { message: err.message });
    } finally {
      if (fs.existsSync(webmFile)) fs.unlinkSync(webmFile);
      if (fs.existsSync(wavFile)) fs.unlinkSync(wavFile);
    }
  });

  // ===============================
  // DÉCONNEXION
  // ===============================
  socket.on('disconnect', () => {
    console.log(`🔴 User déconnecté: ${socket.id}`);
  });
};