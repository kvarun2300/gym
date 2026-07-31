const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

router.use(protect, authorize(ROLES.ADMIN));

router.post(
  '/',
  [
    body('memberId').isInt().withMessage('memberId is required'),
    body('planId').isInt().withMessage('planId is required'),
  ],
  validate,
  subscriptionController.createSubscription
);

router.get('/', subscriptionController.getSubscriptions);
router.put('/:id/cancel', subscriptionController.cancelSubscription);

module.exports = router;
