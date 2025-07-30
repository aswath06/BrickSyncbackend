const sequelize = require('./path/to/your/sequelize'); // Adjust path if needed

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the PostgreSQL database:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
