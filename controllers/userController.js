const { User } = require('../models');
const jwt  = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

// Create user
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
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update(req.body);
  res.json(user);
};

// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  res.json({ message: 'User deleted' });
};

// ✅ Get user by phone (updated)
exports.getUserByPhone = async (req, res) => {
  const { phone } = req.query;

  console.log('📥 Incoming query:', req.query);
  console.log('📞 Received phone:', phone);

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const user = await User.findOne({
      where: { phone },
      attributes: ['id', 'userid', 'name', 'email', 'phone', 'userrole']
    });

    console.log('🔍 Fetched user:', user);

    if (!user) {
      // ✅ Send "exists: false" instead of error
      return res.status(200).json({ exists: false });
    }
        const token = jwt.sign({ id: user.userid },'your_secret_key', { expiresIn: '1h' });

    // ✅ Send in frontend-friendly format
    return res.status(200).json({ exists: true, user ,token }); 
  } catch (err) {
    console.error('❌ Error fetching user by phone:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
