require('')
const router = express.Router();
require('')
require('')

// Récupérer le solde d’un utilisateur
router.get('/:userId', authMiddleware, WalletsController.getBalance);

// Mettre à jour le solde (add / withdraw)
router.post('/update', authMiddleware, WalletsController.updateBalance);

module.exports = router;

