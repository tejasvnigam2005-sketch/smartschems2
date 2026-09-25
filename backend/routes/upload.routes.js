// Upload routes — profile photo upload and retrieval.
// Both endpoints require authentication.
// POST uses multer middleware for secure file handling.

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/fileUpload.middleware');
const uploadController = require('../controllers/upload.controller');

// POST /api/upload/profile-photo — upload a single photo (field name: "photo")
router.post(
  '/profile-photo',
  authMiddleware,
  upload.single('photo'),
  uploadController.uploadProfilePhoto
);

// GET /api/upload/profile-photo/:filename — retrieve an uploaded photo
router.get(
  '/profile-photo/:filename',
  authMiddleware,
  uploadController.getProfilePhoto
);

module.exports = router;
