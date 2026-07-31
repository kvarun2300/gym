/**
 * Production-safe migration runner.
 * Usage: npm run db:migrate
 *
 * Unlike sequelize.sync({ alter: true }) (used only in development in server.js),
 * this script force-verifies the connection then creates tables if they don't
 * already exist, without altering/dropping existing production data.
 */
require('dotenv').config();
const { sequelize } = require('../config/database');
require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await sequelize.sync({ alter: false }); // creates missing tables only
    console.log('✅ Migration complete. All tables verified/created.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
})();
