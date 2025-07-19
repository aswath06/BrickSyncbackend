const express = require('express');
const app = express();
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api/users', userRoutes); // API base URL

sequelize.authenticate().then(() => {
  console.log("✅ Database connected.");
  app.listen(3000, () => {
    console.log("🚀 Server is running at http://localhost:3000");
  });
}).catch((err) => {
  console.error("❌ Unable to connect to database:", err);
});
