/**
 * BUSINESS LOGIC LAYER - WorkspaceService
 * Implements IWorkspaceService. Contains core domain logic for workspace management.
 * Depends on WorkspaceRepository (Data Access Layer) and ActivityService.
 */

const workspaceRepository = require('../repositories/workspace.repository');
const activityService = require('./activity.service');

const createWorkspace = async (name, projectId, createdBy) => {
  if (!name || !projectId || !createdBy) {
    throw new Error('name, projectId, and createdBy are required');
  }
  const workspace = await workspaceRepository.create({ name, project_id: projectId, created_by: createdBy });
  await activityService.logActivity(createdBy, workspace.workspace_id, 'CREATED', 'WORKSPACE', workspace.workspace_id, null, workspace);
  return workspace;
};

const inviteUser = async (workspaceId, invitedBy, inviteeEmail) => {
  const invitation = await workspaceRepository.createInvitation(workspaceId, invitedBy, inviteeEmail);
  await activityService.logActivity(invitedBy, workspaceId, 'CREATED', 'WORKSPACE_INVITATION', invitation.invitation_id, null, invitation);
  return invitation;
};

const addMember = async (workspaceId, userId, roleId, requesterId) => {
  const membership = await workspaceRepository.addMember(workspaceId, userId, roleId);
  await activityService.logActivity(requesterId, workspaceId, 'UPDATED', 'WORKSPACE_MEMBER', userId, null, { userId, roleId });
  return membership;
};

const removeMember = async (workspaceId, userId, requesterId) => {
  await workspaceRepository.removeMember(workspaceId, userId);
  await activityService.logActivity(requesterId, workspaceId, 'DELETED', 'WORKSPACE_MEMBER', userId, { userId }, null);
};

const getMembers = async (workspaceId) => {
  return workspaceRepository.getMembers(workspaceId);
};

const getWorkspaceById = async (workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) throw new Error(`Workspace with ID ${workspaceId} not found`);
  return workspace;
};

const getWorkspacesByProject = async (projectId) => {
  return workspaceRepository.findByProject(projectId);
};

const deleteWorkspace = async (workspaceId, requesterId) => {
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) throw new Error(`Workspace with ID ${workspaceId} not found`);
  await workspaceRepository.softDelete(workspaceId);
  await activityService.logActivity(requesterId, workspaceId, 'DELETED', 'WORKSPACE', workspaceId, workspace, null);
};

const updateWorkspace = async (workspaceId, updates, requesterId) => {
  const oldWs = await workspaceRepository.findById(workspaceId);
  const ws = await workspaceRepository.update(workspaceId, updates);
  await activityService.logActivity(requesterId, workspaceId, 'UPDATED', 'WORKSPACE', workspaceId, oldWs, ws);
  return ws;
};

module.exports = {
  createWorkspace,
  inviteUser,
  addMember,
  removeMember,
  getMembers,
  getWorkspaceById,
  getWorkspacesByProject,
  deleteWorkspace,
  updateWorkspace,
};
