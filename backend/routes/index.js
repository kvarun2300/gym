const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/members', require('./memberRoutes'));
router.use('/trainers', require('./trainerRoutes'));
router.use('/plans', require('./planRoutes'));
router.use('/subscriptions', require('./subscriptionRoutes'));
router.use('/attendance', require('./attendanceRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/invoices', require('./invoiceRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/gallery', require('./galleryRoutes'));
router.use('/contact', require('./contactRoutes'));
router.use('/workout-plans', require('./workoutPlanRoutes'));
router.use('/diet-plans', require('./dietPlanRoutes'));
router.use('/progress', require('./progressRoutes'));

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Xtreme Fitness API is healthy', timestamp: new Date().toISOString() });
});

module.exports = router;
