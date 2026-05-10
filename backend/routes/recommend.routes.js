// Recommend routes — recommendation and eligibility endpoints.
// Routes only; all logic lives in recommend.controller.js.

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const recommendController = require('../controllers/recommend.controller');

router.post('/', authMiddleware, recommendController.recommend);
router.post('/eligibility', authMiddleware, recommendController.checkEligibility);

module.exports = router;
