/**
 * DATA ACCESS LAYER - TaskRepository
 * Handles all database operations for tasks.
 */

const pool = require('../config/db');

const create = async ({ workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by }) => {
  const result = await pool.query(
    `INSERT INTO TASKS (workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by]
  );
  return result.rows[0];
};

const findById = async (taskId) => {
  const result = await pool.query(
    'SELECT * FROM TASKS WHERE task_id = $1 AND deleted_at IS NULL',
    [taskId]
  );
  return result.rows[0] || null;
};

const findByWorkspace = async (workspaceId) => {
  const result = await pool.query(
    'SELECT * FROM TASKS WHERE workspace_id = $1 AND deleted_at IS NULL AND parent_task_id IS NULL ORDER BY created_at DESC',
    [workspaceId]
  );
  return result.rows;
};

const findSubtasks = async (parentTaskId) => {
  const result = await pool.query(
    'SELECT * FROM TASKS WHERE parent_task_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC',
    [parentTaskId]
  );
  return result.rows;
};

const update = async (taskId, updates) => {
  const allowedFields = ['title', 'description', 'status', 'priority', 'assigned_to', 'deadline'];
  const fields = Object.keys(updates).filter(k => allowedFields.includes(k));
  if (fields.length === 0) throw new Error('No valid fields to update');
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = [taskId, ...fields.map(f => updates[f])];
  const result = await pool.query(
    `UPDATE TASKS SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE task_id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
};

const softDelete = async (taskId) => {
  await pool.query(
    'UPDATE TASKS SET deleted_at = CURRENT_TIMESTAMP WHERE task_id = $1',
    [taskId]
  );
};

module.exports = { create, findById, findByWorkspace, findSubtasks, update, softDelete };
