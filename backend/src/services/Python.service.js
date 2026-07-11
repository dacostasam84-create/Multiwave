'use strict';
const axios = require('axios'); // ⚠️ Obligatoire
const PYTHON_API_BASE = process.env.PYTHON_API_URL || 'http://localhost:5000';

class PythonService {

  // Test API Python
  static async test() {
    const res = await axios.get(`${PYTHON_API_BASE}/test`);
    return res.data;
  }

  // Traduction texte / vidéo
  static async traduire(videoName, texteSource, langueCible = 'en') {
    const res = await axios.post(`${PYTHON_API_BASE}/traduction`, {
      video_name: videoName,
      texte_source: texteSource,
      langue_cible: langueCible
    });
    return res.data;
  }

  // Audio test
  static async audioTest() {
    const res = await axios.get(`${PYTHON_API_BASE}/audio/test`);
    return res.data;
  }

  // Audio temps réel (simulé)
  static async audioRealtime(langueCible = 'en') {
    const res = await axios.post(`${PYTHON_API_BASE}/audio/realtime`, { langue_cible: langueCible });
    return res.data;
  }

  // Vidéo test
  static async videoTest() {
    const res = await axios.get(`${PYTHON_API_BASE}/video/test`);
    return res.data;
  }

  // Vidéo temps réel
  static async videoRealtime(videoPath, langueCible = 'en') {
    const res = await axios.post(`${PYTHON_API_BASE}/video/realtime`, { 
      video_path: videoPath,
      langue_cible: langueCible
    });
    return res.data;
  }
}

module.exports = PythonService;