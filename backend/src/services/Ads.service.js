// src/services/Ads.service.js
const AdsModel = require("../models/Ads.model");   // ton model Ads
class AdsService {
  static async createAd(data) {
    return await db.Ad.create(data);
  }

  static async getAds() {
    return await db.Ad.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  static async getBrandAds(brand_id) {
    return await db.Ad.findAll({
      where: { brand_id },
      order: [['createdAt', 'DESC']],
    });
  }

  static async updateAd(id, data) {
    const ad = await db.Ad.findByPk(id);
    if (!ad) {
      const error = new Error('Annonce introuvable');
      error.status = 404;
      throw error;
    }
    return await ad.update(data);
  }

  static async deleteAd(id) {
    const ad = await db.Ad.findByPk(id);
    if (!ad) {
      const error = new Error('Annonce introuvable');
      error.status = 404;
      throw error;
    }
    await ad.destroy();
    return ad;
  }
}

module.exports = AdsService;

