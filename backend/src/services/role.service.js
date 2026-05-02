/**
 * BUSINESS LOGIC LAYER - RoleService
 * Implements IRoleService. Enforces RBAC (Role-Based Access Control) within a workspace.
 * Depends on RoleRepository for data access.
 */

const roleRepository = require('../repositories/role.repository');
const activityService = require('./activity.service');

/**
 * Checks if a user has permission to perform an action within a workspace.
 */
const checkPermission = async (userId, workspaceId, action) => {
  const memberRole = await roleRepository.getMemberRole(userId, workspaceId);
  if (!memberRole) {
    console.log(`[RoleService] No role found for user ${userId} in workspace ${workspaceId}`);
    return false;
  }
  const permissions = memberRole.permissions;
  const isAllowed = permissions[action] === true || permissions['*'] === true;
  
  console.log(`[RoleService] Checking permission: User=${userId}, Action=${action}, Allowed=${isAllowed}`);
  return isAllowed;
};

/**
 * Assigns a role to a workspace member (Admin-only operation).
 */
const assignRole = async (adminUserId, targetUserId, workspaceId, roleId) => {
  const isAdmin = await checkPermission(adminUserId, workspaceId, 'ASSIGN_ROLE');
  if (!isAdmin) throw new Error('Access Denied: You do not have permission to assign roles');
  const role = await roleRepository.findById(roleId);
  if (!role) throw new Error(`Role ${roleId} does not exist`);
  const result = await roleRepository.updateMemberRole(targetUserId, workspaceId, roleId);
  await activityService.logActivity(adminUserId, workspaceId, 'ROLE_UPDATED', 'WORKSPACE_MEMBER', targetUserId, null, { roleId });
  return result;
};

const getRoleById = async (roleId) => {
  const role = await roleRepository.findById(roleId);
  if (!role) throw new Error(`Role ${roleId} not found`);
  return role;
};

const getAllRoles = async (workspaceId) => roleRepository.findByWorkspace(workspaceId);

const createRole = async (workspaceId, roleName, permissions) => {
  if (!workspaceId || !roleName || !permissions) throw new Error('workspaceId, roleName, and permissions are required');
  return roleRepository.create({ workspace_id: workspaceId, role_name: roleName, permissions });
};

module.exports = { checkPermission, assignRole, getRoleById, getAllRoles, createRole };
