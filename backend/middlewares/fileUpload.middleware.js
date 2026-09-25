// Multer-based upload middleware with layered security:
// 1. Extension whitelist (jpg, jpeg, png, pdf)
// 2. Magic-byte validation (verifies file content matches claimed type)
// 3. Storage outside web root (data/uploads/profile-photos/)
// 4. UUID renaming (strips original filename)

const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// ── Config ───────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'data', 'uploads', 'profile-photos');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.pdf']);

// Magic byte signatures for content-level validation
const MAGIC_BYTES = {
  '.jpg':  { offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
  '.jpeg': { offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
  '.png':  { offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  '.pdf':  { offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
};

// ── Ensure upload directory exists ───────────
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    logger.info('FileUpload', `Created upload directory: ${UPLOAD_DIR}`);
  }
}

// ── Multer storage: UUID rename + safe directory ─
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uuid = crypto.randomUUID();
    cb(null, `${uuid}${ext}`);
  },
});

// ── Extension whitelist filter ───────────────
function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    const err = new Error(`File type not allowed. Accepted: ${[...ALLOWED_EXTENSIONS].join(', ')}`);
    err.statusCode = 400;
    return cb(err, false);
  }

  cb(null, true);
}

// ── Magic byte validator (runs after multer writes to disk) ──
function validateMagicBytes(filePath, ext) {
  const signature = MAGIC_BYTES[ext];
  if (!signature) return false;

  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(signature.bytes.length);
  fs.readSync(fd, buffer, 0, signature.bytes.length, signature.offset);
  fs.closeSync(fd);

  return signature.bytes.every((byte, i) => buffer[i] === byte);
}

// ── Assembled multer instance ────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,              // single file only
    fields: 5,             // limit non-file fields to prevent abuse
  },
});

module.exports = {
  upload,
  validateMagicBytes,
  UPLOAD_DIR,
  ALLOWED_EXTENSIONS,
};
