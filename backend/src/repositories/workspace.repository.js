/**
 * DATA ACCESS LAYER - WorkspaceRepository
 * Implements IWorkspaceRepository. Handles all database operations for workspaces.
 */

const pool = require('../config/db');

const create = async ({ name, project_id, created_by }) => {
  const result = await pool.query(
    'INSERT INTO workspace_list (name, project_id, created_by) VALUES ($1, $2, $3) RETURNING *',
    [name, project_id, created_by]
  );
  return result.rows[0];
};

const findById = async (workspaceId) => {
  const result = await pool.query(
    'SELECT * FROM workspace_list WHERE workspace_id = $1::uuid AND deleted_at IS NULL AND is_active = TRUE',
    [workspaceId]
  );
  return result.rows[0] || null;
};

const findByProject = async (projectId, userId) => {
  const result = await pool.query(
    `SELECT w.* FROM workspace_list w
     JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
     WHERE w.project_id = $1 
     AND wm.user_id = $2
     AND w.deleted_at IS NULL 
     AND w.is_active = TRUE 
     ORDER BY w.created_at DESC`,
    [projectId, userId]
  );
  return result.rows;
};

const addMember = async (workspaceId, userId, roleId) => {
  const result = await pool.query(
    'INSERT INTO workspace_members (workspace_id, user_id, role_id) VALUES ($1, $2, $3) ON CONFLICT (workspace_id, user_id) DO UPDATE SET role_id = $3 RETURNING *',
    [workspaceId, userId, roleId]
  );
  return result.rows[0];
};

const removeMember = async (workspaceId, userId) => {
  await pool.query(
    'DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
};

const getMembers = async (workspaceId) => {
  const result = await pool.query(
    `SELECT wm.*, r.role_name, u.email 
     FROM workspace_members wm
     JOIN workspace_users u ON wm.user_id = u.user_id
     LEFT JOIN workspace_roles r ON wm.role_id = r.role_id
     WHERE wm.workspace_id = $1`,
    [workspaceId]
  );
  return result.rows;
};

const createInvitation = async (workspaceId, invitedBy, inviteeEmail) => {
  const result = await pool.query(
    'INSERT INTO workspace_invitations (workspace_id, invited_by, invitee_email) VALUES ($1, $2, $3) RETURNING *',
    [workspaceId, invitedBy, inviteeEmail]
  );
  return result.rows[0];
}

const findInvitation = async (invitationId) => {
  const result = await pool.query(
    'SELECT * FROM workspace_invitations WHERE invitation_id = $1',
    [invitationId]
  );
  return result.rows[0] || null;
}

const updateInvitationStatus = async (invitationId, status, inviteeUserId) => {
  const result = await pool.query(
    'UPDATE workspace_invitations SET status = $2, invitee_user_id = $3, responded_at = CURRENT_TIMESTAMP WHERE invitation_id = $1 RETURNING *',
    [invitationId, status, inviteeUserId]
  );
  return result.rows[0];
}

const softDelete = async (workspaceId) => {
  await pool.query(
    'UPDATE workspace_list SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE workspace_id = $1',
    [workspaceId]
  );
};

const update = async (workspaceId, { name, is_active }) => {
  const result = await pool.query(
    'UPDATE workspace_list SET name = COALESCE($2, name), is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP WHERE workspace_id = $1 RETURNING *',
    [workspaceId, name, is_active]
  );
  return result.rows[0];
};

const findInvitationsByWorkspace = async (workspaceId) => {
  const result = await pool.query(
    `SELECT * FROM workspace_invitations WHERE workspace_id = $1 ORDER BY invited_at DESC`,
    [workspaceId]
  );
  return result.rows;
};

module.exports = { create, findById, findByProject, addMember, removeMember, getMembers, createInvitation, findInvitation, findInvitationsByWorkspace, updateInvitationStatus, softDelete, update };

