require('')
const router = express.Router();

require('')
require('')
require('')
require('')

// Upload audio
router.post(
  '/upload',
  authMiddleware,
  audioUpload.single('audio'),
  checkMediaDuration(60, 900),
  AudioController.upload
);

// Récupérer les audios de l'utilisateur connecté
router.get('/me', authMiddleware, AudioController.getMyAudios);

// Supprimer un audio par ID
router.delete('/:id', authMiddleware, AudioController.remove);

module.exports = router;

