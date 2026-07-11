// src/routes/feed.routes.js
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models');
const { Op }  = require('sequelize');

router.get('/posts', async (req, res) => {
  try {
    const { page = 1, filter = 'all', user_id, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where  = { status: 'public' };

    if (filter === 'following' && user_id) {
      const following = await db.Followers.findAll({ where: { follower_id: user_id }, attributes: ['followed_id'] });
      const ids = following.map(f => f.followed_id);
      where.user_id = { [Op.in]: ids.length ? ids : [0] };
    } else if (filter === 'trending') {
      where.likes_count = { [Op.gte]: 5 };
    } else if (filter === 'media') {
      where.media_type = { [Op.in]: ['image', 'video', 'audio'] };
    }

    const posts = await db.Posts.findAll({
      where, order: [['created_at', 'DESC']], limit: parseInt(limit), offset,
      include: [{ model: db.Users, as: 'author', attributes: ['id', 'username', 'avatar', 'is_verified'] }],
    });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts', async (req, res) => {
  try {
    const { user_id, content, media, media_type = 'none', status = 'public' } = req.body;
    if (!user_id || !content) return res.status(400).json({ error: 'user_id et content requis' });
    const post = await db.Posts.create({ user_id, content, media: media || null, media_type, status, likes_count: 0, comments_count: 0 });
    const full = await db.Posts.findByPk(post.id, { include: [{ model: db.Users, as: 'author', attributes: ['id', 'username', 'avatar', 'is_verified'] }] });
    res.status(201).json({ success: true, data: full });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await db.Posts.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });
    await post.destroy();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:id/like', async (req, res) => {
  try {
    const { user_id } = req.body;
    const post_id = req.params.id;
    const existing = await db.Likes.findOne({ where: { user_id, post_id } });
    if (existing) {
      await existing.destroy();
      await db.Posts.decrement('likes_count', { where: { id: post_id } });
      return res.json({ success: true, liked: false });
    }
    await db.Likes.create({ user_id, post_id });
    await db.Posts.increment('likes_count', { where: { id: post_id } });
    res.json({ success: true, liked: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await db.Comments.findAll({
      where: { post_id: req.params.id }, order: [['created_at', 'ASC']],
      include: [{ model: db.Users, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });
    res.json({ success: true, data: comments });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const post_id = req.params.id;
    const comment = await db.Comments.create({ user_id, post_id, content, likes_count: 0 });
    await db.Posts.increment('comments_count', { where: { id: post_id } });
    const full = await db.Comments.findByPk(comment.id, { include: [{ model: db.Users, as: 'author', attributes: ['id', 'username', 'avatar'] }] });
    res.status(201).json({ success: true, data: full });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
