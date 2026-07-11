// src/routes/followers.routes.js
require('')
const router = express.Router();
require('')
require('')

// FOLLOW
router.post('/follow', authMiddleware, FollowersCtrl.followUser);

// UNFOLLOW
router.post('/unfollow', authMiddleware, FollowersCtrl.unfollowUser);

// FOLLOWING (doit être AVANT /:userId)
router.get('/following/:userId', authMiddleware, FollowersCtrl.getFollowing);

// FOLLOWERS
router.get('/:userId', authMiddleware, FollowersCtrl.getFollowers);

module.exports = router;

