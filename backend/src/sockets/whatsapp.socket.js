'use strict';

const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');
const WhatsappService = require('../services/Whatsapp.service');
const STT = require('../models/STT.model');
const logger = console;

// Convertit buffer audio en WAV 16kHz mono pour Whisper
function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFrequency(16000)
      .audioChannels(1)
      .toFormat('wav')
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}

module.exports = (io, socket) => {

  // JOIN ROOM
  socket.on('whatsapp:join', (userId) => {
    socket.join(`whatsapp:${userId}`);
    logger.log(`📱 Socket ${socket.id} rejoint whatsapp:${userId}`);
  });

  // ENVOI MESSAGE TEXTE
  socket.on('whatsapp:send', async (data) => {
    try {
      const { userId, message } = data;
      const result = await WhatsappService.sendMessage({ userId, message });
      io.to(`whatsapp:${userId}`).emit('whatsapp:receive', result);
    } catch (err) {
      socket.emit('whatsapp:error', { action: 'send', message: err.message });
    }
  });

  // MESSAGE VOCAL → STT
  socket.on('whatsapp:voice', async (data) => {
    try {
      const { userId, audioBuffer, language = 'fr', target_language = 'fr' } = data;

      if (!audioBuffer || !userId) {
        return socket.emit('whatsapp:error', { action: 'voice', message: 'Données manquantes' });
      }

      // Sauvegarde buffer temporaire
      const tmpInput = path.join(os.tmpdir(), `wa_${Date.now()}.webm`);
      const tmpOutput = path.join(os.tmpdir(), `wa_${Date.now()}.wav`);
      fs.writeFileSync(tmpInput, Buffer.from(new Uint8Array(audioBuffer)));

      // Conversion WebM → WAV
      await convertToWav(tmpInput, tmpOutput);
      const wavBuffer = fs.readFileSync(tmpOutput);

      // Envoi à Whisper Python
      const response = await axios.post(
        process.env.PYTHON_API_URL + '/transcribe',
        {
          audio: wavBuffer.toString('base64'),
          language,
          target_language
        },
        { timeout: 30000 }
      );

      const transcription = response.data.transcription || response.data;
      const translated = response.data.translated || transcription;

      // Nettoyage fichiers temporaires
      fs.unlinkSync(tmpInput);
      fs.unlinkSync(tmpOutput);

      // Sauvegarde message vocal en DB
      const message = await WhatsappService.sendMessage({
        userId,
        message: transcription,
        mediaPath: null
      });

      // Sauvegarde STT en DB
      await STT.create({
        user_id: userId,
        text: transcription,
        translated_text: translated,
        language,
        target_language
      });

      // Envoi transcription au client
      socket.emit('whatsapp:voice:transcription', {
        original: transcription,
        translated,
        language,
        message
      });

      logger.log(`🎤 WhatsApp STT: "${transcription}"`);

    } catch (err) {
      logger.error('❌ WhatsApp voice STT error:', err.message);
      socket.emit('whatsapp:error', { action: 'voice', message: err.message });
    }
  });

  // DÉCONNEXION
  socket.on('disconnect', () => {
    logger.log(`🔴 WhatsApp socket déconnecté: ${socket.id}`);
  });
};