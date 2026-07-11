// src/routes/subscriptions.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../models');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Plans disponibles
const PLANS = {
  free:              { name:'Gratuit',              price:0,   calls_per_day:5,   marketplace:'none',          stt_minutes:5   },
  calls_30:          { name:'Standard Calls',       price:30,  calls_per_day:30,  marketplace:'none',          stt_minutes:30  },
  calls_60:          { name:'Pro Calls',            price:49,  calls_per_day:60,  marketplace:'none',          stt_minutes:null},
  calls_vip:         { name:'VIP Calls',            price:150, calls_per_day:null,marketplace:'none',          stt_minutes:null},
  market_local:      { name:'Marketplace Local',    price:19,  calls_per_day:5,   marketplace:'local',         stt_minutes:5   },
  market_intl:       { name:'Marketplace Intl',     price:49,  calls_per_day:5,   marketplace:'international', stt_minutes:5   },
  market_business:   { name:'Marketplace Business', price:99,  calls_per_day:5,   marketplace:'business',      stt_minutes:5   },
  market_vip:        { name:'Marketplace VIP',      price:150, calls_per_day:5,   marketplace:'unlimited',     stt_minutes:5   },
  combo_standard:    { name:'Combo Standard',       price:39,  calls_per_day:30,  marketplace:'local',         stt_minutes:30  },
  combo_pro:         { name:'Combo Pro',            price:78,  calls_per_day:60,  marketplace:'international', stt_minutes:null},
  combo_vip:         { name:'Combo VIP',            price:240, calls_per_day:null,marketplace:'unlimited',     stt_minutes:null},
};

// ─────────────────────────────────────────────
// GET /api/subscriptions/current
// ─────────────────────────────────────────────
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;

    // Chercher dans UserState
    const state = await db.UserState.findOne({
      where: { user_id },
      attributes: ['user_id', 'state', 'last_active'],
    });

    // Chercher abonnement dans UserEvent
    const subEvent = await db.UserEvent.findOne({
      where: { user_id, event_type: 'subscription' },
      order: [['created_at', 'DESC']],
    });

    const plan = subEvent?.event_data?.plan || 'free';
    const planData = PLANS[plan] || PLANS.free;

    res.json({
      success: true,
      data: {
        plan,
        ...planData,
        renewal_date: subEvent
          ? new Date(new Date(subEvent.created_at).getTime() + 30*24*60*60*1000).toISOString()
          : null,
      }
    });
  } catch (err) {
    res.json({ success: true, data: { plan: 'free', ...PLANS.free } });
  }
});

// ─────────────────────────────────────────────
// POST /api/subscriptions/subscribe
// ─────────────────────────────────────────────
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { user_id, plan } = req.body;

    if (!user_id || !plan) {
      return res.status(400).json({ error: 'user_id et plan requis' });
    }

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Plan invalide' });
    }

    const planData = PLANS[plan];

    // Enregistrer l'abonnement
    await db.UserEvent.create({
      user_id,
      event_type: 'subscription',
      event_data: {
        plan,
        price:        planData.price,
        name:         planData.name,
        activated_at: new Date().toISOString(),
        expires_at:   new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      },
    });

    // Mettre à jour le rôle si Business/VIP
    if (['market_business', 'market_vip', 'combo_vip', 'calls_vip'].includes(plan)) {
      await db.Users.update({ role: 'business' }, { where: { id: user_id } });
    }

    // Notification
    try {
      await db.Notifications.create({
        user_id,
        type:    'subscription',
        title:   `✅ Abonnement ${planData.name} activé !`,
        message: `Votre abonnement ${planData.name} est maintenant actif.`,
        is_read: false,
      });
    } catch {}

    res.json({
      success: true,
      message: `Abonnement ${planData.name} activé !`,
      data: { plan, ...planData }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/subscriptions/usage
// ─────────────────────────────────────────────
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;

    // Appels aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const callsToday = await db.Calls.count({
      where: {
        caller_id:  user_id,
        created_at: { [db.Sequelize.Op.gte]: today },
      }
    });

    // Abonnement actuel
    const subEvent = await db.UserEvent.findOne({
      where: { user_id, event_type: 'subscription' },
      order: [['created_at', 'DESC']],
    });

    const plan = subEvent?.event_data?.plan || 'free';
    const planData = PLANS[plan] || PLANS.free;

    // Jours restants
    const expiresAt  = subEvent?.event_data?.expires_at;
    const daysRemaining = expiresAt
      ? Math.max(0, Math.ceil((new Date(expiresAt) - Date.now()) / (1000*60*60*24)))
      : 0;

    res.json({
      success: true,
      data: {
        plan,
        calls_today:      callsToday,
        calls_limit_day:  planData.calls_per_day,
        stt_used:         0,
        stt_limit:        planData.stt_minutes,
        marketplace_plan: planData.marketplace,
        days_remaining:   daysRemaining,
        renewal_date:     expiresAt,
      }
    });
  } catch (err) {
    res.json({
      success: true,
      data: {
        plan: 'free',
        calls_today: 0,
        calls_limit_day: 5,
        stt_used: 0,
        stt_limit: 5,
        days_remaining: 0,
      }
    });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/subscriptions/cancel
// ─────────────────────────────────────────────
router.delete('/cancel', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.body;
    await db.UserEvent.destroy({
      where: { user_id, event_type: 'subscription' }
    });
    res.json({ success: true, message: 'Abonnement annulé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;