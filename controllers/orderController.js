const { Order, Vehicle, User } = require('../models');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, vehicleNumber, userId, products, image } = req.body;

    // Determine status based on image
    const status = image ? 'developed' : 'assign';

    const order = await Order.create({
      orderId,
      vehicleNumber,
      userId,
      products,
      status,
      image,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get orders by userId
exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: Vehicle },
        { model: User, attributes: ['name', 'email', 'userid'] },
      ],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
// Update order vehicle number (assign truck)
exports.updateVehicleNumber = async (req, res) => {
  const { orderId } = req.params;
  const { vehicleNumber } = req.body;

  try {
    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.vehicleNumber = vehicleNumber;
    order.status = 'assigned';
    await order.save();

    res.json({ message: 'Vehicle assigned successfully', order });
  } catch (err) {
    console.error('❌ Error updating vehicleNumber:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Vehicle },
        { model: User, attributes: ['name', 'email', 'userid'] },
      ],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
