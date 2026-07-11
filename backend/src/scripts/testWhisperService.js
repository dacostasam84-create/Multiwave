const fs = require("fs");                                   
const path = require("path");                               
const WhisperService = require("../services/Whisper.service");

async function test() {
  try {
    // 1️⃣ Test STT : convertir audio en texte
    const testAudioPath = path.join(__dirname, '../uploads/whisper/test_audio.mp3');

    // créer un fichier simulé si inexistant
    if (!fs.existsSync(testAudioPath)) fs.writeFileSync(testAudioPath, '');

    const transcription = await WhisperService.transcribe(testAudioPath);
    console.log('✅ Transcription STT :', transcription);

    // 2️⃣ Test TTS : convertir texte en audio
    const textToSpeak = "Bonjour, ceci est un test TTS !";
    const audioResult = await WhisperService.speak(textToSpeak);
    console.log('✅ TTS généré :', audioResult);

    // 3️⃣ Test base de données : créer un Whisper
    const whisperData = {
      user_id: 1, // à adapter
      content: transcription,
      created_at: new Date()
    };
    const newWhisper = await WhisperService.createWhisper(whisperData);
    console.log('✅ Whisper créé en DB :', newWhisper);

    // 4️⃣ Test récupération
    const fetchedWhisper = await WhisperService.getWhisperById(newWhisper.id);
    console.log('✅ Whisper récupéré :', fetchedWhisper);

  } catch (err) {
    console.error('❌ Erreur dans testWhisperService :', err);
  }
}

test();

