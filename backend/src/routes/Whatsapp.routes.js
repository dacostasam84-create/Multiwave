'use strict';

const express = require('express');
const router = express.Router();

// Contrôleur principal
const WhatsappController = require('../controllers/Whatsapp.controller');

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const { whatsappUpload, whatsappCameraUpload } = require('../middlewares/Whatsapp.middleware');

// -------------------------------
// Upload média
// -------------------------------
router.post(
  '/upload/media',
  authMiddleware,
  whatsappUpload,
  WhatsappController.uploadMedia
);

// -------------------------------
// Capture depuis caméra
// -------------------------------
router.post(
  '/camera',
  authMiddleware,
  whatsappCameraUpload,
  WhatsappController.captureCamera
);

// -------------------------------
// Appels audio/vidéo
// -------------------------------
router.post(
  '/call/start',
  authMiddleware,
  WhatsappController.startCall
);

router.post(
  '/call/end',
  authMiddleware,
  WhatsappController.endCall
);

module.exports = router;