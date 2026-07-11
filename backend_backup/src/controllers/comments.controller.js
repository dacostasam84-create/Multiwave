require('')

class CommentsController {
  // Créer un commentaire
  static async createComment(req, res) {
    try {
      const { post_id, content } = req.body;

      if (!post_id || !content) {
        return res.status(400).json({ success: false, message: 'Champs manquants' });
      }

      const comment = await CommentsService.createComment({
        userId: req.user.id,
        postId: post_id,
        content
      });

      return res.status(201).json({
        success: true,
        message: 'Commentaire créé',
        data: comment
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Récupérer les commentaires d’un post
  static async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      const comments = await CommentsService.getCommentsByPost(postId);

      return res.json({ success: true, data: comments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Supprimer un commentaire
  static async deleteComment(req, res) {
    try {
      await CommentsService.deleteComment(req.params.id, req.user.id);

      return res.json({
        success: true,
        message: 'Commentaire supprimé'
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = CommentsController;

