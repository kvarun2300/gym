const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const makeStorage = (subfolder) => {
  const dest = path.join(__dirname, '..', 'uploads', subfolder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${subfolder}-${uuidv4()}${ext}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
};

const buildUploader = (subfolder, maxSizeMb = 5) =>
  multer({
    storage: makeStorage(subfolder),
    fileFilter,
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
  });

const uploadProfileImage = buildUploader('profiles', 5);
const uploadTrainerImage = buildUploader('trainers', 5);
const uploadGalleryImage = buildUploader('gallery', 8);
const uploadBlogImage = buildUploader('blog', 5);
const uploadProgressPhoto = buildUploader('progress', 5);

module.exports = {
  uploadProfileImage,
  uploadTrainerImage,
  uploadGalleryImage,
  uploadBlogImage,
  uploadProgressPhoto,
};
