'use strict';

const FollowersModel = require("../models/Followers.model"); 
const UsersModel = require("../models/Users.model"); 
const redisClient = require("../config/redis"); // si tu utilises redis

class FollowersService {
  static async follow(followerId, followingId) {
    if (!followerId || !followingId) {
      throw new Error('Paramètres manquants');
    }
    if (followerId === followingId) {
      throw new Error('Impossible de se suivre soi-même');
    }

    const exists = await FollowersModel.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (exists) return null;

    const relation = await FollowersModel.create({
      follower_id: followerId,
      following_id: followingId
    });

    if (redisClient) {
      await redisClient.del(`followers:${followingId}`);
      await redisClient.del(`following:${followerId}`);
    }

    return relation;
  }

  static async unfollow(followerId, followingId) {
    await FollowersModel.destroy({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (redisClient) {
      await redisClient.del(`followers:${followingId}`);
      await redisClient.del(`following:${followerId}`);
    }
  }

  static async getFollowers(userId) {
    if (!userId) throw new Error('Paramètre userId manquant');
    const cacheKey = `followers:${userId}`;
    const cached = redisClient ? await redisClient.get(cacheKey) : null;
    if (cached) return JSON.parse(cached);

    const followers = await FollowersModel.findAll({
      where: { following_id: userId },
      include: [{ association: 'follower' }]
    });

    if (redisClient) await redisClient.set(cacheKey, JSON.stringify(followers), { EX: 300 });
    return followers;
  }

  static async getFollowing(userId) {
    if (!userId) throw new Error('Paramètre userId manquant');
    const cacheKey = `following:${userId}`;
    const cached = redisClient ? await redisClient.get(cacheKey) : null;
    if (cached) return JSON.parse(cached);

    const following = await FollowersModel.findAll({
      where: { follower_id: userId },
      include: [{ association: 'following' }]
    });

    if (redisClient) await redisClient.set(cacheKey, JSON.stringify(following), { EX: 300 });
    return following;
  }

  static async isFollowing(followerId, followingId) {
    const relation = await FollowersModel.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    return !!relation;
  }
}

module.exports = FollowersService;