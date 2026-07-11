require('')
require('')

class AudioService {
  static async uploadAudio({ userId, file }) {
    if (!file) {
      const error = new Error('Aucun fichier audio reçu');
      error.status = 400;
      throw error;
    }

    const uploaded = await UploadsService.uploadAudio(file);

    return await db.Audio.create({
      user_id: userId,
      filename: uploaded.filename,
      path: uploaded.path,
      duration: uploaded.duration || null,
    });
  }

  static async getUserAudios(userId) {
    return await db.Audio.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });
  }

  static async deleteAudio({ audioId, userId }) {
    const audio = await db.Audio.findOne({
      where: { id: audioId, user_id: userId },
    });

    if (!audio) {
      const error = new Error('Audio introuvable');
      error.status = 404;
      throw error;
    }

    await UploadsService.deleteFile(audio.path);
    await audio.destroy();

    return true;
  }
}

module.exports = AudioService;

