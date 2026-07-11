'use strict';

const fs = require('fs');
const path = require('path');

// Services
const WhatsappService = require('./services/Whatsapp');
const WhispersService = require('./services/whisper/stt'); // STT
const TtsService = require('./services/whisper/tts');       // TTS
const WebRTCService = require('./services/webrtc.service');
const PythonService = require('./services/python.service');  // <-- notre service Python

// -------------------------
// Fichiers de test
// -------------------------
const TEST_IMAGE = path.join(__dirname, 'testfiles', 'testimage.png');
const TEST_AUDIO = path.join(__dirname, 'testfiles', 'testfile.mp3');
const TEST_TEXT  = "Bonjour, ceci est un test";

// -------------------------
// Helper pour vérifier fichiers
// -------------------------
function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier de test introuvable : ${filePath}`);
  }
}

// ==========================
// Tests WhatsApp
// ==========================
async function testWhatsapp() {
  console.log('--- Début des tests WhatsApp ---');

  checkFile(TEST_AUDIO);
  const audioBuffer = fs.readFileSync(TEST_AUDIO);
  const audioFile = { originalname: path.basename(TEST_AUDIO), buffer: audioBuffer };
  const uploadResult = await WhatsappService.uploadMedia(1, '1234567890', audioFile, 'audio');
  console.log('✅ Upload Media Success:', uploadResult);

  checkFile(TEST_IMAGE);
  const imageBuffer = fs.readFileSync(TEST_IMAGE);
  const imageFile = { originalname: path.basename(TEST_IMAGE), buffer: imageBuffer };
  const cameraResult = await WhatsappService.uploadMedia(1, '1234567890', imageFile, 'camera');
  console.log('✅ Capture Camera Success:', cameraResult);

  const call = await WhatsappService.startCall(1, [2,3]);
  console.log('✅ Start Call Success:', call);

  const endCall = await WhatsappService.endCall(call.callId);
  console.log('✅ End Call Success:', endCall);

  console.log('--- Fin des tests WhatsApp ---\n');
}

// ==========================
// Tests Whispers (STT / TTS)
// ==========================
async function testWhispers() {
  console.log('--- Début des tests Whispers ---');

  checkFile(TEST_AUDIO);
  const sttBuffer = fs.readFileSync(TEST_AUDIO);
  const sttText = await WhispersService.recognize(sttBuffer);
  console.log('✅ STT Success:', sttText);

  const ttsBuffer = await TtsService.synthesize(TEST_TEXT);
  console.log('✅ TTS Success: Buffer length =', ttsBuffer.length);

  console.log('--- Fin des tests Whispers ---\n');
}

// ==========================
// Tests WebRTC
// ==========================
async function testWebRTC() {
  console.log('--- Début des tests WebRTC ---');

  const call = await WebRTCService.startCall(1, [2,3]);
  console.log('✅ WebRTC Start Call Success:', call);

  const endCall = await WebRTCService.endCall(call.callId);
  console.log('✅ WebRTC End Call Success:', endCall);

  console.log('--- Fin des tests WebRTC ---\n');
}

// ==========================
// Tests PythonService (Traduction / Audio / Vidéo)
// ==========================
async function testPythonService() {
  console.log('--- Début des tests PythonService ---');

  const translation = await PythonService.traduire(null, TEST_TEXT, 'en');
  console.log('✅ Traduction Success:', translation);

  const audioTest = await PythonService.audioTest();
  console.log('✅ Audio Test Success:', audioTest);

  const videoTest = await PythonService.videoTest();
  console.log('✅ Video Test Success:', videoTest);

  console.log('--- Fin des tests PythonService ---\n');
}

// ==========================
// Lancer tous les tests
// ==========================
(async () => {
  try {
    await testWhatsapp();
    await testWhispers();
    await testWebRTC();
    await testPythonService();
    console.log('🎉 Tous les tests réussis !');
  } catch (err) {
    console.error('❌ Erreur lors des tests :', err.message);
  }
})();