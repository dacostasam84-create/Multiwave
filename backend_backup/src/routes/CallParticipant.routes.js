require('')
const router = express.Router();
require('')
require('')

// Ajouter un participant
router.post('/', authMiddleware, CallParticipantController.add);

// Supprimer un participant
router.delete('/:id', authMiddleware, CallParticipantController.remove);

// Lister les participants d'un appel
router.get('/:call_id', authMiddleware, CallParticipantController.listByCall);

module.exports = router;

