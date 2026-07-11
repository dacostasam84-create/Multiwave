// src/services/AiLog.service.js
require('')

class AiLogService {

  /**
   * Crée une entrée de log AI
   * @param {Object} params
   * @param {number|null} params.userId - ID de l'utilisateur
   * @param {string} params.action - Type d'action (summary, moderation, etc.)
   * @param {string|null} params.input - Texte ou donnée entrée
   * @param {string|null} params.output - Texte ou donnée sortie
   * @param {string|null} params.model - Modèle IA utilisé
   * @param {number|null} params.tokensUsed - Nombre de tokens utilisés
   * @param {string} params.status - Statut (success, blocked, flagged, error)
   */
  static async log({
    userId = null,
    action,
    input = null,
    output = null,
    model = null,
    tokensUsed = null,
    status = 'success'
  }) {
    return db.AiLog.create({
      user_id: userId,
      action,
      model,
      input_text: input,
      output_text: output,
      tokens_used: tokensUsed,
      status
    });
  }

  /**
   * Résumé simple d'un texte (limite 200 caractères)
   * @param {string} text
   * @returns {string}
   */
  static async summarizeText(text) {
    if (!text) return '';
    return text.length > 200 ? text.slice(0, 200) + '...' : text;
  }

  /**
   * Modération simple d'un texte (exemple basique)
   * @param {string} text
   * @returns {Object} { flagged: boolean, reason: string|null }
   */
  static async moderateText(text) {
    if (!text) return { flagged: false, reason: null };

    const bannedWords = ['spam', 'hate']; // exemple simple
    const flagged = bannedWords.some(word => text.toLowerCase().includes(word));

    return { flagged, reason: flagged ? 'banned_word_detected' : null };
  }

  /**
   * Méthode utilisée par le socket pour modérer du contenu
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.messageId
   * @param {string} params.content
   * @returns {Object} résultat modération
   */
  static async moderateContent({ userId, messageId, content }) {
    const moderation = await this.moderateText(content);

    // Log la modération
    await this.log({
      userId,
      action: 'moderation',
      input: content,
      output: JSON.stringify(moderation),
      status: moderation.flagged ? 'flagged' : 'success'
    });

    return moderation;
  }

  /**
   * Calcul de score utilisateur IA (placeholder)
   * @param {Object} params
   * @param {number} params.userId
   * @param {number} params.targetUserId
   * @returns {Object} score
   */
  static async calculateUserScore({ userId, targetUserId }) {
    // Exemple simplifié : score aléatoire
    const score = Math.floor(Math.random() * 101); // 0 à 100

    // Log le score
    await this.log({
      userId,
      action: 'score',
      output: `Score pour ${targetUserId}: ${score}`,
      status: 'success'
    });

    return { targetUserId, score };
  }
}

module.exports = AiLogService;

