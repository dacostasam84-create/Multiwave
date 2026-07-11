'use strict';
const { Op } = require('sequelize');
const Likes = require('../models/Likes.model');
const Users = require('../models/Users.model');

class LikesService {

  static async react({ userId, postId, videoId, debateId, reaction = 'like' }) {
    const where = { user_id: userId };
    if (postId) where.post_id = postId;
    if (videoId) where.video_id = videoId;
    if (debateId) where.debate_id = debateId;

    // Si déjà liké — mettre à jour la réaction
    const existing = await Likes.findOne({ where });
    if (existing) {
      await existing.update({ reaction });
      return existing;
    }

    return await Likes.create({
      user_id: userId,
      post_id: postId || null,
      video_id: videoId || null,
      debate_id: debateId || null,
      reaction
    });
  }

  static async unlike({ userId, postId, videoId, debateId }) {
    const where = { user_id: userId };
    if (postId) where.post_id = postId;
    if (videoId) where.video_id = videoId;
    if (debateId) where.debate_id = debateId;

    return await Likes.destroy({ where });
  }

  static async getLikes({ postId, videoId, debateId }) {
    const where = {};
    if (postId) where.post_id = postId;
    if (videoId) where.video_id = videoId;
    if (debateId) where.debate_id = debateId;

    return await Likes.findAll({
      where,
      include: [{ model: Users, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      order: [['created_at', 'DESC']]
    });
  }

  static async getReactionCounts({ postId, videoId, debateId }) {
    const where = {};
    if (postId) where.post_id = postId;
    if (videoId) where.video_id = videoId;
    if (debateId) where.debate_id = debateId;

    const likes = await Likes.findAll({ where });

    const counts = {};
    likes.forEach(l => {
      counts[l.reaction] = (counts[l.reaction] || 0) + 1;
    });

    return { total: likes.length, reactions: counts };
  }
}

module.exports = LikesService;