/**
 * DATA ACCESS LAYER - ActivityRepository
 * Handles all database operations for ACTIVITY_LOGS table.
 */

const pool = require('../config/db');

const create = async ({ actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value }) => {
  const result = await pool.query(
    `INSERT INTO ACTIVITY_LOGS (actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [actor_user_id, workspace_id, action_type, entity_type, entity_id, old_value, new_value]
  );
  return result.rows[0];
};

const findByWorkspace = async (workspaceId, limit = 50, offset = 0) => {
  // Assuming a users table exists as implicitly referenced by UUIDs in the schema
  const result = await pool.query(
    `SELECT al.* FROM ACTIVITY_LOGS al
     WHERE al.workspace_id = $1 ORDER BY al.created_at DESC LIMIT $2 OFFSET $3`,
    [workspaceId, limit, offset]
  );
  return result.rows;
};

const findByEntity = async (entityType, entityId) => {
  const result = await pool.query(
    'SELECT * FROM ACTIVITY_LOGS WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
    [entityType, entityId]
  );
  return result.rows;
};

module.exports = { create, findByWorkspace, findByEntity };
