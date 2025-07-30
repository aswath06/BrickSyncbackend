const { Order, Vehicle, User } = require('../models');


// Create Order

exports.createOrder = async (req, res) => {
  try {
    const { orderId, vehicleNumber, userId, products, image } = req.body;

    // 1. Determine order status
    const status = image ? 'developed' : 'assign';

    // 2. Validate product array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products list is empty or invalid' });
    }

    console.log('🛒 Products:', products);

    // 3. Calculate totalAmount safely
    const totalAmount = products.reduce((acc, item) => {
      // Clean price (remove ₹, commas, etc.)
      const rawPrice = typeof item.price === 'string'
        ? item.price.replace(/[^0-9.]/g, '')
        : item.price;

      const price = parseFloat(rawPrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;

      console.log(`📦 item: ${item.name || 'Unnamed'}, price: ${price}, quantity: ${quantity}, subtotal: ${price * quantity}`);

      return acc + (price * quantity);
    }, 0);

    if (totalAmount === 0) {
      return res.status(400).json({ message: 'Total amount is zero. Check product price and quantity.' });
    }

    // 4. Create the order
    const order = await Order.create({
      orderId,
      vehicleNumber,
      userId,
      products,
      status,
      image,
    });

    // 5. Update user balance and statements
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
