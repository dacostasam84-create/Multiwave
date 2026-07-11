require('')
const router = express.Router();
require('')
require('')
require('')

// ----------------------
// UPLOAD STT
// ----------------------
const storage = multer.memoryStorage(); // buffer en mémoire pour service
const upload = multer({ storage });

// ----------------------
// ROUTES STT
// ----------------------
router.post('/', authMiddleware, upload.single('audio'), STTController.create);
router.get('/', authMiddleware, STTController.getAll);

module.exports = router;

