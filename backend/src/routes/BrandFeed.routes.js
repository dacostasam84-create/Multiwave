// src/routes/brand-feeds.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { imageUpload } = require('../middlewares/upload.middleware');
const db = require('../models');
const BrandFeed = db.BrandFeed;
const { Op } = require('sequelize');

// GET /api/brand-feeds
router.get('/', async (req, res) => {
  try {
    const { brand_id, user_id, country_target, limit = 20, offset = 0 } = req.query;
    const where = { is_active: true };
    if (brand_id)       where.brand_id       = brand_id;
    if (user_id)        where.user_id        = user_id;
    if (country_target) where.country_target = country_target;

    const feeds = await BrandFeed.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: db.Brand, as: 'brand', attributes: ['id', 'name', 'logo_url'] },
        { model: db.Users, as: 'user',  attributes: ['id', 'username', 'avatar'] },
      ],
    });
    res.json({ success: true, data: feeds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/brand-feeds
router.post('/', authMiddleware, imageUpload.single('media'), async (req, res) => {
  try {
    const { user_id, brand_id, title, description, media_type, link_url, country_target } = req.body;
    const media_path = req.file ? `/uploads/${req.file.filename}` : req.body.media_path;
    const feed = await BrandFeed.create({ user_id, brand_id, title, description, media_path, media_type, link_url, country_target });
    res.status(201).json({ success: true, data: feed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/brand-feeds/:id/view
router.patch('/:id/view', async (req, res) => {
  try {
    await BrandFeed.increment('views_count', { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/brand-feeds/:id/like
router.patch('/:id/like', authMiddleware, async (req, res) => {
  try {
    await BrandFeed.increment('likes_count', { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/brand-feeds/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await BrandFeed.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Post supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
