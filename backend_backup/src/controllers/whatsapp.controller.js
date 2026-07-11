require('')
require('')
const WhatsAppController = {

  /**
   * Upload média (image, vidéo, audio, document)
   */
  async uploadMedia(req, res) {
    try {
      const { receiver_number, type } = req.body;
      const senderId = req.user.id;

      if (!req.file || !receiver_number || !type) {
        return res.status(400).json({
          success: false,
          message: "Données manquantes"
        });
      }

      const message = await WhatsAppService.uploadMedia(
        senderId,
        receiver_number,
        req.file,
        type
      );

      return res.status(201).json({
        success: true,
        data: message
      });

    } catch (error) {
      console.error("uploadMedia error:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }
  },

  /**
   * Capture depuis caméra
   */
  async captureCamera(req, res) {
    try {
      const { receiver_number } = req.body;
      const senderId = req.user.id;

      if (!req.file || !receiver_number) {
        return res.status(400).json({
          success: false,
          message: "Données manquantes"
        });
      }

      const message = await WhatsAppCameraService.capture(
        senderId,
        receiver_number,
        req.file
      );

      return res.status(201).json({
        success: true,
        data: message
      });

    } catch (error) {
      console.error("captureCamera error:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }
  },

  /**
   * Démarrer appel audio/vidéo
   */
  async startCall(req, res) {
    try {
      const userId = req.user.id;
      const { participants } = req.body;

      if (!participants || !participants.length) {
        return res.status(400).json({
          success: false,
          message: "Participants requis"
        });
      }

      const call = await WhatsAppService.startCall(userId, participants);

      return res.status(200).json({
        success: true,
        data: call
      });

    } catch (error) {
      console.error("startCall error:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }
  },

  /**
   * Terminer appel
   */
  async endCall(req, res) {
    try {
      const { callId } = req.body;

      if (!callId) {
        return res.status(400).json({
          success: false,
          message: "callId requis"
        });
      }

      const result = await WhatsAppService.endCall(callId);

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error("endCall error:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }
  }
};

module.exports = WhatsAppController;

