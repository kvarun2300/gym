/**
 * Seeds the database with:
 *  - One default Admin account (credentials from .env SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
 *  - Three starter membership plans
 * Usage: npm run db:seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Plan } = require('../models');
const { ROLES } = require('../config/constants');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@xtremefitness.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

    const [admin, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Xtreme Fitness Admin',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: ROLES.ADMIN,
        isActive: true,
        isEmailVerified: true,
      },
    });

    console.log(
      created
        ? `✅ Admin account created: ${adminEmail} / ${adminPassword}`
        : `ℹ️  Admin account already exists: ${adminEmail}`
    );

    const starterPlans = [
      {
        name: 'Basic Monthly',
        description: 'Full gym floor access, locker room, and free fitness assessment.',
        durationDays: 30,
        price: 1499,
        features: ['Gym floor access', 'Locker room', 'Fitness assessment'],
        isFeatured: false,
      },
      {
        name: 'Premium Quarterly',
        description: 'Everything in Basic plus group classes and 2 PT sessions/month.',
        durationDays: 90,
        price: 3999,
        features: ['Gym floor access', 'Group classes', '2 PT sessions/month', 'Diet consultation'],
        isFeatured: true,
      },
      {
        name: 'Elite Annual',
        description: 'Unlimited personal training, nutrition planning, and priority booking.',
        durationDays: 365,
        price: 14999,
        features: ['Unlimited PT sessions', 'Custom diet plans', 'Priority booking', 'Free merchandise'],
        isFeatured: false,
      },
    ];

    for (const planData of starterPlans) {
      await Plan.findOrCreate({ where: { name: planData.name }, defaults: planData });
    }
    console.log('✅ Starter membership plans seeded.');

    console.log('🎉 Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
})();
