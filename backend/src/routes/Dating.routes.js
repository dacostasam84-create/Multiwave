// src/routes/dating.routes.js
'use strict';

const express = require('express');
const router  = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { imageUpload }    = require('../middlewares/upload.middleware');
const db = require('../models');
const DatingProfile = db.DatingProfile;
const DatingMatch   = db.DatingMatch;
const { Op } = require('sequelize');

// ─────────────────────────────────────────────
// PROFILS DATING
// ─────────────────────────────────────────────

// GET /api/dating/profiles — découvrir des profils
router.get('/profiles', authMiddleware, async (req, res) => {
  try {
    const { user_id, gender, min_age, max_age, location, limit = 20, offset = 0 } = req.query;
    const where = { is_active: true };
    if (gender)  where.gender   = gender;
    if (location) where.location = { [Op.like]: `%${location}%` };

    // Exclure l'utilisateur lui-même et ses matches
    const myMatches = await DatingMatch.findAll({
      where: { [Op.or]: [{ user_id_1: user_id }, { user_id_2: user_id }] },
      attributes: ['user_id_1', 'user_id_2'],
    });
    const excludeIds = [parseInt(user_id), ...myMatches.map(m =>
      m.user_id_1 === parseInt(user_id) ? m.user_id_2 : m.user_id_1
    )];
    where.user_id = { [Op.notIn]: excludeIds };

    const profiles = await DatingProfile.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: db.Users, as: 'user', attributes: ['id', 'username', 'avatar', 'location'] }],
    });
    res.json({ success: true, data: profiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dating/profiles/me?user_id=X — mon profil
router.get('/profiles/me', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;
    const profile = await DatingProfile.findOne({
      where: { user_id },
      include: [{ model: db.Users, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });
    if (!profile) return res.status(404).json({ error: 'Profil non trouvé' });
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dating/profiles — créer mon profil
router.post('/profiles', authMiddleware, imageUpload.array('photos', 6), async (req, res) => {
  try {
    const { user_id, bio, age, gender, looking_for, location, interests } = req.body;
    const photos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const existing = await DatingProfile.findOne({ where: { user_id } });
    if (existing) return res.status(400).json({ error: 'Profil déjà existant, utilisez PUT' });

    const profile = await DatingProfile.create({
      user_id, bio, age, gender, looking_for, location,
      interests: JSON.stringify(interests || []),
      photos: JSON.stringify(photos),
      is_active: true,
    });
    res.status(201).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dating/profiles/:id — mettre à jour
router.put('/profiles/:id', authMiddleware, imageUpload.array('photos', 6), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.length) updates.photos = JSON.stringify(req.files.map(f => `/uploads/${f.filename}`));
    if (updates.interests) updates.interests = JSON.stringify(updates.interests);
    await DatingProfile.update(updates, { where: { id: req.params.id, user_id: req.body.user_id } });
    const profile = await DatingProfile.findByPk(req.params.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// LIKES / MATCHES
// ─────────────────────────────────────────────

// POST /api/dating/like — liker un profil
router.post('/like', authMiddleware, async (req, res) => {
  try {
    const { user_id, target_user_id, action } = req.body; // action: 'like' | 'pass' | 'superlike'

    // Vérifier si l'autre a déjà liké
    const reciprocalLike = await DatingMatch.findOne({
      where: { user_id_1: target_user_id, user_id_2: user_id, status: 'liked' }
    });

    if (reciprocalLike && action === 'like') {
      // C'est un MATCH !
      await reciprocalLike.update({ status: 'matched', matched_at: new Date() });
      const match = await DatingMatch.create({
        user_id_1: user_id, user_id_2: target_user_id,
        status: 'matched', matched_at: new Date(),
      });
      return res.status(201).json({ success: true, match: true, data: match });
    }

    // Enregistrer le like/pass
    const record = await DatingMatch.create({
      user_id_1: user_id, user_id_2: target_user_id,
      status: action === 'like' ? 'liked' : action === 'superlike' ? 'superliked' : 'passed',
    });
    res.status(201).json({ success: true, match: false, data: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dating/matches?user_id=X — mes matches
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;
    const matches = await DatingMatch.findAll({
      where: {
        [Op.or]: [{ user_id_1: user_id }, { user_id_2: user_id }],
        status: 'matched',
      },
      order: [['matched_at', 'DESC']],
    });

    // Enrichir avec les profils
    const enriched = await Promise.all(matches.map(async (m) => {
      const otherId = m.user_id_1 === parseInt(user_id) ? m.user_id_2 : m.user_id_1;
      const profile = await DatingProfile.findOne({
        where: { user_id: otherId },
        include: [{ model: db.Users, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      });
      return { ...m.toJSON(), profile };
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dating/likes-received?user_id=X — qui m'a liké
router.get('/likes-received', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;
    const likes = await DatingMatch.findAll({
      where: { user_id_2: user_id, status: { [Op.in]: ['liked', 'superliked'] } },
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;