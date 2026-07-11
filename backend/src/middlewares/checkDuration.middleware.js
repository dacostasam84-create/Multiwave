// src/middlewares/checkDuration.middleware.js
const CallsService = require("../services/Calls.service");
const CallParticipantService = require("../services/CallParticipant.service");


module.exports = (min = 60, max = 900) => {
  return (req, res, next) => {
    if (!req.file) return next();

    ffmpeg.ffprobe(req.file.path, (err, metadata) => {
      if (err) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: "Erreur analyse média" });
      }

      const duration = metadata.format.duration;

      if (duration < min || duration > max) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: `Durée invalide (${Math.round(duration)}s). Autorisé: ${min}-${max}s`
        });
      }

      next();
    });
  };
};

