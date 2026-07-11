'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Vérifie si un fichier existe
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error('Erreur fileExists:', err);
    return false;
  }
}

/**
 * Sauvegarde un média dans uploads/whatsapp
 * @param {Buffer} buffer
 * @param {string} filename
 * @returns {string} chemin complet du fichier
 */
function saveMedia(buffer, filename) {
  const uploadDir = path.join(__dirname, '../../uploads/whatsapp');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Supprime un fichier média
 * @param {string} filePath
 */
function deleteMedia(filePath) {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Envoie un média WhatsApp (fonction principale)
 * @param {number} senderId
 * @param {string} receiverNumber
 * @param {Object} file - req.file de multer
 * @param {string} type - type de média
 * @returns {Object} message simulé
 */
async function sendMessage(senderId, receiverNumber, file, type) {
  if (!file || !senderId || !receiverNumber) {
    throw new Error('Données manquantes pour envoyer le média');
  }

  const filename = `${type}_${Date.now()}_${file.originalname}`;
  const filePath = saveMedia(file.buffer, filename);

  // Retour simulé
  return {
    senderId,
    receiverNumber,
    type,
    filename,
    path: `/uploads/whatsapp/${filename}`,
    timestamp: Date.now()
  };
}

module.exports = {
  fileExists,
  saveMedia,
  deleteMedia,
  sendMessage
};