require('')
require('')
require('')

class TranslateService {
  // Traduction texte
  static async translateText(text, targetLang) {
    if (!text || !targetLang) throw new Error('Texte et langue cible requis');

    // Placeholder → remplacer par vraie API (Google, DeepL, OpenAI)
    const translated = `[${targetLang}] ${text}`;
    return translated;
  }

  // Traduction audio (STT + traduction)
  static async translateAudio(audioFilePath, targetLang) {
    if (!audioFilePath || !targetLang) throw new Error('Audio et langue cible requis');

    // Simulation STT
    const simulatedText = `Texte simulé depuis ${path.basename(audioFilePath)}`;

    // Traduction texte simulée
    const translated = await TranslateService.translateText(simulatedText, targetLang);

    // Sauvegarde en DB
    await db.Translation.create({
      user_id: 1, // tu peux remplacer par req.user.id depuis le controller
      source_text: simulatedText,
      translated_text: translated,
      source_lang: 'auto',
      target_lang: targetLang,
      audio_path: audioFilePath
    });

    return translated;
  }

  // Récupérer toutes les traductions
  static async getAll(userId = null) {
    const where = userId ? { user_id: userId } : {};
    return await db.Translation.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username'] }]
    });
  }
}

module.exports = TranslateService;

