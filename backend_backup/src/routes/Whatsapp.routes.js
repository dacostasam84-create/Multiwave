require('')
const router = express.Router();
require('')
require('')
const {
  whatsappUpload,
  whatsappCameraUpload
require('')

// Upload média WhatsApp
router.post(
  "/upload/media",
  authMiddleware,
  whatsappUpload.single("file"),
  WhatsAppController.uploadMedia
);

// Capture caméra
router.post(
  "/camera",
  authMiddleware,
  whatsappCameraUpload.single("file"),
  WhatsAppController.captureCamera
);

// Appels
router.post("/call/start", authMiddleware, WhatsAppController.startCall);
router.post("/call/end", authMiddleware, WhatsAppController.endCall);

module.exports = router;

