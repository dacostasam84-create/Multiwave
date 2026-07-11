// src/routes/jobs.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const db = require('../models');
const Jobs            = db.Jobs;
const JobApplications = db.JobApplications;
const { Op } = require('sequelize');

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { type, category, search, currency, limit = 20, offset = 0 } = req.query;
    const where = { is_active: true };
    if (type)   where.type     = type;
    if (currency) where.currency = currency;
    if (search) where[Op.or] = [
      { title:   { [Op.like]: `%${search}%` } },
      { company: { [Op.like]: `%${search}%` } },
    ];

    const jobs = await Jobs.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: db.Users, as: 'poster', attributes: ['id', 'username', 'avatar'] }],
    });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Jobs.findByPk(req.params.id, {
      include: [{ model: db.Users, as: 'poster', attributes: ['id', 'username', 'avatar'] }],
    });
    if (!job) return res.status(404).json({ error: 'Job non trouvé' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs — publier une offre
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      user_id, title, company, description, location, country,
      type, salary_min, salary_max, currency, skills,
      delivery_info, is_remote,
    } = req.body;
    const job = await Jobs.create({
      user_id, title, company, description, location, country,
      type, salary_min, salary_max, currency,
      skills: JSON.stringify(skills || []),
      is_active: true,
    });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/jobs/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Jobs.update(req.body, { where: { id: req.params.id, user_id: req.body.user_id } });
    const job = await Jobs.findByPk(req.params.id);
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Jobs.update({ is_active: false }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Offre désactivée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// CANDIDATURES
// ─────────────────────────────────────────────

// POST /api/jobs/:id/apply — postuler
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const { user_id, cover_letter, cv_url } = req.body;
    // Vérifier si déjà postulé
    const existing = await JobApplications.findOne({
      where: { job_id: req.params.id, user_id }
    });
    if (existing) return res.status(400).json({ error: 'Vous avez déjà postulé' });

    const application = await JobApplications.create({
      job_id: req.params.id, user_id, cover_letter, cv_url, status: 'pending',
    });
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id/applications — candidatures d'une offre
router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplications.findAll({
      where: { job_id: req.params.id },
      include: [{ model: db.Users, as: 'applicant', attributes: ['id', 'username', 'avatar', 'email'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/applications/me?user_id=X — mes candidatures
router.get('/applications/me', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;
    const applications = await JobApplications.findAll({
      where: { user_id },
      include: [{ model: Jobs, as: 'job' }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;