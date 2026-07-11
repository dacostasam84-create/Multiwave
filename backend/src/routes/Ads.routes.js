// src/routes/Ads.routes.js
const express = require("express");
const router = express.Router();

// Contrôleur Ads
const AdsController = require("../controllers/Ads.controller");

// Middlewares nécessaires
const authMiddleware = require("../middlewares/auth.middleware"); // authentification
const uploadMiddleware = require("../middlewares/upload.middleware"); // si besoin pour fichiers

// =========================
// PUBLIC ROUTES
// =========================

// Récupérer les publicités d'une marque
router.get('/brand/:brand_id', AdsController.getBrandAds);

// Récupérer toutes les publicités
router.get('/', AdsController.getAds);

// =========================
// PROTECTED ROUTES
// =========================

// Créer une publicité
router.post('/', authMiddleware, AdsController.createAd);

// Mettre à jour une publicité
router.put('/:id', authMiddleware, AdsController.updateAd);

// Supprimer une publicité
router.delete('/:id', authMiddleware, AdsController.deleteAd);

module.exports = router;
