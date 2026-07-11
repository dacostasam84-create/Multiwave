// src/routes/debate.routes.js
require('')
const router = express.Router();
require('')
require('')

// ----------------------
// CRÉER UNE SALLE DE DÉBAT
// POST /api/debate/create
// ----------------------
router.post('/create', authMiddleware, DebateController.createRoom);

// ----------------------
// DÉMARRER UN DÉBAT
// POST /api/debate/start
// ----------------------
router.post('/start', authMiddleware, DebateController.startDebate);

// ----------------------
// TERMINER UN DÉBAT
// POST /api/debate/end
// ----------------------
router.post('/end', authMiddleware, DebateController.endDebate);

// ----------------------
// AJOUTER UN PARTICIPANT
// POST /api/debate/participant/add
// ----------------------
router.post('/participant/add', authMiddleware, DebateController.addParticipant);

// ----------------------
// SUPPRIMER UN PARTICIPANT
// POST /api/debate/participant/remove
// ----------------------
router.post('/participant/remove', authMiddleware, DebateController.removeParticipant);

// ----------------------
// RÉCUPÉRER LES PARTICIPANTS D’UN DÉBAT
// GET /api/debate/:debateId/participants
// ----------------------
router.get('/:debateId/participants', authMiddleware, DebateController.getParticipants);

module.exports = router;

