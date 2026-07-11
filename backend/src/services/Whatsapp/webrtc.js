'use strict';

// Simule la gestion des appels audio/vidéo
const WhatsAppWebRTCService = {
  async startCall(userId, participants) {
    if (!userId || !participants?.length) {
      throw new Error('Données appel manquantes');
    }

    return {
      callId: `call_${Date.now()}`,
      host: userId,
      participants,
      startedAt: new Date()
    };
  },

  async endCall(callId) {
    if (!callId) {
      throw new Error('callId requis');
    }

    return {
      callId,
      endedAt: new Date(),
      success: true
    };
  }
};

module.exports = WhatsAppWebRTCService;