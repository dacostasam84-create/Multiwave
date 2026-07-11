require('')
const router = express.Router();
require('')
require('')

// CREATE GROUP
router.post('/', authMiddleware, GroupsController.createGroup);

// GET ALL GROUPS
router.get('/', GroupsController.getAllGroups);

// GET ONE GROUP
router.get('/:id', GroupsController.getGroupById);

// UPDATE GROUP
router.put('/:id', authMiddleware, GroupsController.updateGroup);

// DELETE GROUP
router.delete('/:id', authMiddleware, GroupsController.deleteGroup);

module.exports = router;

