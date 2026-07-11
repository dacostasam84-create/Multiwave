// src/routes/userEvent.routes.js
require('')
const router = express.Router();
require('')
require('')

// Ajouter un événement
router.post('/', authMiddleware, UserEventController.addEvent);

// Récupérer les événements de l’utilisateur connecté
router.get('/', authMiddleware, UserEventController.getEvents);

// Supprimer un événement
router.delete('/:eventId', authMiddleware, UserEventController.deleteEvent);

module.exports = router;

