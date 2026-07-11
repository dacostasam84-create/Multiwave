'use strict';

const FollowersModel = require("../models/Followers.model");
const redisClient = require("../config/redis");
const NotificationService = require("./Notification.service");

class FollowersService {
  static async follow(followerId, followingId, io = null) {
    if (!followerId || !followingId) throw new Error("Paramètres manquants");
    if (followerId === followingId) throw new Error("Impossible de se suivre soi-même");

    const exists = await FollowersModel.findOne({
      where: { follower_id: followerId, followed_id: followingId },
    });
    if (exists) return null;

    const relation = await FollowersModel.create({
      follower_id: followerId,
      followed_id: followingId,
    });

    await redisClient.del(`followers:${followingId}`);
    await redisClient.del(`following:${followerId}`);

    // Notification temps réel
    if (io) {
      await NotificationService.send(io, {
        userId: followingId,
        fromUserId: followerId,
        type: 'follow',
        content: 'Quelqu\'un a commencé à vous suivre',
        referenceId: followerId,
        referenceType: 'user'
      });
    }

    return relation;
  }

  static async unfollow(followerId, followingId) {
    await FollowersModel.destroy({
      where: { follower_id: followerId, followed_id: followingId },
    });
    await redisClient.del(`followers:${followingId}`);
    await redisClient.del(`following:${followerId}`);
  }

  static async getFollowers(userId) {
    const cacheKey = `followers:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const followers = await FollowersModel.findAll({
      where: { followed_id: userId },
    });

    await redisClient.set(cacheKey, JSON.stringify(followers), { EX: 300 });
    return followers;
  }

  static async getFollowing(userId) {
    const cacheKey = `following:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const following = await FollowersModel.findAll({
      where: { follower_id: userId },
    });

    await redisClient.set(cacheKey, JSON.stringify(following), { EX: 300 });
    return following;
  }

  static async isFollowing(followerId, followingId) {
    const relation = await FollowersModel.findOne({
      where: { follower_id: followerId, followed_id: followingId },
    });
    return !!relation;
  }
}

module.exports = FollowersService;