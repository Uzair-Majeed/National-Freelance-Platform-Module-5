/**
 * APPLICATION LAYER - GroupChatController
 */
const groupChatService = require('../services/groupchat.service');

const sendMessage = async (req, res) => {
  try {
    const { content, mediaId, replyToMsgId } = req.body;
    const userId = req.user?.userId;
    const workspaceId = req.params.workspaceId;
    
    console.log(`[Chat] Sending message: user=${userId}, workspace=${workspaceId}, content=${content}, mediaId=${mediaId}, replyToMsgId=${replyToMsgId}`);
    
    const message = await groupChatService.sendMessage(userId, workspaceId, content, mediaId, replyToMsgId);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error(`[Chat Error] Send failed:`, err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const workspaceId = req.params.workspaceId;
    
    const messages = await groupChatService.fetchMessages(workspaceId, parseInt(limit), parseInt(offset));
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.userId;
    const room = await groupChatService.ensureGroupChat(workspaceId, userId);
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.userId;
    
    await groupChatService.deleteMessage(messageId, userId);
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.userId;
    const { content } = req.body;
    
    const message = await groupChatService.editMessage(messageId, userId, content);
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, fetchMessages, getRoom, removeMessage, updateMessage };
