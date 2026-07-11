const express = require("express"); 
const router = express.Router();
const router = express.Router();                                     // ligne 3
const CallParticipantController = require("../controllers/callparticipant.controller"); // ligne 4

// Ajouter un participant
router.post('/', authMiddleware, CallParticipantController.add);

// Supprimer un participant
router.delete('/:id', authMiddleware, CallParticipantController.remove);

// Lister les participants d'un appel
router.get('/:call_id', authMiddleware, CallParticipantController.listByCall);

module.exports = router;

