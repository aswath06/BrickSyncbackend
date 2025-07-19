const express = require('express');
const cors = require('cors');
const os = require('os');
const userRoutes = require('./routes/userRoutes');
const { startVenom } = require('./venomClient');
const sequelize = require('./config/db'); // Sequelize connection (optional but good to test)

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Mount user routes
app.use('/api/users', userRoutes);

// Local IP for logging
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

// Start server
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running at http://${getLocalIP()}:${PORT}`);

  try {
    // Optional: check DB connection before starting Venom
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }

  // Initialize WhatsApp bot
  startVenom();
});
