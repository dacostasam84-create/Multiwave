// require('')

// FOLLOW
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id; // ✅ depuis auth
    const { followingId } = req.body;

    const relation = await FollowersService.follow(followerId, followingId);

    if (!relation) {
      return res.status(409).json({ error: 'Utilisateur déjà suivi' });
    }

    res.status(201).json({ message: 'Utilisateur suivi avec succès' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UNFOLLOW
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await FollowersService.unfollow(followerId, followingId);
    res.json({ message: 'Désabonnement réussi' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET FOLLOWERS
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await FollowersService.getFollowers(userId);
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET FOLLOWING
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await FollowersService.getFollowing(userId);
    res.json(following);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

