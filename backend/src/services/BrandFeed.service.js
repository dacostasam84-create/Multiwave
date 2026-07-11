const BrandFeedModel = require("../models/BrandFeed.model");

class BrandFeedService {
  static async getFeed({ userId, limit }) {
    return await db.BrandFeed.findAll({
      where: {
        user_id: userId,
        is_active: true,
      },
      include: [
        {
          model: db.Brand,
          as: 'brand',
          attributes: ['id', 'name', 'logo_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  static async createFeed({ userId, brandId, title, description, media_path }) {
    return await db.BrandFeed.create({
      user_id: userId,
      brand_id: brandId,
      title,
      description,
      media_path,
    });
  }

  static async deleteFeed({ feedId, userId }) {
    const feed = await db.BrandFeed.findOne({
      where: {
        id: feedId,
        user_id: userId,
      },
    });

    if (!feed) {
      const error = new Error('Publication introuvable');
      error.status = 404;
      throw error;
    }

    await feed.destroy();
    return true;
  }
}

module.exports = BrandFeedService;

