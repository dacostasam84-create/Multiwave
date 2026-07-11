// src/routes/search.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models');
const { Op }  = require('sequelize');

// GET /api/search?q=query&category=all
router.get('/', async (req, res) => {
  try {
    const { q, category = 'all' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Requête trop courte (min 2 caractères)' });
    }

    const search = `%${q.trim()}%`;
    const results = {};

    // ── USERS ──
    if (category === 'all' || category === 'users') {
      const users = await db.Users.findAll({
        where: {
          [Op.or]: [
            { username:  { [Op.like]: search } },
            { full_name: { [Op.like]: search } },
          ]
        },
        attributes: ['id', 'username', 'full_name', 'avatar', 'bio', 'location', 'is_verified', 'followers_count'],
        limit: 5,
      });
      results.users = users.map(u => ({
        id:       u.id,
        type:     'user',
        title:    u.username,
        sub:      `${u.full_name || ''} · ${u.location || ''}`.trim(),
        meta:     `👥 ${u.followers_count || 0} abonnés`,
        verified: u.is_verified,
      }));
    }

    // ── POSTS ──
    if (category === 'all' || category === 'posts') {
      const posts = await db.Posts.findAll({
        where: { content: { [Op.like]: search }, status: 'public' },
        attributes: ['id', 'content', 'likes_count', 'comments_count', 'created_at'],
        include: [{ model: db.Users, as: 'author', attributes: ['username'] }],
        limit: 5,
        order: [['created_at', 'DESC']],
      });
      results.posts = posts.map(p => ({
        id:       p.id,
        type:     'post',
        title:    p.content?.substring(0, 60) + (p.content?.length > 60 ? '...' : ''),
        sub:      `par ${p.author?.username || '?'} · il y a ${timeAgo(p.created_at)}`,
        meta:     `❤️ ${p.likes_count} · 💬 ${p.comments_count}`,
        verified: false,
      }));
    }

    // ── PRODUCTS ──
    if (category === 'all' || category === 'products') {
      const products = await db.Products.findAll({
        where: {
          [Op.or]: [
            { name:        { [Op.like]: search } },
            { description: { [Op.like]: search } },
          ],
          status: 'active',
        },
        attributes: ['id', 'name', 'price', 'currency', 'location', 'is_verified'],
        limit: 5,
        order: [['created_at', 'DESC']],
      });
      results.products = products.map(p => ({
        id:       p.id,
        type:     'product',
        title:    p.name,
        sub:      p.location || 'Multiwave',
        meta:     `${p.price} ${p.currency || 'USD'}`,
        verified: p.is_verified,
      }));
    }

    // ── GROUPS ──
    if (category === 'all' || category === 'groups') {
      const groups = await db.Groups.findAll({
        where: {
          [Op.or]: [
            { name:        { [Op.like]: search } },
            { description: { [Op.like]: search } },
          ],
          status: 'active',
        },
        attributes: ['id', 'name', 'description', 'members_count', 'visibility', 'is_verified'],
        limit: 5,
      });
      results.groups = groups.map(g => ({
        id:       g.id,
        type:     'group',
        title:    g.name,
        sub:      `👥 ${g.members_count || 0} membres · ${g.description?.substring(0, 40) || ''}`,
        meta:     `${g.visibility === 'public' ? '🌍 Public' : '🔒 Privé'}`,
        verified: g.is_verified,
      }));
    }

    // ── CHANNELS ──
    if (category === 'all' || category === 'channels') {
      const channels = await db.Channel.findAll({
        where: {
          [Op.or]: [
            { name:        { [Op.like]: search } },
            { description: { [Op.like]: search } },
          ],
        },
        attributes: ['id', 'name', 'description', 'subscribers_count', 'is_verified', 'language'],
        limit: 5,
      });
      results.channels = channels.map(c => ({
        id:       c.id,
        type:     'channel',
        title:    c.name,
        sub:      `📡 ${c.subscribers_count || 0} abonnés`,
        meta:     `🌐 ${c.language?.toUpperCase() || 'FR'}`,
        verified: c.is_verified,
      }));
    }

    // ── VIDEOS ──
    if (category === 'all' || category === 'videos') {
      const videos = await db.Videos.findAll({
        where: {
          [Op.or]: [
            { title:       { [Op.like]: search } },
            { description: { [Op.like]: search } },
          ],
          status: 'public',
        },
        attributes: ['id', 'title', 'duration', 'views_count', 'created_at'],
        include: [{ model: db.Users, as: 'author', attributes: ['username'] }],
        limit: 5,
        order: [['created_at', 'DESC']],
      });
      results.videos = videos.map(v => ({
        id:       v.id,
        type:     'video',
        title:    v.title,
        sub:      `${v.author?.username || '?'} · ${v.views_count || 0} vues`,
        meta:     `⏱ ${fmtDuration(v.duration)}`,
        verified: false,
      }));
    }

    // ── JOBS ──
    if (category === 'all' || category === 'jobs') {
      const jobs = await db.Job.findAll({
        where: {
          [Op.or]: [
            { title:   { [Op.like]: search } },
            { company: { [Op.like]: search } },
          ],
          is_active: true,
        },
        attributes: ['id', 'title', 'company', 'location', 'salary_min', 'salary_max', 'currency'],
        limit: 5,
      });
      results.jobs = jobs.map(j => ({
        id:       j.id,
        type:     'job',
        title:    j.title,
        sub:      `${j.company || ''} · ${j.location || ''}`.trim(),
        meta:     j.salary_min ? `${j.salary_min}–${j.salary_max} ${j.currency}` : 'À négocier',
        verified: false,
      }));
    }

    res.json({ success: true, data: results });

  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function timeAgo(d) {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

function fmtDuration(s) {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

module.exports = router;