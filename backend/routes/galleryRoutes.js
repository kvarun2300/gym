const express = require('express');
const router = express.Router();

const galleryController = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { uploadGalleryImage } = require('../middleware/upload');
const { ROLES } = require('../config/constants');

router.get('/', galleryController.getGallery);

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', uploadGalleryImage.single('image'), galleryController.uploadGalleryItem);
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
