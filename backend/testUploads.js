// testUploads.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const BASE_URL = "http://localhost:3000/api/uploads"; // adapte le port si nécessaire
const TOKEN = "TON_TOKEN_UTILISATEUR"; // remplace par un token valide pour authMiddleware

async function uploadFile(type, filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const res = await axios.post(`${BASE_URL}/${type}`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${TOKEN}`
      }
    });
    console.log(`[OK] ${type} uploadé :`, res.data.data.filename);
  } catch (err) {
    console.error(`[ERREUR] ${type} :`, err.response?.data || err.message);
  }
}

async function runTests() {
  await uploadFile("audio", "./testFiles/sample.mp3");
  await uploadFile("image", "./testFiles/sample.jpg");
  await uploadFile("video", "./testFiles/sample.mp4");
  await uploadFile("whisper", "./testFiles/sample.wav");
  await uploadFile("whatsapp", "./testFiles/sample.jpg"); // teste avec image WhatsApp
}

runTests();
