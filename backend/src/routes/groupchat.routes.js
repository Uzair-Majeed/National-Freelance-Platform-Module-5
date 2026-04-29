const express = require('express');
const router = express.Router();
const groupChatController = require('../controllers/groupchat.controller');

// Dummy routes for future Communication Module integration
router.post('/workspace/:workspaceId', groupChatController.sendMessage);
router.get('/workspace/:workspaceId', groupChatController.fetchMessages);

module.exports = router;
