'use strict';
const LikesService = require('../services/Likes.service');

class LikesController {

  static async react(req, res) {
    try {
      const { post_id, video_id, debate_id, reaction = 'like' } = req.body;
      const result = await LikesService.react({
        userId: req.user.id,
        postId: post_id,
        videoId: video_id,
        debateId: debate_id,
        reaction
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async unlike(req, res) {
    try {
      const { post_id, video_id, debate_id } = req.body;
      await LikesService.unlike({
        userId: req.user.id,
        postId: post_id,
        videoId: video_id,
        debateId: debate_id
      });
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getLikes(req, res) {
    try {
      const { post_id, video_id, debate_id } = req.query;
      const data = await LikesService.getLikes({ postId: post_id, videoId: video_id, debateId: debate_id });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getReactionCounts(req, res) {
    try {
      const { post_id, video_id, debate_id } = req.query;
      const counts = await LikesService.getReactionCounts({ postId: post_id, videoId: video_id, debateId: debate_id });
      res.json({ success: true, data: counts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = LikesController;