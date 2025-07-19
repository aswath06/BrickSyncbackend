const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { startVenom } = require('./venomClient');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

db.authenticate()
  .then(() => {
    console.log('✅ Database connected.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    startVenom(); // ← Start WhatsApp client once DB is up
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
  });
