// src/services/whatsapp/media.js
// ==========================================
// Gestion des fichiers médias WhatsApp
// ==========================================

require('')
require('')

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
 * Sauvegarde un média dans le dossier uploads/whatsapp
 * @param {Buffer} buffer 
 * @param {string} filename 
 * @returns {string} chemin complet du fichier
 */
function saveMedia(buffer, filename) {
  const uploadDir = path.join(__dirname, '../../uploads/whatsapp');

  // Crée le dossier s'il n'existe pas
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

module.exports = {
  fileExists,
  saveMedia,
  deleteMedia
};

