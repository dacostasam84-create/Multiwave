require('')
const router = express.Router();
require('')
require('')

// Définir / mettre à jour l’état de l’utilisateur connecté
router.post('/', authMiddleware, UserStateController.setState);

// Récupérer l’état de l’utilisateur connecté
router.get('/', authMiddleware, UserStateController.getState);

// Supprimer l’état de l’utilisateur connecté
router.delete('/', authMiddleware, UserStateController.deleteState);

module.exports = router;

