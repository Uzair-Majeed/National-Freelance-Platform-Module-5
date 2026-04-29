/**
 * SERVICE INTERFACE LAYER - IGroupChatService
 * Defines the contract that GroupChatService must implement.
 * Integrates with the external Communication Module via GroupChatAdapter.
 * Currently dummied out.
 */

const IGroupChatService = {
  sendMessage: async (userId, workspaceId, content) => { throw new Error('Not implemented'); },
  fetchMessages: async (workspaceId, limit, offset) => { throw new Error('Not implemented'); },
  getChatByWorkspace: async (workspaceId) => { throw new Error('Not implemented'); },
};

module.exports = IGroupChatService;
