/**
 * SERVICE INTERFACE LAYER - IWorkspaceService
 * Defines the contract that WorkspaceService must implement.
 * Ensures loose coupling between the Application Layer and Business Logic Layer.
 */

/**
 * @interface IWorkspaceService
 */
const IWorkspaceService = {
  /**
   * Creates a new workspace within a project.
   * @param {string} name - Workspace name
   * @param {string} projectId - Associated project UUID
   * @param {string} createdBy - UUID of the user creating the workspace
   * @returns {Promise<Object>} Created workspace object
   */
  createWorkspace: async (name, projectId, createdBy) => { throw new Error('Not implemented'); },

  /**
   * Invites a user to a workspace.
   * @param {string} workspaceId - Workspace UUID
   * @param {string} invitedBy - UUID of user inviting
   * @param {string} inviteeEmail - Email of the invitee
   * @returns {Promise<Object>} Invitation object
   */
  inviteUser: async (workspaceId, invitedBy, inviteeEmail) => { throw new Error('Not implemented'); },

  /**
   * Adds a member to a workspace (e.g. accepting invite).
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID to add
   * @param {string} roleId - Role UUID to assign
   * @param {string} requesterId - UUID of the user performing the action
   * @returns {Promise<Object>} Updated workspace membership
   */
  addMember: async (workspaceId, userId, roleId, requesterId) => { throw new Error('Not implemented'); },

  /**
   * Removes a member from a workspace.
   * @param {string} workspaceId - Workspace UUID
   * @param {string} userId - User UUID to remove
   * @param {string} requesterId - UUID of the user performing the action
   * @returns {Promise<void>}
   */
  removeMember: async (workspaceId, userId, requesterId) => { throw new Error('Not implemented'); },

  /**
   * Retrieves a workspace by ID.
   * @param {string} workspaceId - Workspace UUID
   * @returns {Promise<Object>} Workspace object
   */
  getWorkspaceById: async (workspaceId) => { throw new Error('Not implemented'); },

  /**
   * Retrieves all workspaces for a project.
   * @param {string} projectId - Project UUID
   * @returns {Promise<Array>} Array of workspace objects
   */
  getWorkspacesByProject: async (projectId) => { throw new Error('Not implemented'); },

  /**
   * Soft-deletes a workspace.
   * @param {string} workspaceId - Workspace UUID
   * @param {string} requesterId - UUID of the user performing the action
   * @returns {Promise<void>}
   */
  deleteWorkspace: async (workspaceId, requesterId) => { throw new Error('Not implemented'); },
};

module.exports = IWorkspaceService;
