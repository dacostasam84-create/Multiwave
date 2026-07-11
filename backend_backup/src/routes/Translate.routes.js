require('')
const router = express.Router();
require('')
require('')
require('')

// Upload audio
const storage = multer.memoryStorage();
const audioUpload = multer({ storage });

router.post('/text', authMiddleware, TranslateController.translateText);
router.post('/speech-to-text', authMiddleware, audioUpload.single('audio'), TranslateController.speechToText);

module.exports = router;

