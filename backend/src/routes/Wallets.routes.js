// src/routes/wallet.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const db = require('../models');
const Wallets = db.Wallets;
const Orders  = db.Orders;
const { Op }  = require('sequelize');

// GET /api/wallet?user_id=X — mon wallet
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.query;
    let wallet = await Wallets.findOne({ where: { user_id } });
    // Créer le wallet si inexistant
    if (!wallet) {
      wallet = await Wallets.create({ user_id, balance: 0, currency: 'USD', is_active: true });
    }
    res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/wallet/transactions?user_id=X — historique
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { user_id, limit = 50 } = req.query;
    // Utilise les Orders comme historique de transactions
    const orders = await Orders.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      include: [{ model: db.Products, as: 'product', attributes: ['id', 'name', 'image_url', 'currency'] }],
    });

    // Formater en transactions
    const transactions = orders.map(o => ({
      id:             o.id,
      type:           o.payment_status === 'refunded' ? 'refund' : 'payment',
      amount:         o.total_price,
      currency:       o.product?.currency || 'USD',
      description:    o.product?.name || `Commande #${o.id}`,
      status:         o.payment_status === 'paid' ? 'completed' : 'pending',
      payment_method: o.payment_method,
      created_at:     o.created_at,
      product:        o.product,
    }));

    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wallet/deposit — dépôt
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { user_id, amount, currency = 'USD', method, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montant invalide' });

    const wallet = await Wallets.findOne({ where: { user_id } });
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    if (!wallet.is_active) return res.status(403).json({ error: 'Wallet inactif' });

    // Convertir si devise différente (simplifié)
    const depositAmount = parseFloat(amount);
    await wallet.increment('balance', { by: depositAmount });
    await wallet.reload();

    res.json({
      success: true,
      message: `Dépôt de ${depositAmount} ${currency} effectué`,
      data: { balance: wallet.balance, currency: wallet.currency }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wallet/withdraw — retrait
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { user_id, amount, currency = 'USD', method, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montant invalide' });

    const wallet = await Wallets.findOne({ where: { user_id } });
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    if (!wallet.is_active) return res.status(403).json({ error: 'Wallet inactif' });

    const withdrawAmount = parseFloat(amount);
    if (parseFloat(wallet.balance) < withdrawAmount) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    await wallet.decrement('balance', { by: withdrawAmount });
    await wallet.reload();

    res.json({
      success: true,
      message: `Retrait de ${withdrawAmount} ${currency} effectué`,
      data: { balance: wallet.balance, currency: wallet.currency }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wallet/transfer — transfert vers un autre utilisateur
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { user_id, to_username, amount, currency = 'USD', note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montant invalide' });
    if (!to_username) return res.status(400).json({ error: 'Destinataire requis' });

    // Trouver le destinataire
    const recipient = await db.Users.findOne({ where: { username: to_username } });
    if (!recipient) return res.status(404).json({ error: 'Utilisateur introuvable' });
    if (recipient.id === parseInt(user_id)) return res.status(400).json({ error: 'Impossible de se transférer à soi-même' });

    // Vérifier wallet émetteur
    const senderWallet = await Wallets.findOne({ where: { user_id } });
    if (!senderWallet || !senderWallet.is_active) return res.status(404).json({ error: 'Wallet émetteur non trouvé' });

    const transferAmount = parseFloat(amount);
    if (parseFloat(senderWallet.balance) < transferAmount) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    // Wallet destinataire (créer si inexistant)
    let recipientWallet = await Wallets.findOne({ where: { user_id: recipient.id } });
    if (!recipientWallet) {
      recipientWallet = await Wallets.create({ user_id: recipient.id, balance: 0, currency: 'USD', is_active: true });
    }

    // Transaction atomique
    await db.sequelize.transaction(async (t) => {
      await senderWallet.decrement('balance',    { by: transferAmount, transaction: t });
      await recipientWallet.increment('balance', { by: transferAmount, transaction: t });
    });

    await senderWallet.reload();

    res.json({
      success: true,
      message: `Transfert de ${transferAmount} ${currency} vers @${to_username} effectué`,
      data: { balance: senderWallet.balance, currency: senderWallet.currency }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/wallet/toggle — activer/désactiver
router.patch('/toggle', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.body;
    const wallet = await Wallets.findOne({ where: { user_id } });
    if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });
    await wallet.update({ is_active: !wallet.is_active });
    res.json({ success: true, data: { is_active: wallet.is_active } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;