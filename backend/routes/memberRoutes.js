const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const memberController = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { uploadProfileImage } = require('../middleware/upload');
const { ROLES } = require('../config/constants');

router.use(protect);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  uploadProfileImage.single('profileImage'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  memberController.createMember
);

router.get('/', authorize(ROLES.ADMIN, ROLES.TRAINER), memberController.getMembers);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.TRAINER), memberController.getMemberById);
router.put('/:id', authorize(ROLES.ADMIN), uploadProfileImage.single('profileImage'), memberController.updateMember);
router.delete('/:id', authorize(ROLES.ADMIN), memberController.deleteMember);

module.exports = router;
