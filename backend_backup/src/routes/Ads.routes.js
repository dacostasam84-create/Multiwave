// src/routes/Ads.routes.js
require('')
const router = express.Router();

require('')
require('')

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

