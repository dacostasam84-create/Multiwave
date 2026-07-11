const fs = require("fs");                           // lecture fichiers audio

/**
 * Speech-to-Text (STT) simulé
 * @param {string} filePath - chemin du fichier audio
 * @returns {Promise<string>} transcription
 */
async function speechToText(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("Fichier audio introuvable pour STT");
  }

  // Placeholder pour moteur STT réel (Whisper / OpenAI)
  return `Transcription simulée de ${filePath}`;
}

module.exports = { speechToText };

