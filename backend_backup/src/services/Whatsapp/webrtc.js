class WhatsAppWebRTCService {
  static async startCall(hostId, participants = []) {
    if (!hostId) throw new Error("Host requis");
    if (!Array.isArray(participants) || participants.length === 0) {
      throw new Error("Participants requis");
    }

    return {
      success: true,
      message: "Appel démarré",
      data: {
        callId: Date.now(),
        host: hostId,
        participants,
        status: "started"
      }
    };
  }

  static async endCall(callId) {
    if (!callId) throw new Error("callId requis");

    return {
      success: true,
      message: "Appel terminé",
      data: {
        callId,
        status: "ended"
      }
    };
  }
}

module.exports = WhatsAppWebRTCService;

