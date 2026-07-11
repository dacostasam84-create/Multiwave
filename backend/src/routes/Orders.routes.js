// src/routes/orders.routes.js

const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/orders.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

/**
 * @route   POST /api/orders
 * @desc    Créer une commande
 * @access  Privé
 */
router.post("/", authMiddleware, OrdersController.createOrder);

/**
 * @route   GET /api/orders/me
 * @desc    Récupérer les commandes de l'utilisateur connecté
 * @access  Privé
 */
router.get("/me", authMiddleware, OrdersController.getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Récupérer une commande par ID
 * @access  Privé
 */
router.get("/:id", authMiddleware, OrdersController.getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Mettre à jour le statut d'une commande
 * @access  Privé
 */
router.put("/:id", authMiddleware, OrdersController.updateOrder);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Supprimer une commande
 * @access  Privé
 */
router.delete("/:id", authMiddleware, OrdersController.deleteOrder);

module.exports = router;
