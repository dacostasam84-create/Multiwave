require('')
const router = express.Router();
require('')
require('')

// CRÉER UNE MARQUE
router.post('/', authMiddleware, BrandController.createBrand);

// RÉCUPÉRER TOUTES LES MARQUES
router.get('/', BrandController.getAllBrands);

// RÉCUPÉRER MARQUE PAR ID
router.get('/:id', BrandController.getBrandById);

// METTRE À JOUR UNE MARQUE
router.put('/:id', authMiddleware, BrandController.updateBrand);

// DÉSACTIVER UNE MARQUE
router.delete('/:id', authMiddleware, BrandController.disableBrand);

module.exports = router;

