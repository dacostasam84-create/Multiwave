require('')

class ChannelsController {
  // Créer un channel
  static async createChannel(req, res, next) {
    try {
      const channel = await ChannelsService.createChannel(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Channel créé', data: channel });
    } catch (err) {
      next(err);
    }
  }

  // Mettre à jour un channel
  static async updateChannel(req, res, next) {
    try {
      const channel = await ChannelsService.updateChannel(req.params.id, req.body, req.user.id);
      res.json({ success: true, message: 'Channel mis à jour', data: channel });
    } catch (err) {
      next(err);
    }
  }

  // Supprimer un channel
  static async deleteChannel(req, res, next) {
    try {
      await ChannelsService.deleteChannel(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: 'Channel supprimé' });
    } catch (err) {
      next(err);
    }
  }

  // Lister tous les channels
  static async listChannels(req, res, next) {
    try {
      const channels = await ChannelsService.listChannels();
      res.json({ success: true, data: channels });
    } catch (err) {
      next(err);
    }
  }

  // Rejoindre un channel
  static async joinChannel(req, res, next) {
    try {
      const result = await ChannelsService.joinChannel(req.params.id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Quitter un channel
  static async leaveChannel(req, res, next) {
    try {
      const result = await ChannelsService.leaveChannel(req.params.id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ChannelsController;

