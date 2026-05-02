/**
 * BUSINESS LOGIC LAYER - GroupChatService
 */
const groupChatRepository = require('../repositories/groupchat.repository');
const workspaceRepository = require('../repositories/workspace.repository');

const ensureGroupChat = async (workspaceId, userId) => {
  let room = await groupChatRepository.findRoomByWorkspace(workspaceId);
  
  if (!room) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) throw new Error('Workspace not found');
    
    room = await groupChatRepository.createRoom({
      workspace_id: workspaceId,
      room_name: `${workspace.name} Internal Comms`,
      created_by: userId
    });
  }
  
  return room;
};

const fetchMessages = async (workspaceId, limit = 50, offset = 0) => {
  // Use a default user ID for auto-creation if needed, though in practice 
  // the room should exist once someone opens the chat.
  const room = await ensureGroupChat(workspaceId, null); 
  return groupChatRepository.getMessagesByRoom(room.id, limit, offset);
};

const sendMessage = async (userId, workspaceId, content, mediaId = null, replyToMsgId = null) => {
  if (!content && !mediaId) throw new Error('Message content or media is required');
  
  const room = await ensureGroupChat(workspaceId, userId);
  return groupChatRepository.saveMessage({
    room_id: room.id,
    sender_id: userId,
    content,
    message_type: mediaId ? 'media' : 'text',
    media_id: mediaId,
    reply_to_msg_id: replyToMsgId
  });
};

const deleteMessage = async (messageId, userId) => {
  const message = await groupChatRepository.findById(messageId);
  if (!message) throw new Error('Message not found');
  if (String(message.sender_id) !== String(userId)) {
    throw new Error('Unauthorized to delete this message');
  }
  
  return groupChatRepository.deleteMessage(messageId);
};

const editMessage = async (messageId, userId, content) => {
  const message = await groupChatRepository.findById(messageId);
  if (!message) throw new Error('Message not found');
  if (String(message.sender_id) !== String(userId)) {
    throw new Error('Unauthorized to edit this message');
  }
  if (message.message_type !== 'text') {
    throw new Error('Only text messages can be edited');
  }
  
  return groupChatRepository.updateMessage(messageId, content);
};

module.exports = {
  ensureGroupChat,
  fetchMessages,
  sendMessage,
  deleteMessage,
  editMessage
};
