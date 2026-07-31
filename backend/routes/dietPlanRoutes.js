const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const dietPlanController = require('../controllers/dietPlanController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/my-plans', authorize(ROLES.MEMBER), dietPlanController.getMyDietPlans);

router.use(authorize(ROLES.ADMIN, ROLES.TRAINER));

router.post(
  '/',
  [
    body('memberId').isInt().withMessage('memberId is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
  ],
  validate,
  dietPlanController.createDietPlan
);
router.get('/', dietPlanController.getDietPlans);
router.put('/:id', dietPlanController.updateDietPlan);
router.delete('/:id', dietPlanController.deleteDietPlan);

module.exports = router;
