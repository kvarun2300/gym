const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { ROLES } = require('../config/constants');

router.use(protect);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/my-history', attendanceController.getMyAttendanceHistory);

router.post('/manual', authorize(ROLES.ADMIN, ROLES.TRAINER), attendanceController.markAttendanceManually);
router.get('/', authorize(ROLES.ADMIN, ROLES.TRAINER), attendanceController.getAttendance);

module.exports = router;
