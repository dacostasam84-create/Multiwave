// src/routes/analytics.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const db = require('../models');
const UserEvent = db.UserEvent;
const UserState = db.UserState;
const AiLog     = db.AiLog;
const { Op, fn, col, literal } = require('sequelize');

// ─────────────────────────────────────────────
// Helper période
// ─────────────────────────────────────────────
const getPeriodDate = (period) => {
  const now = new Date();
  const map = { '1d':1, '7d':7, '30d':30, '90d':90 };
  const days = map[period] || 7;
  return new Date(now.setDate(now.getDate() - days));
};

// GET /api/analytics/stats?period=7d
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const since = getPeriodDate(period);

    const [
      total_users,
      active_today,
      new_this_week,
      total_posts,
      total_messages,
      total_orders,
    ] = await Promise.all([
      db.Users.count(),
      db.Users.count({ where: { is_online: true } }),
      db.Users.count({ where: { created_at: { [Op.gte]: since } } }),
      db.Posts.count(),
      db.Messages.count(),
      db.Orders.count(),
    ]);

    res.json({
      success: true,
      data: {
        total_users,
        active_today,
        new_this_week,
        total_posts,
        total_messages,
        total_orders,
        avg_session: '8m 42s',
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/events?user_id=X&period=7d
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const { user_id, period = '7d', limit = 50 } = req.query;
    const since = getPeriodDate(period);
    const where = { created_at: { [Op.gte]: since } };
    if (user_id) where.user_id = user_id;

    const events = await UserEvent.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      include: [{ model: db.Users, as: 'user', attributes: ['id', 'username'] }],
    });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analytics/events — enregistrer un événement
router.post('/events', async (req, res) => {
  try {
    const { user_id, event_type, event_data } = req.body;
    const event = await UserEvent.create({ user_id, event_type, event_data });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/states — statuts utilisateurs
router.get('/states', authMiddleware, async (req, res) => {
  try {
    const states = await UserState.findAll({
      order: [['last_active', 'DESC']],
      limit: 100,
      include: [{ model: db.Users, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });
    res.json({ success: true, data: states });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/ai-logs?period=7d
router.get('/ai-logs', authMiddleware, async (req, res) => {
  try {
    const { period = '7d', limit = 100, action } = req.query;
    const since = getPeriodDate(period);
    const where = { created_at: { [Op.gte]: since } };
    if (action) where.action = action;

    const logs = await AiLog.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      include: [{ model: db.Users, as: 'user', attributes: ['id', 'username'] }],
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analytics/ai-logs — enregistrer un log IA
router.post('/ai-logs', async (req, res) => {
  try {
    const { user_id, action, model, input_text, output_text, tokens_used, language, status } = req.body;
    const log = await AiLog.create({ user_id, action, model, input_text, output_text, tokens_used, language, status });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
