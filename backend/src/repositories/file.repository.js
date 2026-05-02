/**
 * DATA ACCESS LAYER - FileRepository
 * Handles all database operations for file metadata.
 */

const pool = require('../config/db');

const create = async ({ workspace_id, task_id, uploaded_by, file_name, file_path, mime_type, file_size_bytes }) => {
  const result = await pool.query(
    `INSERT INTO workspace_files (workspace_id, task_id, uploaded_by, file_name, file_path, mime_type, file_size_bytes)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [workspace_id, task_id, uploaded_by, file_name, file_path, mime_type, file_size_bytes]
  );
  return result.rows[0];
};

const findById = async (fileId) => {
  const result = await pool.query(
    'SELECT * FROM workspace_files WHERE file_id = $1 AND deleted_at IS NULL',
    [fileId]
  );
  return result.rows[0] || null;
};

const findByWorkspace = async (workspaceId) => {
  const result = await pool.query(
    'SELECT * FROM workspace_files WHERE workspace_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
    [workspaceId]
  );
  return result.rows;
};

const findByTask = async (taskId) => {
  const result = await pool.query(
    'SELECT * FROM workspace_files WHERE task_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
    [taskId]
  );
  return result.rows;
};

const softDelete = async (fileId) => {
  await pool.query(
    'UPDATE workspace_files SET deleted_at = CURRENT_TIMESTAMP WHERE file_id = $1',
    [fileId]
  );
};

module.exports = { create, findById, findByWorkspace, findByTask, softDelete };
