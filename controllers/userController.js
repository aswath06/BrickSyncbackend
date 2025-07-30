const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get user by Sequelize primary key (id)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get user by phone
exports.getUserByPhone = async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const user = await User.findOne({
      where: { phone },
      attributes: ['id', 'userid', 'name', 'email', 'phone', 'userrole', 'balance', 'advance', 'dateOfBirth', 'gender']
    });

    if (!user) return res.status(200).json({ exists: false });

    const token = jwt.sign({ id: user.userid }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ exists: true, user, token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by custom userid
exports.getUserByUserId = async (req, res) => {
  const { userid } = req.params;
  if (!userid) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findOne({
      where: { userid },
      attributes: ['id', 'userid', 'name', 'email', 'phone', 'userrole', 'balance', 'advance', 'dateOfBirth', 'gender', 'statements']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Add a new payment statement
exports.addStatement = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, modeOfPayment, typeOfPayment, orderId } = req.body;

    const user = await User.findOne({ where: { userid: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Safely parse existing statements array
    const existingStatements = Array.isArray(user.statements) ? user.statements : [];

    const newStatement = {
      date: new Date().toISOString(),
      amount,
      modeOfPayment,
    };

   if (modeOfPayment === 'Received') {
  user.balance = parseFloat(user.balance || 0) - parseFloat(amount); // ✅ Decrease balance
} else if (modeOfPayment === 'Order') {
  user.balance = parseFloat(user.balance || 0) + parseFloat(amount); // ✅ Increase balance
}


    const updatedStatements = [...existingStatements, newStatement];

    await user.update({
      statements: updatedStatements,
      balance: user.balance,
    });

    res.status(200).json({
      message: 'Statement added successfully',
      statements: updatedStatements,
      balance: user.balance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};



// Get all statements of a user
exports.getUserStatements = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ where: { userid: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      statements: user.statements || [],
      balance: user.balance || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
