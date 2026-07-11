require('')
const router = express.Router();

require('')
require('')

// ==============================
//          CHANNELS
// ==============================

// Créer un channel
router.post('/', authMiddleware, ChannelsController.createChannel);

// Lister tous les channels
router.get('/', ChannelsController.listChannels);

// Modifier un channel
router.put('/:id', authMiddleware, ChannelsController.updateChannel);

// Supprimer un channel
router.delete('/:id', authMiddleware, ChannelsController.deleteChannel);

// Rejoindre un channel
router.post('/:id/join', authMiddleware, ChannelsController.joinChannel);

// Quitter un channel
router.post('/:id/leave', authMiddleware, ChannelsController.leaveChannel);

module.exports = router;

