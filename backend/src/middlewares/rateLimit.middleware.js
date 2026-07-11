/**
 * Rate Limiter simple en mémoire
 * ⚠️ En prod → Redis conseillé
 */

const rateStore = new Map();

/**
 * @param {Object} options
 * @param {number} options.windowMs - fenêtre de temps en ms
 * @param {number} options.max - nombre max de requêtes
 */
function rateLimit({ windowMs = 60_000, max = 100 } = {}) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!rateStore.has(key)) {
      rateStore.set(key, { count: 1, start: now });
      return next();
    }

    const data = rateStore.get(key);

    // reset fenêtre
    if (now - data.start > windowMs) {
      rateStore.set(key, { count: 1, start: now });
      return next();
    }

    // dépassement
    if (data.count >= max) {
      return res.status(429).json({
        error: "Trop de requêtes, veuillez réessayer plus tard"
      });
    }

    data.count++;
    next();
  };
}

module.exports = rateLimit;

