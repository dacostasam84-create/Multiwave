'use strict';

const fs = require('fs');
const path = require('path');
const WhatsappService = require('./services/Whatsapp'); // service principal

// ==========================
// Dossier et fichiers de test
// ==========================
const TEST_DIR = path.join(__dirname, 'testfiles');
const TEST_IMAGE = path.join(TEST_DIR, 'testimage.png');
const TEST_MEDIA = path.join(TEST_DIR, 'testfile.mp3');

// ==========================
// Créer fichiers de test si absents
// ==========================
function ensureTestFiles() {
  if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR);

  if (!fs.existsSync(TEST_MEDIA)) {
    fs.writeFileSync(TEST_MEDIA, 'dummy audio content'); // fichier audio minimal
    console.log('📄 Fichier test audio créé :', TEST_MEDIA);
  }

  if (!fs.existsSync(TEST_IMAGE)) {
    fs.writeFileSync(TEST_IMAGE, 'dummy image content'); // fichier image minimal
    console.log('📄 Fichier test image créé :', TEST_IMAGE);
  }
}

// ==========================
// Vérifier fichier
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
      originalname: path.basename(TEST_MEDIA),
      buffer: fileBuffer
    };

    const result = await WhatsappService.uploadMedia(
      1,
      '1234567890',
      file,
      'audio'
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

    const imageBuffer = fs.readFileSync(TEST_IMAGE);
    const file = {
      originalname: path.basename(TEST_IMAGE),
      buffer: imageBuffer
    };

    const result = await WhatsappService.uploadMedia(
      1,
      '1234567890',
      file,
      'camera'
    );

    console.log('✅ Capture Camera Success:', result);
  } catch (err) {
    console.error('❌ Capture Camera Error:', err.message);
  }
}

// ==========================
// Test startCall
// ==========================
async function testStartCall() {
  try {
    const participants = [2, 3];
    const call = await WhatsappService.startCall(1, participants);
    console.log('✅ Start Call Success:', call);
    return call;
  } catch (err) {
    console.error('❌ Start Call Error:', err.message);
  }
}

// ==========================
// Test endCall
// ==========================
async function testEndCall(callId) {
  try {
    const result = await WhatsappService.endCall(callId);
    console.log('✅ End Call Success:', result);
  } catch (err) {
    console.error('❌ End Call Error:', err.message);
  }
}

// ==========================
// Lancer tous les tests
// ==========================
(async () => {
  console.log('--- Début des tests WhatsApp All-in-One ---');

  // Créer les fichiers de test si besoin
  ensureTestFiles();

  // Upload et Camera
  await testUploadMedia();
  await testCaptureCamera();

  // Appels audio/vidéo
  const call = await testStartCall();
  if (call && call.callId) {
    await testEndCall(call.callId);
  }

  console.log('--- Fin des tests WhatsApp All-in-One ---');
})();