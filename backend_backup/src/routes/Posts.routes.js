// src/routes/Posts.routes.js
require('')
const router = express.Router();

require('')
require('')

// Import direct de imageUpload (pas de destructuration)
require('')

// -------------------------------
// Routes POST
// -------------------------------

// Créer un post (avec image)
router.post(
  '/',
  authMiddleware,
  imageUpload.single('image'), // Multer middleware pour upload d'image
  PostsController.createPost
);

// -------------------------------
// Routes GET
// -------------------------------

// Récupérer tous les posts
router.get('/', PostsController.getAllPosts);

// Récupérer un post par ID
router.get('/:id', PostsController.getPostById);

// -------------------------------
// Routes PUT
// -------------------------------

// Mettre à jour un post (avec image optionnelle)
router.put(
  '/:id',
  authMiddleware,
  imageUpload.single('image'),
  PostsController.updatePost
);

// -------------------------------
// Routes DELETE
// -------------------------------

// Supprimer un post
router.delete(
  '/:id',
  authMiddleware,
  PostsController.deletePost
);

// -------------------------------
// Export du router
// -------------------------------
module.exports = router;

