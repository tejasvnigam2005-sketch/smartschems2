// Auth routes — signup, login, profile, and preferences endpoints.
// Routes only; all logic lives in auth.controller.js.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.put('/preferences', authController.updatePreferences);

module.exports = router;
