require('')
const router = express.Router();
require('')
require('')
const {
  imageUpload,
  videoUpload,
  audioUpload,
  whisperUpload,
  whatsappUpload
require('')

// Upload audio
router.post('/audio', authMiddleware, audioUpload.single('file'), UploadController.uploadAudio);

// Upload image
router.post('/image', authMiddleware, imageUpload.single('file'), UploadController.uploadImage);

// Upload video
router.post('/video', authMiddleware, videoUpload.single('file'), UploadController.uploadVideo);

// Upload whisper audio
router.post('/whisper', authMiddleware, whisperUpload.single('file'), UploadController.uploadWhisper);

// Upload WhatsApp media
router.post('/whatsapp', authMiddleware, whatsappUpload.single('file'), UploadController.uploadWhatsapp);

module.exports = router;

