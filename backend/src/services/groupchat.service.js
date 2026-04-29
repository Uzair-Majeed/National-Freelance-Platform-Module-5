/**
 * BUSINESS LOGIC LAYER - GroupChatService
 * Implements IGroupChatService. 
 * Currently dummied out pending the completion of the Communication module.
 */

const sendMessage = async (userId, workspaceId, content) => {
  console.log(`[GroupChatService Dummy] Message sent by ${userId} in workspace ${workspaceId}: ${content}`);
  return { id: 'dummy-msg-id', userId, workspaceId, content, created_at: new Date() };
};

const fetchMessages = async (workspaceId, limit = 50, offset = 0) => {
  console.log(`[GroupChatService Dummy] Fetching messages for workspace ${workspaceId}`);
  return [];
};

const getChatByWorkspace = async (workspaceId) => {
  console.log(`[GroupChatService Dummy] Fetching chat for workspace ${workspaceId}`);
  return null;
};

module.exports = { sendMessage, fetchMessages, getChatByWorkspace };
