const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/my-history', authorize(ROLES.MEMBER), paymentController.getMyPayments);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  [
    body('memberId').isInt().withMessage('memberId is required'),
    body('amount').isFloat({ min: 0 }).withMessage('amount must be a positive number'),
    body('method').isIn(['cash', 'card', 'upi', 'net_banking']).withMessage('Invalid payment method'),
  ],
  validate,
  paymentController.createPayment
);

router.get('/', authorize(ROLES.ADMIN), paymentController.getPayments);

module.exports = router;
