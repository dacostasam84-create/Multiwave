// src/middlewares/ephemeral.middleware.js
// Middleware pour gérer les messages éphémères (suppression automatique après délai)
module.exports = (durationSeconds = 60) => {
  return async (req, res, next) => {
    if (req.body.ephemeral && req.body.ephemeral === true) {
      req.ephemeralExpiresAt = new Date(Date.now() + durationSeconds * 1000);
    }
    next();
  };
};

