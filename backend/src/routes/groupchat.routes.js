const express = require('express');
const router = express.Router();
const groupChatController = require('../controllers/groupchat.controller');

// GET /api/chat/workspace/:workspaceId/room - Get/Create room
router.get('/workspace/:workspaceId/room', groupChatController.getRoom);

// GET /api/chat/workspace/:workspaceId - Fetch messages
router.get('/workspace/:workspaceId', groupChatController.fetchMessages);

// POST /api/chat/workspace/:workspaceId - Send message
router.post('/workspace/:workspaceId', groupChatController.sendMessage);

// PUT /api/chat/message/:messageId - Edit message
router.put('/message/:messageId', groupChatController.updateMessage);

// DELETE /api/chat/message/:messageId - Delete message
router.delete('/message/:messageId', groupChatController.removeMessage);

module.exports = router;
