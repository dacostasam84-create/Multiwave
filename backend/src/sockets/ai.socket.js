'use strict';

const AiLogModel = require("../models/AiLog.model");
const PythonService = require("../services/Python.service");
const logger = console;

module.exports = (io, socket) => {

  socket.on('ai:join', (userId) => {
    const room = `ai:${userId}`;
    socket.join(room);
    logger.log(`🤖 Socket ${socket.id} a rejoint la room ${room}`);
  });

  socket.on('ai:summary', async (data) => {
    try {
      const { userId, content, langueCible } = data;
      const result = await PythonService.traduire("texte_live", content, langueCible || "en");
      io.to(`ai:${userId}`).emit('ai:summary:result', result);
    } catch (err) {
      logger.error('❌ AI summary error:', err.message);
      socket.emit('ai:error', { action: 'summary', message: err.message });
    }
  });

  socket.on('ai:audio-realtime', async (data) => {
    try {
      const { userId, langueCible } = data;
      const result = await PythonService.audioRealtime(langueCible || "en");
      io.to(`ai:${userId}`).emit('ai:audio-realtime:result', result);
    } catch (err) {
      logger.error('❌ AI audio realtime error:', err.message);
      socket.emit('ai:error', { action: 'audio-realtime', message: err.message });
    }
  });

  socket.on('ai:video-realtime', async (data) => {
    try {
      const { userId, videoPath, langueCible } = data;
      const result = await PythonService.videoRealtime(videoPath, langueCible || "en");
      io.to(`ai:${userId}`).emit('ai:video-realtime:result', result);
    } catch (err) {
      logger.error('❌ AI video realtime error:', err.message);
      socket.emit('ai:error', { action: 'video-realtime', message: err.message });
    }
  });

  socket.on('disconnect', () => {
    logger.log(`🔴 AI socket déconnecté: ${socket.id}`);
  });

};