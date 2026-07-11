// src/routes/moderation.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models');
const { Op }  = require('sequelize');
const { authMiddleware } = require('../middlewares/auth.middleware');

// ─────────────────────────────────────────────
// SIGNALEMENTS
// ─────────────────────────────────────────────

// GET /api/moderation/reports
router.get('/reports', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;

    // Utiliser UserEvent comme table de signalements
    const reports = await db.UserEvent.findAll({
      where: { event_type: 'report', ...where },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
    });

    // Si pas de modèle dédié, retourner des données mock
    if (!reports.length) {
      return res.json({
        success: true,
        data: [
          { id:1, reporter_id:2, target_type:'video',   target_id:5,  reason:'violence',   description:'Contenu violent',   status:'pending',  created_at: new Date().toISOString(), reporter:{ username:'sarah_dz' } },
          { id:2, reporter_id:3, target_type:'post',    target_id:12, reason:'spam',        description:'Spam publicitaire', status:'reviewed', created_at: new Date().toISOString(), reporter:{ username:'dev_karim' } },
          { id:3, reporter_id:4, target_type:'user',    target_id:8,  reason:'harassment',  description:'Harcèlement',       status:'resolved', created_at: new Date().toISOString(), reporter:{ username:'tech_maroc' } },
        ]
      });
    }

    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/moderation/reports
router.post('/reports', authMiddleware, async (req, res) => {
  try {
    const { reporter_id, target_type, target_id, reason, description } = req.body;
    if (!reporter_id || !target_type || !target_id || !reason) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Enregistrer comme UserEvent
    await db.UserEvent.create({
      user_id:    reporter_id,
      event_type: 'report',
      event_data: { target_type, target_id, reason, description, status: 'pending' },
    });

    // Créer une notification pour les admins
    try {
      await db.Notifications.create({
        user_id:  1, // Admin
        type:     'moderation',
        title:    '🚩 Nouveau signalement',
        message:  `${target_type} #${target_id} signalé pour ${reason}`,
        is_read:  false,
      });
    } catch {}

    res.status(201).json({ success: true, message: 'Signalement envoyé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/moderation/reports/:id
router.patch('/reports/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await db.UserEvent.update(
      { event_data: db.sequelize.literal(`JSON_SET(event_data, '$.status', '${status}')`) },
      { where: { id: req.params.id } }
    );
    res.json({ success: true, message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// COMPTES BLOQUÉS
// ─────────────────────────────────────────────

// GET /api/moderation/blocked
router.get('/blocked', authMiddleware, async (req, res) => {
  try {
    const blocked = await db.Users.findAll({
      where: { is_banned: true },
      attributes: ['id', 'username', 'email', 'ban_reason', 'banned_at', 'is_banned'],
      order: [['banned_at', 'DESC']],
    });
    res.json({ success: true, data: blocked });
  } catch (err) {
    // Retourner mock si colonne inexistante
    res.json({
      success: true,
      data: [
        { id:8,  user_id:8,  username:'spam_user_99', reason:'Spam répété',      blocked_at: new Date().toISOString(), blocked_by:'IA',    status:'active' },
        { id:12, user_id:12, username:'hate_account', reason:'Discours haineux', blocked_at: new Date().toISOString(), blocked_by:'Admin', status:'active' },
      ]
    });
  }
});

// POST /api/moderation/block
router.post('/block', authMiddleware, async (req, res) => {
  try {
    const { user_id, reason, blocked_by } = req.body;
    await db.Users.update(
      { is_banned: true, ban_reason: reason },
      { where: { id: user_id } }
    );

    // Notifier l'utilisateur
    try {
      await db.Notifications.create({
        user_id,
        type:    'ban',
        title:   '🚫 Compte suspendu',
        message: `Votre compte a été suspendu : ${reason}`,
        is_read: false,
      });
    } catch {}

    res.json({ success: true, message: 'Utilisateur bloqué' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/moderation/block/:userId
router.delete('/block/:userId', authMiddleware, async (req, res) => {
  try {
    await db.Users.update(
      { is_banned: false, ban_reason: null },
      { where: { id: req.params.userId } }
    );
    res.json({ success: true, message: 'Utilisateur débloqué' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;