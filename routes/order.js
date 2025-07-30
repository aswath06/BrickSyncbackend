const express = require('express');
const multer = require('multer');
const router = express.Router();
const orderController = require('../controllers/orderController');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.get('/vehicle/:vehicleNumber', orderController.getOrdersByVehicleNumber);
router.put('/:orderId/assign', orderController.updateVehicleNumber);
router.put('/:orderId/status', orderController.updateOrderStatus);
router.put('/:orderId/deliver', orderController.markOrderAsDelivered);



module.exports = router;
