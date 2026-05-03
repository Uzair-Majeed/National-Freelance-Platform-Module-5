/**
 * DATA ACCESS LAYER - TaskRepository
 * Handles all database operations for tasks.
 */

const pool = require('../config/db');

const create = async ({ workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by }) => {
  const result = await pool.query(
    `INSERT INTO workspace_tasks (workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [workspace_id, title, description, priority, deadline, parent_task_id, assigned_to, created_by]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT t.*, u.email as assignee_email, c.email as creator_email
     FROM workspace_tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     LEFT JOIN users c ON t.created_by = c.id
     WHERE t.id = $1 AND t.deleted_at IS NULL`,
    [id]
  );
  return result.rows[0] || null;
};

const findByWorkspace = async (workspaceId) => {
  const result = await pool.query(
    `SELECT t.*, u.email as assignee_email 
     FROM workspace_tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.workspace_id = $1 AND t.deleted_at IS NULL AND t.parent_task_id IS NULL 
     ORDER BY t.created_at DESC`,
    [workspaceId]
  );
  return result.rows;
};

const findSubtasks = async (parentTaskId) => {
  const result = await pool.query(
    `SELECT t.*, u.email as assignee_email
     FROM workspace_tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.parent_task_id = $1 AND t.deleted_at IS NULL 
     ORDER BY t.created_at ASC`,
    [parentTaskId]
  );
  return result.rows;
};

const update = async (id, updates) => {
  const allowedFields = ['title', 'description', 'status', 'priority', 'assigned_to', 'deadline'];
  const fields = Object.keys(updates).filter(k => allowedFields.includes(k));
  if (fields.length === 0) throw new Error('No valid fields to update');
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = [id, ...fields.map(f => updates[f])];
  const result = await pool.query(
    `UPDATE workspace_tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    values
  );
  if (result.rows[0]) {
    return findById(id); // Return full object with joins
  }
  return null;
};

const softDelete = async (id) => {
  await pool.query(
    'UPDATE workspace_tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );
};

module.exports = { create, findById, findByWorkspace, findSubtasks, update, softDelete };
