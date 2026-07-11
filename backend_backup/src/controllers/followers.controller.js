'use strict';

const FollowersService = require("../services/Followers.service");

// FOLLOW
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user?.id;
    const { followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: "Paramètres manquants" });
    }

    const relation = await FollowersService.follow(followerId, followingId);

    if (!relation) {
      return res.status(409).json({ error: "Utilisateur déjà suivi" });
    }

    res.status(201).json({ message: "Utilisateur suivi avec succès" });
  } catch (err) {
    console.error("followUser error:", err);
    res.status(400).json({ error: err.message });
  }
};

// UNFOLLOW
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user?.id;
    const { followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: "Paramètres manquants" });
    }

    await FollowersService.unfollow(followerId, followingId);
    res.json({ message: "Désabonnement réussi" });
  } catch (err) {
    console.error("unfollowUser error:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET FOLLOWERS
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId manquant" });

    const followers = await FollowersService.getFollowers(userId);
    res.json(followers);
  } catch (err) {
    console.error("getFollowers error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET FOLLOWING
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId manquant" });

    const following = await FollowersService.getFollowing(userId);
    res.json(following);
  } catch (err) {
    console.error("getFollowing error:", err);
    res.status(500).json({ error: err.message });
  }
};