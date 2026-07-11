require('')
const router = express.Router();
require('')
require('')

// mettre à jour le status d’un message
router.post('/update', auth, StatusCtrl.updateStatus);

// récupérer les statuses d’un message
router.get('/message/:messageId', auth, StatusCtrl.getStatusesForMessage);

// récupérer les statuses de l’utilisateur connecté
router.get('/me', auth, StatusCtrl.getMyStatuses);

module.exports = router;

