'use strict';
const express = require('express');
const router = express.Router();
const LikesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, LikesController.react);
router.delete('/', authMiddleware, LikesController.unlike);
router.get('/', LikesController.getLikes);
router.get('/counts', LikesController.getReactionCounts);

module.exports = router;