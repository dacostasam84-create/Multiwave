'use strict';

const WebRTCService = require("../services/Webrtc.service");

module.exports = {
  async startSession(req, res) {
    try {
      const result = await WebRTCService.start(req.body);
      res.json({ success: true, session: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async endSession(req, res) {
    try {
      const { sessionId } = req.body;
      const result = await WebRTCService.end(sessionId);
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getStatus(req, res) {
    try {
      const { sessionId } = req.params;
      const status = await WebRTCService.getStatus(sessionId);
      res.json({ success: true, status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};