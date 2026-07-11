// src/routes/Users.routes.js
require('')
const router = express.Router();
require('')
require('')

router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.get('/', authMiddleware, UsersController.getAll);
router.get('/:id', authMiddleware, UsersController.getById);
router.put('/:id', authMiddleware, UsersController.update);
router.delete('/:id', authMiddleware, UsersController.delete);

module.exports = router;

