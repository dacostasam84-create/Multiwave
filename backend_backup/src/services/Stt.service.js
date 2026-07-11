require('')
require('')
require('')

class STTService {
  // Créer une transcription depuis un fichier audio
  static async create({ userId, audioFile }) {
    if (!audioFile) throw new Error('Fichier audio requis');

    const audioFileName = `${Date.now()}-${audioFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(__dirname, '../../uploads/stt');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, audioFileName);
    fs.writeFileSync(filePath, audioFile.buffer);

    // Simulation STT (remplacer par API réelle si nécessaire)
    const transcriptionText = `Transcription simulée depuis ${audioFile.originalname}`;

    const stt = await db.STT.create({
      user_id: userId,
      text: transcriptionText,
      language: 'fr',
      audio_path: `/uploads/stt/${audioFileName}`
    });

    return stt;
  }

  // Récupérer toutes les transcriptions
  static async getAll(userId = null) {
    const where = userId ? { user_id: userId } : {};
    return await db.STT.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }]
    });
  }
}

module.exports = STTService;

