require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/order');
const { startVenom } = require('./venomClient');
const { sequelize } = require('./models');


const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Get Local IP (for logging purposes)
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Internal error:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start Server
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running at http://${getLocalIP()}:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');
    // Optional: await sequelize.sync();
  } catch (error) {
    console.error('❌ Unable to connect to the PostgreSQL database:', error);
  }

  // Start Venom client
  startVenom();
});
