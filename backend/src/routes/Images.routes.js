const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const ImagesController = require('../controllers/images.controller');
router.post('/upload', authMiddleware, ImagesController.upload);
router.get('/user/:userId', authMiddleware, ImagesController.getByUser);
router.delete('/:filename', authMiddleware, ImagesController.remove);
module.exports = router;
