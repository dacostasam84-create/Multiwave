const UserStateService = require("../services/UserState.service");

const UserStateController = {
  async setState(req, res) {
    try {
      const userId = req.user.id;
      const { online } = req.body;

      if (typeof online !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Valeur online invalide' });
      }

      const state = await UserStateService.setState(userId, { online });
      res.json({ success: true, data: state });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getState(req, res) {
    try {
      const userId = req.user.id;
      const state = await UserStateService.getState(userId);
      res.json({ success: true, data: state });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async deleteState(req, res) {
    try {
      const userId = req.user.id;
      await UserStateService.deleteState(userId);
      res.json({ success: true, message: 'État utilisateur supprimé' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = UserStateController;

