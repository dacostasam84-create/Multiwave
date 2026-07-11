'use strict';

const fs = require('fs');
const path = require('path');
const WhatsappService = require('./services/Whatsapp'); // service principal

// ==========================
// Chemins des fichiers de test
// ==========================
const TEST_IMAGE = path.join(__dirname, 'testfiles', 'testimage.png');
const TEST_MEDIA = path.join(__dirname, 'testfiles', 'testfile.mp3');

// ==========================
// Vérifier si les fichiers existent
// ==========================
function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier de test introuvable : ${filePath}`);
  }
}

// ==========================
// Test uploadMedia
// ==========================
async function testUploadMedia() {
  try {
    checkFile(TEST_MEDIA);

    const fileBuffer = fs.readFileSync(TEST_MEDIA);
    const file = {
      originalname: path.basename(TEST_MEDIA), // nom du fichier
      buffer: fileBuffer                        // contenu en buffer
    };

    const result = await WhatsappService.uploadMedia(
      1,               // senderId de test
      '1234567890',    // receiverNumber de test
      file,
      'audio'          // type de média
    );

    console.log('✅ Upload Media Success:', result);
  } catch (err) {
    console.error('❌ Upload Media Error:', err.message);
  }
}

// ==========================
// Test captureCamera
// ==========================
async function testCaptureCamera() {
  try {
    checkFile(TEST_IMAGE);

    // ✅ IMPORTANT : format identique à uploadMedia
    const imageBuffer = fs.readFileSync(TEST_IMAGE);
    const file = {
      originalname: path.basename(TEST_IMAGE), // "testimage.png"
      buffer: imageBuffer                       // contenu en buffer
    };

    // On utilise le même service uploadMedia mais avec type 'camera'
    const result = await WhatsappService.uploadMedia(
      1,               // senderId
      '1234567890',    // receiverNumber
      file,
      'camera'         // type caméra
    );

    console.log('✅ Capture Camera Success:', result);
  } catch (err) {
    console.error('❌ Capture Camera Error:', err.message);
  }
}

// ==========================
// Lancer tous les tests
// ==========================
(async () => {
  console.log('--- Début des tests WhatsApp ---');
  await testUploadMedia();
  await testCaptureCamera();
  console.log('--- Fin des tests WhatsApp ---');
})();