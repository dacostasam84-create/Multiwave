require('')
const router = express.Router();
require('')
require('')

// Créer une salle d'appel
router.post("/rooms", authMiddleware, CallsController.createRoom);

// Envoyer un signal WebRTC
router.post("/rooms/:roomId/signal", authMiddleware, CallsController.sendSignal);

// Terminer un appel
router.post("/rooms/:roomId/end", authMiddleware, CallsController.endCall);

// Récupérer les participants d'une salle
router.get("/rooms/:roomId/participants", authMiddleware, CallsController.getParticipants);

module.exports = router;

