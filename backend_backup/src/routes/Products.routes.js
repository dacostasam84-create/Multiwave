require('')
const router = express.Router();
require('')
require('')
require('')
require('')
require('')

// Uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', authMiddleware, upload.single('image'), ProductsController.createProduct);
router.get('/', ProductsController.getAllProducts);
router.get('/seller/:sellerId', ProductsController.getSellerProducts);
router.get('/:productId', ProductsController.getProductById);
router.put('/:productId', authMiddleware, upload.single('image'), ProductsController.updateProduct);
router.delete('/:productId', authMiddleware, ProductsController.deleteProduct);

module.exports = router;

