require('')
const router = express.Router();
require('')
require('')

// envoyer message
router.post('/', auth, ctrl.sendMessage);

// récupérer conversation
router.get('/conversation/:userId', auth, ctrl.getConversation);

// supprimer message (soft delete)
router.delete('/:id', auth, ctrl.removeMessage);

module.exports = router;

