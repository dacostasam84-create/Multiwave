const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const WhisperController = require('../controllers/whisper.controller');
router.post('/', authMiddleware, WhisperController.createWhisper);
router.get('/user/:userId', authMiddleware, WhisperController.getWhispersByUser);
router.delete('/:whisperId', authMiddleware, WhisperController.deleteWhisper);
module.exports = router;
