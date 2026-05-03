/**
 * DATA ACCESS LAYER - ActivityRepository
 * Handles all database operations for ACTIVITY_LOGS table.
 */

const pool = require('../config/db');

const create = async ({ actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value }) => {
  const result = await pool.query(
    `INSERT INTO workspace_activity_logs (actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value]
  );
  return result.rows[0];
};

const findByWorkspace = async (workspaceId, limit = 50, offset = 0) => {
  const result = await pool.query(
    `SELECT al.*, u.email as actor_email 
     FROM workspace_activity_logs al
     JOIN users u ON al.actor_user_id = u.id
     WHERE al.workspace_id = $1 
     ORDER BY al.created_at DESC LIMIT $2 OFFSET $3`,
    [workspaceId, limit, offset]
  );
  return result.rows;
};

const findByEntity = async (entityType, entityId) => {
  const result = await pool.query(
    `SELECT al.*, u.email as actor_email 
     FROM workspace_activity_logs al
     JOIN users u ON al.actor_user_id = u.id
     WHERE al.entity_type = $1 AND al.entity_id = $2 
     ORDER BY al.created_at DESC`,
    [entityType, entityId]
  );
  return result.rows;
};

module.exports = { create, findByWorkspace, findByEntity };
