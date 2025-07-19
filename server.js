require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const userRoutes = require('./routes/userRoutes');
const { startVenom } = require('./venomClient');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

// Local IP detection
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

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running at http://${getLocalIP()}:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }

  startVenom();
});
