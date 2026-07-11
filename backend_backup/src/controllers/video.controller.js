require('')

const VideoController = {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Aucun fichier vidéo reçu"
        });
      }

      const userId = req.user.id;
      const duration = req.body.duration ? parseInt(req.body.duration, 10) : null;

      const video = await VideoService.uploadVideo({
        userId,
        file: req.file,
        duration
      });

      res.status(201).json({
        success: true,
        message: "Vidéo uploadée avec succès",
        data: video
      });
    } catch (err) {
      console.error('VideoController.upload:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID vidéo requis"
        });
      }

      await VideoService.deleteVideo(id);

      res.json({
        success: true,
        message: "Vidéo supprimée avec succès"
      });
    } catch (err) {
      console.error('VideoController.remove:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = VideoController;

