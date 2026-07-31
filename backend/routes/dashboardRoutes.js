const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/admin', authorize(ROLES.ADMIN), dashboardController.getAdminDashboard);
router.get('/trainer', authorize(ROLES.TRAINER), dashboardController.getTrainerDashboard);
router.get('/member', authorize(ROLES.MEMBER), dashboardController.getMemberDashboard);

module.exports = router;
