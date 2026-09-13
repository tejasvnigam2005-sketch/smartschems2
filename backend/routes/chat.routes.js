// Chat routes — AI chatbot endpoint.
// Routes only; all logic lives in chat.controller.js.

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.post('/', chatController.chat);

module.exports = router;
