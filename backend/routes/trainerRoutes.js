const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { uploadTrainerImage } = require('../middleware/upload');
const { ROLES } = require('../config/constants');

// Public: list & view trainers (for landing page "Our Trainers" section)
router.get('/', trainerController.getTrainers);
router.get('/:id', trainerController.getTrainerById);

router.use(protect);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  uploadTrainerImage.single('profileImage'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  trainerController.createTrainer
);

router.put(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.TRAINER),
  uploadTrainerImage.single('profileImage'),
  trainerController.updateTrainer
);
router.delete('/:id', authorize(ROLES.ADMIN), trainerController.deleteTrainer);

module.exports = router;
