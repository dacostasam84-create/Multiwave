// backend/src/routes/webrtc.routes.js

require('')
const router = express.Router();
require('')

// Exemple d'endpoints WebRTC
router.post('/start', WebrtcController.startSession);  // Démarrer une session WebRTC
router.post('/end', WebrtcController.endSession);      // Terminer une session WebRTC
router.get('/status/:sessionId', WebrtcController.getStatus); // Vérifier le statut d'une session

module.exports = router;

