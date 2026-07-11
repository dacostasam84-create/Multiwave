'use strict';

const CallParticipantService = require("../services/CallParticipant.service");

class CallParticipantController {
  // ✅ Ajouter un participant à un appel
  static async add(req, res) {
    try {
      const { call_id, user_id, role } = req.body;

      if (!call_id || !user_id) {
        return res.status(400).json({
          success: false,
          message: "call_id et user_id sont obligatoires",
        });
      }

      const participant = await CallParticipantService.add(call_id, user_id, role);

      return res.status(201).json({
        success: true,
        data: participant,
      });
    } catch (err) {
      console.error("CallParticipantController.add error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ✅ Supprimer un participant d'un appel
  static async remove(req, res) {
    try {
      const id = req.params?.id;
      if (!id) {
        return res.status(400).json({ success: false, message: "id manquant" });
      }

      const success = await CallParticipantService.remove(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Participant non trouvé",
        });
      }

      return res.json({
        success: true,
        message: "Participant supprimé",
      });
    } catch (err) {
      console.error("CallParticipantController.remove error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ✅ Lister tous les participants d'un appel
  static async listByCall(req, res) {
    try {
      const call_id = req.params?.call_id;
      if (!call_id) {
        return res.status(400).json({ success: false, message: "call_id manquant" });
      }

      const participants = await CallParticipantService.listByCall(call_id);

      return res.json({
        success: true,
        data: participants,
      });
    } catch (err) {
      console.error("CallParticipantController.listByCall error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = CallParticipantController;