// src/routes/Followers.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const FollowersController = require('../controllers/followers.controller');
const db   = require('../models');
const { Op } = require('sequelize');

// FOLLOW
router.post('/follow',   authMiddleware, FollowersController.followUser);

// UNFOLLOW
router.post('/unfollow', authMiddleware, FollowersController.unfollowUser);

// FOLLOWING
router.get('/following/:userId', authMiddleware, FollowersController.getFollowing);

// SUGGESTIONS — doit être AVANT /:userId
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const { user_id, limit = 10 } = req.query;

    // Trouver les IDs déjà suivis
    const following = await db.Followers.findAll({
      where: { follower_id: user_id },
      attributes: ['followed_id'],
    });
    const followingIds = following.map(f => f.followed_id);
    followingIds.push(parseInt(user_id)); // exclure soi-même

    // Suggérer des utilisateurs non suivis
    const suggestions = await db.Users.findAll({
      where: {
        id: { [Op.notIn]: followingIds },
        is_online: { [Op.in]: [true, false] },
      },
      attributes: ['id', 'username', 'full_name', 'avatar', 'bio', 'location', 'is_verified', 'followers_count', 'posts_count'],
      order: [['followers_count', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FOLLOWERS
router.get('/:userId', authMiddleware, FollowersController.getFollowers);

module.exports = router;