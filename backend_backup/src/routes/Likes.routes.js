require('')
const router = express.Router();
require('')
require('')

// LIKE
router.post('/like', authMiddleware, LikesController.likePost);

// UNLIKE
router.post('/unlike', authMiddleware, LikesController.unlikePost);

// COUNT LIKES
router.get('/count/:postId', LikesController.countLikes);

// USERS WHO LIKED
router.get('/users/:postId', LikesController.usersWhoLiked);

module.exports = router;

