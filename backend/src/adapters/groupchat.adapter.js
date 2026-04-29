/**
 * EXTERNAL INTEGRATION LAYER - GroupChatAdapter
 * Abstracts real-time communication (WebSocket broadcasting).
 * Currently dummied out pending Communication module completion.
 */

let _io = null;

const setIO = (io) => {
  // Dummy
};

const broadcast = async (workspaceId, message) => {
  // Dummy
  console.log(`[GroupChatAdapter Dummy] Broadcast to workspace ${workspaceId} suppressed.`);
};

module.exports = { setIO, broadcast };
