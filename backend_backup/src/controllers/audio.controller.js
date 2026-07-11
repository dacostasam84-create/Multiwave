require('')

class AudioController {
  static async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier audio reçu',
        });
      }

      const audio = await AudioService.uploadAudio({
        userId: req.user.id,
        file: req.file,
      });

      return res.status(201).json({
        success: true,
        message: 'Audio uploadé avec succès',
        data: audio,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Erreur serveur',
      });
    }
  }

  static async getMyAudios(req, res) {
    try {
      const audios = await AudioService.getUserAudios(req.user.id);

      return res.json({
        success: true,
        data: audios,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;

      await AudioService.deleteAudio({
        audioId: id,
        userId: req.user.id,
      });

      return res.json({
        success: true,
        message: 'Audio supprimé avec succès',
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = AudioController;

