require('')
const router = express.Router();

require('')
require('')
require('')

// ----------------------
// UPLOAD VIDÉO
// POST /api/videos/upload
// ----------------------
router.post(
  '/upload',
  authMiddleware,
  videoUpload.single('video'), // champ "video" dans form-data
  checkMediaDuration(60, 5400), // durée min 1min, max 90min (en secondes)
  VideoController.upload
);

// ----------------------
// SUPPRIMER UNE VIDÉO
// DELETE /api/videos/:id
// ----------------------
router.delete('/:id', authMiddleware, VideoController.remove);

// ----------------------
// RÉCUPÉRER TOUTES LES VIDÉOS
// GET /api/videos
// ----------------------
router.get('/', VideoController.getAll);

// ----------------------
// RÉCUPÉRER UNE VIDÉO PAR ID
// GET /api/videos/:id
// ----------------------
router.get('/:id', VideoController.getById);

module.exports = router;

