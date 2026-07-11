'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ProductsController = require('../controllers/products.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

router.get('/', ProductsController.getAllProducts);
router.get('/featured', ProductsController.getFeatured);
router.get('/seller/:sellerId', ProductsController.getSellerProducts);
router.get('/:id', ProductsController.getProductById);
router.post('/', authMiddleware, upload.single('image'), ProductsController.createProduct);
router.put('/:id', authMiddleware, upload.single('image'), ProductsController.updateProduct);
router.delete('/:id', authMiddleware, ProductsController.deleteProduct);

module.exports = router;