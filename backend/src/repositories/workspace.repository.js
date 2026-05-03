/**
 * DATA ACCESS LAYER - WorkspaceRepository
 * Implements IWorkspaceRepository. Handles all database operations for workspaces.
 */

const pool = require('../config/db');

const create = async ({ name, project_id, created_by }) => {
  const result = await pool.query(
    'INSERT INTO workspaces (name, project_id, created_by) VALUES ($1, $2, $3) RETURNING *',
    [name, project_id, created_by]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM workspaces WHERE id = $1 AND deleted_at IS NULL AND is_active = TRUE',
    [id]
  );
  return result.rows[0] || null;
};

const findByProject = async (projectId, userId) => {
  const result = await pool.query(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON w.id = wm.workspace_id
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
    `SELECT wm.*, r.role_name, u.email, u.display_name
     FROM workspace_members wm
     LEFT JOIN workspace_roles r ON wm.role_id = r.id
     JOIN users u ON wm.user_id = u.id
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
    `SELECT i.*, w.name as workspace_name, u.email as inviter_email
     FROM workspace_invitations i
     JOIN workspaces w ON i.workspace_id = w.id
     JOIN users u ON i.invited_by = u.id
     WHERE i.id = $1`,
    [invitationId]
  );
  return result.rows[0] || null;
}

const updateInvitationStatus = async (invitationId, status, inviteeUserId) => {
  const result = await pool.query(
    'UPDATE workspace_invitations SET status = $2, invitee_user_id = $3, responded_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [invitationId, status, inviteeUserId]
  );
  return result.rows[0];
}

const softDelete = async (id) => {
  await pool.query(
    'UPDATE workspaces SET deleted_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE id = $1',
    [id]
  );
};

const update = async (id, { name, is_active }) => {
  const result = await pool.query(
    'UPDATE workspaces SET name = COALESCE($2, name), is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id, name, is_active]
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

const findInvitationsByEmail = async (email) => {
  const result = await pool.query(
    `SELECT i.*, w.name as workspace_name 
     FROM workspace_invitations i
     JOIN workspaces w ON i.workspace_id = w.id
     WHERE i.invitee_email = $1 AND i.status = 'pending'
     ORDER BY i.invited_at DESC`,
    [email]
  );
  return result.rows;
};

module.exports = { 
  create, 
  findById, 
  findByProject, 
  addMember, 
  removeMember, 
  getMembers, 
  createInvitation, 
  findInvitation, 
  findInvitationsByWorkspace, 
  findInvitationsByEmail, 
  updateInvitationStatus, 
  softDelete, 
  update 
};

