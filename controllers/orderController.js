const { Order, Vehicle, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bucket = require('../firebase'); // Make sure this path is correct

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, vehicleNumber, userId, products } = req.body;
    const image = req.file ? req.file.buffer.toString('base64') : null;

    const status = image ? 'delivered' : 'assign';

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products list is empty or invalid' });
    }

    const totalAmount = products.reduce((acc, item) => {
      const rawPrice = typeof item.price === 'string'
        ? item.price.replace(/[^0-9.]/g, '')
        : item.price;
      const price = parseFloat(rawPrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return acc + (price * quantity);
    }, 0);

    if (totalAmount === 0) {
      return res.status(400).json({ message: 'Total amount is zero. Check product price and quantity.' });
    }

    const order = await Order.create({
      orderId,
      vehicleNumber,
      userId,
      products,
      status,
      image,
    });

    const user = await User.findOne({ where: { userid: userId } });

    if (user) {
      const currentBalance = parseFloat(user.balance) || 0;
      const newBalance = currentBalance + totalAmount;

      const newStatement = {
        modeOfPayment: 'Order',
        amount: totalAmount,
        date: new Date().toISOString(),
        orderId,
      };

      const existingStatements = Array.isArray(user.statements) ? user.statements : [];
      user.statements = [...existingStatements, newStatement];
      user.balance = newBalance;

      await user.save();
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('❌ Order error:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get orders by userId
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: Vehicle },
        { model: User, attributes: ['name', 'email', 'userid', 'phone'] },
      ],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Vehicle },
        { model: User, attributes: ['name', 'email', 'userid', 'phone'] },
      ],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get orders by vehicle number
exports.getOrdersByVehicleNumber = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const orders = await Order.findAll({
      where: { vehicleNumber },
      include: [
        { model: Vehicle },
        { model: User, attributes: ['name', 'email', 'userid', 'phone'] },
      ],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Assign vehicle
exports.updateVehicleNumber = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { vehicleNumber } = req.body;

    const order = await Order.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.vehicleNumber = vehicleNumber;
    order.status = 'assigned';
    await order.save();

    res.json({ message: 'Vehicle assigned successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update vehicle number' });
  }
};

// Update status only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Mark order as delivered with file
// Real controller method to handle delivered status and save Cloudinary URL
exports.markOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const order = await Order.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.image = imageUrl;
    order.status = 'delivered';
    await order.save();

    return res.json({ message: 'Order marked as delivered', order });
  } catch (err) {
    console.error('❌ Failed to mark as delivered:', err);
    return res.status(500).json({ message: 'Failed to mark as delivered' });
  }
};



