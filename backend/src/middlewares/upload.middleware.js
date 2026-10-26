// src/middlewares/upload.middleware.js
'use strict';

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dossiers pour les uploads.
// Sur Vercel, seul /tmp est adapté aux écritures temporaires.
const uploadBase = process.env.VERCEL
  ? "/tmp/multiwave/uploads"
  : path.join(__dirname, "../../uploads");

const uploads = {
  images: path.join(uploadBase, "images"),
  videos: path.join(uploadBase, "videos"),
  audios: path.join(uploadBase, "audios"),
  whispers: path.join(uploadBase, "whisper"),
  whatsapp: {
    root: path.join(uploadBase, "whatsapp/root"),
    camera: path.join(uploadBase, "whatsapp/camera")
  }
};

// Création automatique des dossiers si inexistants
function createDirs(obj) {
  Object.values(obj).forEach(dir => {
    if (typeof dir === "string") {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } else createDirs(dir);
  });
}
createDirs(uploads);

// Nom de fichier unique
function generateFilename(file) {
  const safeName = file.originalname.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
}

// Storage Multer générique
function createStorage(dest) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => cb(null, generateFilename(file))
  });
}

// File filter générique
function createFileFilter(allowedExtensions) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();
    const allowed = new RegExp(allowedExtensions.join("|"));
    cb(null, allowed.test(ext) && allowed.test(mime) ? true : new Error("Format de fichier non autorisé"));
  };
}

// Multer objects
const imageUpload = multer({
  storage: createStorage(uploads.images),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: createFileFilter(["jpeg","jpg","png","webp"])
});

const videoUpload = multer({
  storage: createStorage(uploads.videos),
  limits: { fileSize: 800 * 1024 * 1024 },
  fileFilter: createFileFilter(["mp4","mov","avi","mkv","webm"])
});

const audioUpload = multer({
  storage: createStorage(uploads.audios),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: createFileFilter(["mp3","wav","ogg","aac","webm"])
});

const whisperUpload = multer({
  storage: createStorage(uploads.whispers),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: createFileFilter(["mp3","wav","ogg","aac","webm"])
});

const whatsappUpload = multer({
  storage: createStorage(uploads.whatsapp.root),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: createFileFilter(["jpeg","jpg","png","mp4","mov","mp3","wav"])
});

const whatsappCameraUpload = multer({
  storage: createStorage(uploads.whatsapp.camera),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: createFileFilter(["jpeg","jpg","png","mp4","mov"])
});

// Export
module.exports = {
  uploads,
  imageUpload,
  videoUpload,
  audioUpload,
  whisperUpload,
  whatsappUpload,
  whatsappCameraUpload
};
