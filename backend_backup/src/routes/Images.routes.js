require('')
const router = express.Router();

require('')
require('')
require('')

// 📌 Upload image
router.post(
  '/upload',
  authMiddleware,
  upload.single('image'),
  ImagesController.uploadImage
);

// 📌 Récupérer toutes les images d’un utilisateur
router.get(
  '/user/:userId',
  authMiddleware,
  ImagesController.getUserImages
);

// 📌 Supprimer une image
router.delete(
  '/:imageId',
  authMiddleware,
  ImagesController.deleteImage
);

module.exports = router;

