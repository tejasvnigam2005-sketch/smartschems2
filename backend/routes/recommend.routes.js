// Recommend routes — recommendation and eligibility endpoints.
// Routes only; all logic lives in recommend.controller.js.

const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommend.controller');

router.post('/', recommendController.recommend);
router.post('/eligibility', recommendController.checkEligibility);

module.exports = router;
