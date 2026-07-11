'use strict';
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const DebateController = require('../controllers/debate.controller');

router.post('/create', authMiddleware, DebateController.createRoom);
router.post('/start', authMiddleware, DebateController.startDebate);
router.post('/end', authMiddleware, DebateController.endDebate);
router.post('/participant/add', authMiddleware, DebateController.addParticipant);
router.post('/participant/remove', authMiddleware, DebateController.removeParticipant);
router.get('/:debateId/participants', authMiddleware, DebateController.getParticipants);

module.exports = router;
