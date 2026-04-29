/**
 * DATA ACCESS LAYER - RoleRepository
 * Handles all database operations for roles and RBAC within a workspace.
 */

const pool = require('../config/db');

const create = async ({ workspace_id, role_name, permissions }) => {
  const result = await pool.query(
    'INSERT INTO WORKSPACE_ROLES (workspace_id, role_name, permissions) VALUES ($1, $2, $3) RETURNING *',
    [workspace_id, role_name, JSON.stringify(permissions)]
  );
  return result.rows[0];
};

const findById = async (roleId) => {
  const result = await pool.query('SELECT * FROM WORKSPACE_ROLES WHERE role_id = $1', [roleId]);
  return result.rows[0] || null;
};

const findByWorkspace = async (workspaceId) => {
  const result = await pool.query('SELECT * FROM WORKSPACE_ROLES WHERE workspace_id = $1 ORDER BY role_name ASC', [workspaceId]);
  return result.rows;
};

/**
 * Gets the role assigned to a user within a specific workspace.
 */
const getMemberRole = async (userId, workspaceId) => {
  const result = await pool.query(
    `SELECT r.* FROM WORKSPACE_ROLES r
     JOIN WORKSPACE_MEMBERS wm ON wm.role_id = r.role_id
     WHERE wm.user_id = $1 AND wm.workspace_id = $2`,
    [userId, workspaceId]
  );
  return result.rows[0] || null;
};

/**
 * Updates a workspace member's role.
 */
const updateMemberRole = async (userId, workspaceId, roleId) => {
  const result = await pool.query(
    'UPDATE WORKSPACE_MEMBERS SET role_id = $3 WHERE user_id = $1 AND workspace_id = $2 RETURNING *',
    [userId, workspaceId, roleId]
  );
  return result.rows[0];
};

module.exports = { create, findById, findByWorkspace, getMemberRole, updateMemberRole };
