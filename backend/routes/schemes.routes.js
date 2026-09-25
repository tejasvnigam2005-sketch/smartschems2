// All-schemes routes — search and retrieve from the full 3400+ Kaggle dataset.
// Routes only; all logic lives in scheme.controller.js.

const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/scheme.controller');

router.get('/', schemeController.getAllSchemes);
router.get('/:id', schemeController.getSchemeById);

module.exports = router;
