// src/controllers/Ads.controller.js
require('')

class AdsController {
  static async createAd(req, res) {
    try {
      const { title, brand_id } = req.body;

      if (!title || !brand_id) {
        return res.status(400).json({
          success: false,
          message: 'title et brand_id sont obligatoires',
        });
      }

      const ad = await AdsService.createAd(req.body);

      return res.status(201).json({
        success: true,
        message: 'Publicité créée avec succès',
        data: ad,
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur',
      });
    }
  }

  static async getAds(req, res) {
    try {
      const ads = await AdsService.getAds();
      return res.json({
        success: true,
        data: ads,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }

  static async getBrandAds(req, res) {
    try {
      const { brand_id } = req.params;
      const ads = await AdsService.getBrandAds(brand_id);

      return res.json({
        success: true,
        data: ads,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
      });
    }
  }

  static async updateAd(req, res) {
    try {
      const { id } = req.params;
      const ad = await AdsService.updateAd(id, req.body);

      return res.json({
        success: true,
        message: 'Publicité mise à jour',
        data: ad,
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async deleteAd(req, res) {
    try {
      const { id } = req.params;
      const ad = await AdsService.deleteAd(id);

      return res.json({
        success: true,
        message: 'Publicité supprimée',
        data: ad,
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

module.exports = AdsController;

