// src/routes/AiLog.routes.js
require('')
require('')
require('')

// Toutes les routes AI nécessitent authentification
router.post('/summarize', authMiddleware, AiLogController.summarize);
router.post('/moderate', authMiddleware, AiLogController.moderate);

module.exports = router;

