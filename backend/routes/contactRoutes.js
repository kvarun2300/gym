const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  contactController.submitContactMessage
);

router.get('/', protect, authorize(ROLES.ADMIN), contactController.getContactMessages);
router.put('/:id/resolve', protect, authorize(ROLES.ADMIN), contactController.resolveContactMessage);

module.exports = router;
