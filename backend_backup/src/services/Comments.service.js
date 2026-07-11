require('')

class CommentsService {
  // Créer un commentaire
  static async createComment({ userId, postId, content }) {
    if (!content) {
      throw new Error('Le contenu du commentaire est requis');
    }

    return await db.Comment.create({
      user_id: userId,
      post_id: postId,
      content
    });
  }

  // Récupérer les commentaires d’un post
  static async getCommentsByPost(postId) {
    return await db.Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'avatar_url']
        }
      ],
      order: [['created_at', 'ASC']]
    });
  }

  // Supprimer un commentaire (auteur uniquement)
  static async deleteComment(commentId, userId) {
    const comment = await db.Comment.findByPk(commentId);
    if (!comment) throw new Error('Commentaire non trouvé');

    if (comment.user_id !== userId) {
      const err = new Error('Action non autorisée');
      err.status = 403;
      throw err;
    }

    await comment.destroy(); // soft delete
    return true;
  }
}

module.exports = CommentsService;

