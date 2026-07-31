require('dotenv').config();
const app = require('./app');
const { sequelize, connectDB } = require('./config/database');
require('./models'); // ensures all models + associations are registered

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // In production, use proper migrations (database/migrate.js) instead of sync.
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Xtreme Fitness API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await sequelize.close();
  process.exit(0);
});
