/**
 * BUSINESS LOGIC LAYER - WorkspaceService
 * Implements IWorkspaceService. Contains core domain logic for workspace management.
 * Depends on WorkspaceRepository, RoleRepository, and ActivityService.
 *
 * DEFAULT ROLES (auto-seeded on workspace creation):
 *   ADMIN   – full control ('*': true)
 *   MANAGER – manage tasks, invite members, view activity
 *   MEMBER  – create & edit own tasks only
 */

const workspaceRepository = require('../repositories/workspace.repository');
const roleRepository = require('../repositories/role.repository');
const activityService = require('./activity.service');
const emailService = require('./email.service');

// ─── Default role definitions ────────────────────────────────────────────────
const DEFAULT_ROLES = [
  {
    role_name: 'ADMIN',
    permissions: { '*': true },
  },
  {
    role_name: 'MANAGER',
    permissions: {
      CREATE_TASK: true,
      EDIT_TASK: true,
      DELETE_TASK: true,
      INVITE_MEMBER: true,
      REMOVE_MEMBER: true,
      VIEW_ACTIVITY_LOG: true,
      ASSIGN_ROLE: false,
      EDIT_WORKSPACE_SETTINGS: false,
    },
  },
  {
    role_name: 'MEMBER',
    permissions: {
      CREATE_TASK: true,
      EDIT_TASK: true,
      DELETE_TASK: false,
      INVITE_MEMBER: false,
      REMOVE_MEMBER: false,
      VIEW_ACTIVITY_LOG: false,
      ASSIGN_ROLE: false,
      EDIT_WORKSPACE_SETTINGS: false,
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Seeds the 3 default roles for a new workspace and returns a map of
 * { ADMIN, MANAGER, MEMBER } → role_id.
 */
const seedDefaultRoles = async (workspaceId) => {
  const roleMap = {};
  for (const roleDef of DEFAULT_ROLES) {
    const role = await roleRepository.create({ workspace_id: workspaceId, ...roleDef });
    roleMap[roleDef.role_name] = role.id;
  }
  return roleMap;
};

/**
 * Looks up the MEMBER role_id for a given workspace.
 */
const getMemberRoleId = async (workspaceId) => {
  const roles = await roleRepository.findByWorkspace(workspaceId);
  const memberRole = roles.find((r) => r.role_name === 'MEMBER');
  if (!memberRole) throw new Error('Default MEMBER role not found for this workspace');
  return memberRole.id;
};

// ─── Service methods ──────────────────────────────────────────────────────────

const createWorkspace = async (name, projectId, createdBy) => {
  if (!name || !projectId || !createdBy) {
    throw new Error('name, projectId, and createdBy are required');
  }

  // 1. Create the workspace record
  const workspace = await workspaceRepository.create({ name, project_id: projectId, created_by: createdBy });

  // 2. Seed default roles (ADMIN, MANAGER, MEMBER)
  const roleMap = await seedDefaultRoles(workspace.id);

  // 3. Auto-add the creator as ADMIN
  await workspaceRepository.addMember(workspace.id, createdBy, roleMap['ADMIN']);

  // 4. Log the activity
  await activityService.logActivity(createdBy, workspace.id, 'CREATED', 'WORKSPACE', workspace.id, null, { name });

  return workspace;
};

const inviteUser = async (workspaceId, invitedBy, inviteeEmail) => {
  const invitation = await workspaceRepository.createInvitation(workspaceId, invitedBy, inviteeEmail);

  // Fetch workspace details for the email
  const workspace = await workspaceRepository.findById(workspaceId);
  const workspaceName = workspace ? workspace.name : 'a Workspace';

  // Construct the link to the frontend
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const inviteLink = `${frontendUrl}/invite?invitationId=${invitation.id}`;

  // Send the email asynchronously
  try {
    const shortName = invitedBy ? String(invitedBy) : 'Someone'; 
    await emailService.sendWorkspaceInvitation(inviteeEmail, shortName, workspaceName, inviteLink);
  } catch (err) {
    console.error('[inviteUser] Non-fatal: Failed to send email.', err.message);
  }

  await activityService.logActivity(invitedBy, workspaceId, 'CREATED', 'WORKSPACE_INVITATION', invitation.id, null, { inviteeEmail });
  return invitation;
};

const respondToInvitation = async (invitationId, status, inviteeUserId) => {
  const invitation = await workspaceRepository.findInvitation(invitationId);
  if (!invitation) throw new Error(`Invitation ${invitationId} not found`);
  if (invitation.status.toUpperCase() !== 'PENDING') throw new Error('Invitation has already been responded to');

  const normalised = status.toLowerCase();
  if (!['accepted', 'declined'].includes(normalised)) {
    throw new Error('status must be ACCEPTED or DECLINED');
  }

  const updated = await workspaceRepository.updateInvitationStatus(invitationId, normalised, inviteeUserId);

  // If accepted, add the invitee as a MEMBER of the workspace
  if (normalised === 'accepted') {
    const memberRoleId = await getMemberRoleId(invitation.workspace_id);
    await workspaceRepository.addMember(invitation.workspace_id, inviteeUserId, memberRoleId);
    await activityService.logActivity(inviteeUserId, invitation.workspace_id, 'UPDATED', 'WORKSPACE_MEMBER', inviteeUserId, null, { role: 'MEMBER' });
  }

  return updated;
};

const getInvitationById = async (invitationId) => {
  const invitation = await workspaceRepository.findInvitation(invitationId);
  if (!invitation) throw new Error(`Invitation ${invitationId} not found`);
  return invitation;
};

const getInvitations = async (workspaceId) => {
  return workspaceRepository.findInvitationsByWorkspace(workspaceId);
};

const getInvitationsByEmail = async (email) => {
  return workspaceRepository.findInvitationsByEmail(email);
};

const addMember = async (workspaceId, userId, roleId, requesterId) => {
  // If no roleId supplied, default to the MEMBER role for this workspace
  const resolvedRoleId = roleId || (await getMemberRoleId(workspaceId));
  const membership = await workspaceRepository.addMember(workspaceId, userId, resolvedRoleId);
  await activityService.logActivity(requesterId, workspaceId, 'UPDATED', 'WORKSPACE_MEMBER', userId, null, { userId, roleId: resolvedRoleId });
  return membership;
};

const removeMember = async (workspaceId, userId, requesterId) => {
  await workspaceRepository.removeMember(workspaceId, userId);
  await activityService.logActivity(requesterId, workspaceId, 'DELETED', 'WORKSPACE_MEMBER', userId, { userId }, null);
};

const getMembers = async (workspaceId) => workspaceRepository.getMembers(workspaceId);

const getWorkspaceById = async (workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) throw new Error(`Workspace with ID ${workspaceId} not found`);
  return workspace;
};

const getWorkspacesByProject = async (projectId, userId) => workspaceRepository.findByProject(projectId, userId);

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
  respondToInvitation,
  getInvitationById,
  getInvitations,
  addMember,
  removeMember,
  getMembers,
  getInvitationsByEmail,
  getWorkspaceById,
  getWorkspacesByProject,
  deleteWorkspace,
  updateWorkspace,
};
