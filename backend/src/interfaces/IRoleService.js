/**
 * SERVICE INTERFACE LAYER - IRoleService
 * Defines the contract that RoleService must implement.
 * Covers RBAC operations: checking permissions and assigning roles.
 */

const IRoleService = {
  checkPermission: async (userId, workspaceId, action) => { throw new Error('Not implemented'); },
  assignRole: async (adminUserId, targetUserId, workspaceId, roleId) => { throw new Error('Not implemented'); },
  getRoleById: async (roleId) => { throw new Error('Not implemented'); },
  getAllRoles: async () => { throw new Error('Not implemented'); },
  createRole: async (roleName, permissions) => { throw new Error('Not implemented'); },
};

module.exports = IRoleService;
