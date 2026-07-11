// require('')

class BrandFeedController {
  static async getFeed(req, res) {
    try {
      const feed = await BrandFeedService.getFeed({
        userId: req.user.id,
        limit: Number(req.query.limit) || 20,
      });

      return res.json({
        success: true,
        data: feed,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }

  static async createFeed(req, res) {
    try {
      const { brand_id, title, description, media_path } = req.body;

      if (!brand_id || !title) {
        return res.status(400).json({
          success: false,
          message: 'brand_id et title sont obligatoires',
        });
      }

      const feed = await BrandFeedService.createFeed({
        userId: req.user.id,
        brandId: brand_id,
        title,
        description,
        media_path,
      });

      return res.status(201).json({
        success: true,
        message: 'Publication créée',
        data: feed,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async deleteFeed(req, res) {
    try {
      await BrandFeedService.deleteFeed({
        feedId: req.params.id,
        userId: req.user.id,
      });

      return res.json({
        success: true,
        message: 'Publication supprimée',
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

module.exports = BrandFeedController;

