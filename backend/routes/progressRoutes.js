const express = require('express');
const router = express.Router();

const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { ROLES } = require('../config/constants');

router.use(protect);

router.post('/', progressController.addProgressEntry);
router.get('/my-history', authorize(ROLES.MEMBER), progressController.getMyProgressHistory);
router.get('/:memberId', authorize(ROLES.ADMIN, ROLES.TRAINER), progressController.getMemberProgressHistory);

module.exports = router;
