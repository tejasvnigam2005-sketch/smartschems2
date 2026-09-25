// Upload controller — handles profile photo upload and retrieval.
// Relies on fileUpload middleware for extension whitelist, UUID rename, and storage.
// Adds magic-byte validation as a second layer after the file hits disk.

const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const { sendSuccess, sendBadRequest, sendNotFound } = require('../utils/responseHelper');
const { validateMagicBytes, UPLOAD_DIR } = require('../middlewares/fileUpload.middleware');

// ── Strict UUID-filename pattern to prevent path traversal ──
const SAFE_FILENAME_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|pdf)$/i;

// MIME map for Content-Type header on retrieval
const EXT_TO_MIME = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.pdf':  'application/pdf',
};

/**
 * POST /api/upload/profile-photo
 * Accepts a single file (field name: "photo").
 * Returns the UUID filename on success.
 */
async function uploadProfilePhoto(req, res, next) {
  try {
    if (!req.file) {
      return sendBadRequest(res, 'No file provided. Send a file with field name "photo".');
    }

    const ext = path.extname(req.file.filename).toLowerCase();
    const filePath = path.join(UPLOAD_DIR, req.file.filename);

    // ── Magic byte validation (second layer) ──
    if (!validateMagicBytes(filePath, ext)) {
      // Delete the suspicious file immediately
      fs.unlinkSync(filePath);
      logger.warn('Upload', 'Magic byte mismatch — file deleted', {
        originalName: req.file.originalname,
        claimedExt: ext,
        userId: req.user?.id,
      });
      return sendBadRequest(res, 'File content does not match its extension. Upload rejected.');
    }

    logger.info('Upload', 'Profile photo uploaded', {
      filename: req.file.filename,
      size: req.file.size,
      userId: req.user?.id,
    });

    return sendSuccess(res, {
      filename: req.file.filename,
      size: req.file.size,
    }, 'Profile photo uploaded successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/upload/profile-photo/:filename
 * Serves a previously uploaded file. Requires authentication.
 * Validates filename format before constructing the path to prevent traversal.
 */
async function getProfilePhoto(req, res, next) {
  try {
    const { filename } = req.params;

    // ── Path traversal guard: only accept UUID.ext filenames ──
    if (!SAFE_FILENAME_RE.test(filename)) {
      return sendBadRequest(res, 'Invalid filename format.');
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return sendNotFound(res, 'File not found.');
    }

    const ext = path.extname(filename).toLowerCase();
    const contentType = EXT_TO_MIME[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=86400'); // 24h, private
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadProfilePhoto, getProfilePhoto };
