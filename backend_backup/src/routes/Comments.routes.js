require('')
const router = express.Router();
require('')
require('')

// Créer un commentaire (auth obligatoire)
router.post('/', authMiddleware, CommentsController.createComment);

// Récupérer les commentaires d’un post
router.get('/post/:postId', CommentsController.getCommentsByPost);

// Supprimer un commentaire (auth obligatoire)
router.delete('/:id', authMiddleware, CommentsController.deleteComment);

module.exports = router;

