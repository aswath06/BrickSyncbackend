const express = require('express');
const router = express.Router();
const multer = require('multer');
const orderController = require('../controllers/orderController');

const storage = multer.memoryStorage(); // or use diskStorage if you want to save files
const upload = multer({ storage });

// Create order with image upload
// ✅ Correct
router.get('/vehicle/:vehicleNumber', orderController.getOrdersByVehicleNumber);

router.post('/', upload.single('image'), orderController.createOrder);

// Get orders by user ID
router.get('/user/:userId', orderController.getOrdersByUserId);

// Get all orders
router.get('/', orderController.getAllOrders);
// Update vehicle number for an order
router.put('/:orderId/assign', orderController.updateVehicleNumber);
router.put('/:orderId/status', orderController.updateOrderStatus);





module.exports = router;
