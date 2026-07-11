// src/controllers/AiLog.controller.js
const AiLogService = require('../services/AiLog.service');

exports.summarize = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Utiliser le service correct
    const result = await AiLogService.summarizeText(text);

    // Enregistrer le log
    await AiLogService.log({
      userId: req.user?.id || null,
      action: 'summary',      // ✅ 'action' et pas 'type'
      input: text,
      output: result
    });

    res.json({ summary: result });
  } catch (err) {
    next(err);
  }
};

exports.moderate = async (req, res, next) => {
  try {
    const { text } = req.body;

    const result = await AiLogService.moderateText(text);

    await AiLogService.log({
      userId: req.user?.id || null,
      action: 'moderation',   // ✅ 'action' et pas 'type'
      input: text,
      output: JSON.stringify(result)
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

