const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const planController = require('../controllers/planController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

// Public - landing page membership pricing section
router.get('/', planController.getPlans);
router.get('/:id', planController.getPlanById);

router.use(protect);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('durationDays').isInt({ min: 1 }).withMessage('Duration must be a positive number of days'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  planController.createPlan
);

router.put('/:id', authorize(ROLES.ADMIN), planController.updatePlan);
router.delete('/:id', authorize(ROLES.ADMIN), planController.deletePlan);

module.exports = router;
