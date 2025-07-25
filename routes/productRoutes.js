const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateJWT, productController.createProduct);
router.put('/:id', authenticateJWT, productController.updateProduct);
router.delete('/:id', authenticateJWT, productController.deleteProduct);

module.exports = router;
