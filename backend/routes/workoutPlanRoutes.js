const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const workoutPlanController = require('../controllers/workoutPlanController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/my-plans', authorize(ROLES.MEMBER), workoutPlanController.getMyWorkoutPlans);

router.use(authorize(ROLES.ADMIN, ROLES.TRAINER));

router.post(
  '/',
  [
    body('memberId').isInt().withMessage('memberId is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
  ],
  validate,
  workoutPlanController.createWorkoutPlan
);
router.get('/', workoutPlanController.getWorkoutPlans);
router.put('/:id', workoutPlanController.updateWorkoutPlan);
router.delete('/:id', workoutPlanController.deleteWorkoutPlan);

module.exports = router;
