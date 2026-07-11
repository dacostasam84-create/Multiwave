'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ChannelsController = require('../controllers/channels.controller');

router.post('/', authMiddleware, ChannelsController.createChannel);
router.get('/', ChannelsController.listChannels);
router.put('/:id', authMiddleware, ChannelsController.updateChannel);
router.delete('/:id', authMiddleware, ChannelsController.deleteChannel);
router.post('/:id/join', authMiddleware, ChannelsController.joinChannel);
router.post('/:id/leave', authMiddleware, ChannelsController.leaveChannel);

module.exports = router;