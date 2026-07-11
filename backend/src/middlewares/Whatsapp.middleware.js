'use strict';

const multer = require('multer');

// Stockage en mémoire pour Multer (buffer)
const storage = multer.memoryStorage();

// Middleware pour upload d’un seul fichier média
const whatsappUpload = multer({ storage }).single('file');

// Middleware pour capture caméra (toujours un seul fichier)
const whatsappCameraUpload = multer({ storage }).single('file');

module.exports = {
  whatsappUpload,
  whatsappCameraUpload
};