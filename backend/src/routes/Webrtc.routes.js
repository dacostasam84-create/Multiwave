'use strict';

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const WebrtcController = require("../controllers/webrtc.controller");

router.post('/start', authMiddleware, WebrtcController.startSession);
router.post('/end', authMiddleware, WebrtcController.endSession);
router.get('/status/:sessionId', authMiddleware, WebrtcController.getStatus);

module.exports = router;