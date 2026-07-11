require('')
const router = express.Router();
require('')
require('')
require('')
require('')
require('')

const whisperUploadPath = path.join(__dirname, '../../uploads/whispers');
if (!fs.existsSync(whisperUploadPath)) fs.mkdirSync(whisperUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, whisperUploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('audio_file'), WhisperController.createWhisper);
router.get('/user/:userId', authMiddleware, WhisperController.getWhispersByUser);
router.delete('/:whisperId', authMiddleware, WhisperController.deleteWhisper);

module.exports = router;

