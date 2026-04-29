/**
 * APPLICATION LAYER - GroupChatController (GroupChatCoordinator)
 */
const groupChatService = require('../services/groupchat.service');

const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await groupChatService.sendMessage(req.user?.userId, req.params.workspaceId, content);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const messages = await groupChatService.fetchMessages(req.params.workspaceId, parseInt(limit), parseInt(offset));
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, fetchMessages };
