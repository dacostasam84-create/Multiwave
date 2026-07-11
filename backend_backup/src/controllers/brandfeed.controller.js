'use strict';

const BrandFeedService = require("../services/BrandFeed.service");

class BrandFeedController {
  // ✅ Récupérer le feed de l'utilisateur
  static async getFeed(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
      }

      const feed = await BrandFeedService.getFeed({
        userId,
        limit: Number(req.query.limit) || 20,
      });

      return res.json({ success: true, data: feed });
    } catch (err) {
      console.error("getFeed error:", err);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  // ✅ Créer une publication BrandFeed
  static async createFeed(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
      }

      const { brand_id, title, description, media_path } = req.body;

      if (!brand_id || !title) {
        return res.status(400).json({ success: false, message: "brand_id et title sont obligatoires" });
      }

      const feed = await BrandFeedService.createFeed({
        userId,
        brandId: brand_id,
        title,
        description,
        media_path,
      });

      return res.status(201).json({
        success: true,
        message: "Publication créée",
        data: feed,
      });
    } catch (err) {
      console.error("createFeed error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ✅ Supprimer une publication BrandFeed
  static async deleteFeed(req, res) {
    try {
      const userId = req.user?.id;
      const feedId = req.params?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
      }

      if (!feedId) {
        return res.status(400).json({ success: false, message: "feedId manquant" });
      }

      await BrandFeedService.deleteFeed({ feedId, userId });

      return res.json({ success: true, message: "Publication supprimée" });
    } catch (err) {
      console.error("deleteFeed error:", err);
      return res.status(err.status || 500).json({ success: false, message: err.message });
    }
  }
}

module.exports = BrandFeedController;