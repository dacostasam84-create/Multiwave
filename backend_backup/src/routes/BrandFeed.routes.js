const express = require("express");
const router = express.Router();

const router = express.Router();                               // ligne 4
const BrandFeedController = require("../controllers/brandfeed.controller"); // ligne 5


// Flux des marques (utilisateur connecté)
router.get('/', authMiddleware, BrandFeedController.getFeed);

// Ajouter une publication brand feed
router.post('/', authMiddleware, BrandFeedController.createFeed);

// Supprimer une publication
router.delete('/:id', authMiddleware, BrandFeedController.deleteFeed);

module.exports = router;

