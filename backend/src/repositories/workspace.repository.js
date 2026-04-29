/**
 * DATA ACCESS LAYER - WorkspaceRepository
 * Implements IWorkspaceRepository. Handles all database operations for workspaces.
 */

const pool = require('../config/db');

const create = async ({ name, project_id, created_by }) => {
  const result = await pool.query(
    'INSERT INTO WORKSPACES (name, project_id, created_by) VALUES ($1, $2, $3) RETURNING *',
    [name, project_id, created_by]
  );
  return result.rows[0];
};

const findById = async (workspaceId) => {
  const result = await pool.query(
    'SELECT * FROM WORKSPACES WHERE workspace_id = $1 AND deleted_at IS NULL AND is_active = TRUE',
    [workspaceId]
  );
  return result.rows[0] || null;
};

const findByProject = async (projectId) => {
  const result = await pool.query(
    'SELECT * FROM WORKSPACES WHERE project_id = $1 AND deleted_at IS NULL AND is_active = TRUE ORDER BY created_at DESC',
    [projectId]
  );
  return result.rows;
};

const addMember = async (workspaceId, userId, roleId) => {
  const result = await pool.query(
    'INSERT INTO WORKSPACE_MEMBERS (workspace_id, user_id, role_id) VALUES ($1, $2, $3) ON CONFLICT (workspace_id, user_id) DO UPDATE SET role_id = $3 RETURNING *',
    [workspaceId, userId, roleId]
  );
  return result.rows[0];
};

const removeMember = async (workspaceId, userId) => {
  await pool.query(
    'DELETE FROM WORKSPACE_MEMBERS WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
};

const createInvitation = async (workspaceId, invitedBy, inviteeEmail) => {
  const result = await pool.query(
    'INSERT INTO WORKSPACE_INVITATIONS (workspace_id, invited_by, invitee_email) VALUES ($1, $2, $3) RETURNING *',
    [workspaceId, invitedBy, inviteeEmail]
  );
  return result.rows[0];
}

const findInvitation = async (invitationId) => {
  const result = await pool.query(
    'SELECT * FROM WORKSPACE_INVITATIONS WHERE invitation_id = $1',
    [invitationId]
  );
  return result.rows[0] || null;
}

const updateInvitationStatus = async (invitationId, status, inviteeUserId) => {
  const result = await pool.query(
    'UPDATE WORKSPACE_INVITATIONS SET status = $2, invitee_user_id = $3, responded_at = CURRENT_TIMESTAMP WHERE invitation_id = $1 RETURNING *',
    [invitationId, status, inviteeUserId]
  );
  return result.rows[0];
}

const softDelete = async (workspaceId) => {
  await pool.query(
    'UPDATE WORKSPACES SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE workspace_id = $1',
    [workspaceId]
  );
};

module.exports = { create, findById, findByProject, addMember, removeMember, createInvitation, findInvitation, updateInvitationStatus, softDelete };
