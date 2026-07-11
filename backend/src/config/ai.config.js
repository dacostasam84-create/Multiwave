/**
 * CONFIGURATION AI
 * - Centralise les paramètres et clés pour l'IA
 * - Compatible OpenAI / GPT / Whisper / Modération
 */

const AI_CONFIG = {
  // Clé API principale pour l'IA
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // Modèles utilisés
  MODELS: {
    SUMMARY: process.env.AI_MODEL_SUMMARY || 'gpt-4',
    MODERATION: process.env.AI_MODEL_MODERATION || 'text-moderation-latest',
    TTS: process.env.AI_MODEL_TTS || 'gpt-tts',
    STT: process.env.AI_MODEL_STT || 'whisper-1'
  },

  // Paramètres par défaut
  DEFAULTS: {
    TEMPERATURE: parseFloat(process.env.AI_DEFAULT_TEMPERATURE) || 0.7,
    MAX_TOKENS: parseInt(process.env.AI_DEFAULT_MAX_TOKENS) || 1000,
    LANGUAGE: process.env.AI_DEFAULT_LANGUAGE || 'fr'
  },

  // Logs IA
  LOGS: {
    ENABLED: process.env.AI_LOGS_ENABLED === 'true',
    LEVEL: process.env.AI_LOGS_LEVEL || 'info' // info / warn / error
  },

  // Scoring utilisateur
  SCORING: {
    ENABLED: process.env.AI_SCORING_ENABLED === 'true',
    FACTORS: ['engagement', 'quality', 'respect', 'contribution']
  }
};

module.exports = AI_CONFIG;
