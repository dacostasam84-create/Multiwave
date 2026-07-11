require('')
require('')
require('')

class PostsService {

  static async createPost({ userId, content, media, mediaType, status }) {
    if (!content) throw new Error('Contenu requis');

    return db.Post.create({
      user_id: userId,
      content,
      media: media || null,
      media_type: mediaType || 'none',
      status: status || 'public'
    });
  }

  static async getAllPosts(limit = 50) {
    return db.Post.findAll({
      limit,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: db.Like,
          as: 'likes',
          attributes: ['user_id']
        }
      ]
    });
  }

  static async getUserPosts(userId) {
    return db.Post.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'username', 'avatar_url']
        },
        {
          model: db.Like,
          as: 'likes',
          attributes: ['user_id']
        }
      ]
    });
  }

  static async deletePost(postId, userId) {
    const post = await db.Post.findByPk(postId);
    if (!post || post.user_id !== userId) {
      throw new Error('Post introuvable ou accès refusé');
    }

    if (post.media) {
      const filePath = path.join(__dirname, '../../uploads/posts', post.media);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.destroy();
    return true;
  }
}

module.exports = PostsService;

