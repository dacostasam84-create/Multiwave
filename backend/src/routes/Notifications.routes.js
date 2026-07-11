// src/routes/notifications.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

// ─────────────────────────────────────────────
// CONTROLLER INLINE
// ─────────────────────────────────────────────
const db = require('../models');
const Notifications = db.Notifications;
const { Op } = require('sequelize');

// GET /api/notifications?user_id=X
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, limit = 50, offset = 0 } = req.query;
    const notifs = await Notifications.findAll({
      where: { user_id, is_read: { [Op.in]: [true, false] } },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: db.Users, as: 'from_user', attributes: ['id', 'username', 'avatar'] }],
    });
    res.json({ success: true, data: notifs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications — créer une notification
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, from_user_id, type, content, reference_id, reference_type } = req.body;
    const notif = await Notifications.create({ user_id, from_user_id, type, content, reference_id, reference_type });
    res.status(201).json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id/read — marquer comme lu
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    await Notifications.update({ is_read: true }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/read-all — tout marquer comme lu
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.body;
    await Notifications.update({ is_read: true }, { where: { user_id, is_read: false } });
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Notifications.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Notification supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications/clear-all
router.delete('/clear-all', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.body;
    await Notifications.destroy({ where: { user_id } });
    res.json({ success: true, message: 'Toutes les notifications supprimées' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;