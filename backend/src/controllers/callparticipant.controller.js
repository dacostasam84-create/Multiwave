// require('')

class CallParticipantcontroller {
  static async add(req, res) {
    try {
      const { call_id, user_id, role } = req.body;
      if (!call_id || !user_id) {
        return res.status(400).json({ success: false, message: 'Champs manquants' });
      }

      const participant = await CallParticipantService.add(call_id, user_id, role);
      return res.status(201).json({ success: true, data: participant });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;
      const success = await CallParticipantService.remove(id);
      if (!success) return res.status(404).json({ success: false, message: 'Participant non trouvé' });

      return res.json({ success: true, message: 'Participant supprimé' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listByCall(req, res) {
    try {
      const { call_id } = req.params;
      const participants = await CallParticipantService.listByCall(call_id);
      return res.json({ success: true, data: participants });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = CallParticipantController;

