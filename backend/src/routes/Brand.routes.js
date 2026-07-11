// src/routes/Brand.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express = require('express');
const router  = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const BrandController    = require('../controllers/brand.controller');

// CRÉER UNE MARQUE
router.post('/',      authMiddleware, BrandController.createBrand);

// RÉCUPÉRER TOUTES LES MARQUES
router.get('/',       BrandController.getAllBrands);

// RÉCUPÉRER MARQUE PAR ID
router.get('/:id',    BrandController.getBrandById);

// METTRE À JOUR UNE MARQUE
router.put('/:id',    authMiddleware, BrandController.updateBrand);

// DÉSACTIVER UNE MARQUE
router.delete('/:id', authMiddleware, BrandController.disableBrand);

module.exports = router;