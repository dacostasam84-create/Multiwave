// src/routes/feed.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models');
const { Op }  = require('sequelize');

// GET /api/feed/posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, filter = 'all', user_id, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where  = { status: 'public' };

    if (filter === 'following' && user_id) {
      const following = await db.Followers.findAll({
        where: { follower_id: user_id },
        attributes: ['followed_id'],
      });
      const ids = following.map(f => f.followed_id);
      where.user_id = { [Op.in]: ids };
    } else if (filter === 'trending') {
      where.likes_count = { [Op.gte]: 10 };
    } else if (filter === 'media') {
      where.media_type = { [Op.in]: ['image', 'video', 'audio'] };
    }

    const posts = await db.Posts.findAll({
      where,
      order:   [['created_at', 'DESC']],
      limit:   parseInt(limit),
      offset,
      include: [{ model: db.Users, as: 'author', attributes: ['id', 'username', 'avatar', 'is_verified'] }],
    });

    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/feed/like
router.post('/like', async (req, res) => {
  try {
    const { user_id, post_id } = req.body;
    await db.Likes.create({ user_id, post_id });
    await db.Posts.increment('likes_count', { where: { id: post_id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;