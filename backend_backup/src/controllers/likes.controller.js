require('')

class LikesController {

  // LIKE
  static async likePost(req, res) {
    try {
      const { postId } = req.body;
      if (!postId) {
        return res.status(400).json({ error: 'postId requis' });
      }

      await LikesService.like(req.user.id, postId);
      res.status(201).json({ success: true });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // UNLIKE
  static async unlikePost(req, res) {
    try {
      const { postId } = req.body;
      if (!postId) {
        return res.status(400).json({ error: 'postId requis' });
      }

      await LikesService.unlike(req.user.id, postId);
      res.json({ success: true });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // COUNT
  static async countLikes(req, res) {
    try {
      const count = await LikesService.count(req.params.postId);
      res.json({ count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // USERS WHO LIKED
  static async usersWhoLiked(req, res) {
    try {
      const users = await LikesService.users(req.params.postId);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = LikesController;

