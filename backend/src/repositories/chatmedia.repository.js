/**
 * DATA ACCESS LAYER - ChatMediaRepository
 * Handles database operations for chat attachments (chat_media_files).
 */

const pool = require('../config/db');

const create = async ({ uploader_id, room_id, file_name, file_type, mime_type, file_size_bytes, storage_url }) => {
  const result = await pool.query(
    `INSERT INTO chat_media_files (uploader_id, room_id, file_name, file_type, mime_type, file_size_bytes, storage_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [uploader_id, room_id, file_name, file_type, mime_type, file_size_bytes, storage_url]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM chat_media_files WHERE id = $1 AND is_deleted = FALSE', [id]);
  return result.rows[0];
};

module.exports = { create, findById };
