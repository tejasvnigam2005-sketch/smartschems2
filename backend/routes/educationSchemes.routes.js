// Education scheme routes — list and detail endpoints.
// Routes only; all logic lives in scheme.controller.js.

const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/scheme.controller');

router.get('/', schemeController.getEducationSchemes);
router.get('/:id', schemeController.getEducationSchemeById);

module.exports = router;
