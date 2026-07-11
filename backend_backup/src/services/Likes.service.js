require('')

class LikesService {

  static async like(userId, postId) {
    const [like] = await db.Like.findOrCreate({
      where: {
        user_id: userId,
        post_id: postId
      }
    });

    return like;
  }

  static async unlike(userId, postId) {
    return await db.Like.destroy({
      where: {
        user_id: userId,
        post_id: postId
      }
    });
  }

  static async count(postId) {
    return await db.Like.count({
      where: { post_id: postId }
    });
  }

  static async users(postId) {
    return await db.Like.findAll({
      where: { post_id: postId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = LikesService;

