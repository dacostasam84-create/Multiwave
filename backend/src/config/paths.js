// src/config/paths.js
// Chemins d'écriture compatibles local + Vercel (seul /tmp est inscriptible en serverless).
'use strict';

const fs = require('fs');
const path = require('path');

const IS_VERCEL = !!process.env.VERCEL;
const UPLOADS_DIR = IS_VERCEL
  ? '/tmp/multiwave/uploads'
  : path.join(__dirname, '../../uploads');

/**
 * Crée le sous-dossier demandé dans uploads et renvoie son chemin absolu.
 * @param  {...string} parts
 * @returns {string}
 */
function uploadDir(...parts) {
  const dir = path.join(UPLOADS_DIR, ...parts);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error('Impossible de créer le dossier ' + dir + ':', err.message);
  }
  return dir;
}

module.exports = { IS_VERCEL, UPLOADS_DIR, uploadDir };
