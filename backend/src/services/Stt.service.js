'use strict';
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");
const STT = require('../models/STT.model');
const User = require('../models/Users.model');

const PYTHON_API_URL = "http://127.0.0.1:5000";

class STTService {
  static async create({ userId, audioFile, targetLang = "fr" }) {
    if (!audioFile) throw new Error('Fichier audio requis');

    const audioFileName = `${Date.now()}-${audioFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(__dirname, '../../uploads/stt');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, audioFileName);
    fs.writeFileSync(filePath, audioFile.buffer);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), audioFile.originalname);

    const response = await axios.post(
      `${PYTHON_API_URL}/stt/transcribe?target_lang=${targetLang}`,
      form,
      { headers: form.getHeaders() }
    );

    const { original, detected_language, translated } = response.data;

    const stt = await STT.create({
      user_id: userId,
      text: original,
      translated_text: translated,
      language: detected_language,
      target_language: targetLang,
      audio_path: `/uploads/stt/${audioFileName}`
    });

    return stt;
  }

  static async getAll(userId = null) {
    const where = userId ? { user_id: userId } : {};
    return await STT.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
    });
  }
}

module.exports = STTService;