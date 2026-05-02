// Scheme guide routes — document checklists and application step guides.
// Routes only; all logic lives in schemeGuide.controller.js.

const express = require('express');
const router = express.Router();
const schemeGuideController = require('../controllers/schemeGuide.controller');

router.get('/documents/:schemeType/:id', schemeGuideController.getDocumentChecklist);
router.get('/steps/:schemeType/:id', schemeGuideController.getApplicationSteps);

module.exports = router;
