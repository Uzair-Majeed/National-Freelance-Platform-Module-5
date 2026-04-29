/**
 * SERVICE INTERFACE LAYER - IActivityService
 * Defines the contract that ActivityService must implement.
 */

const IActivityService = {
  logActivity: async (actorUserId, workspaceId, actionType, entityType, entityId, oldValue, newValue) => { throw new Error('Not implemented'); },
  getActivityByWorkspace: async (workspaceId, limit, offset) => { throw new Error('Not implemented'); },
  getActivityByEntity: async (entityType, entityId) => { throw new Error('Not implemented'); },
  generateWorkspaceReport: async (workspaceId) => { throw new Error('Not implemented'); },
};

module.exports = IActivityService;
