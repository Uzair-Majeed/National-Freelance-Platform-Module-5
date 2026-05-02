/**
 * DATA ACCESS LAYER - GroupChatRepository
 * Handles database operations for Module 6 (Communication).
 */

const pool = require('../config/db');

const findRoomByWorkspace = async (workspaceId) => {
  const result = await pool.query(
    'SELECT * FROM chat_rooms WHERE workspace_id = $1::uuid AND room_type = $2 AND deleted_at IS NULL',
    [workspaceId, 'group']
  );
  return result.rows[0];
};

const createRoom = async ({ workspace_id, room_name, created_by }) => {
  const result = await pool.query(
    `INSERT INTO chat_rooms (workspace_id, room_name, room_type, created_by)
     VALUES ($1::uuid, $2, $3, $4::uuid) RETURNING *`,
    [workspace_id, room_name, 'group', created_by]
  );
  return result.rows[0];
};

const saveMessage = async ({ room_id, sender_id, content, message_type = 'text', media_id = null, reply_to_msg_id = null }) => {
  const result = await pool.query(
    `INSERT INTO chat_messages (room_id, sender_id, content, message_type, media_id, reply_to_msg_id)
     VALUES ($1, $2::uuid, $3, $4, $5::uuid, $6) RETURNING *`,
    [room_id, sender_id, content, message_type, media_id, reply_to_msg_id]
  );
  return result.rows[0];
};

const getMessagesByRoom = async (roomId, limit = 50, offset = 0) => {
  const result = await pool.query(
    `SELECT 
        cm.*, 
        u.email as sender_name, 
        f.file_name, f.file_path, f.mime_type,
        parent.content as reply_content,
        parent_u.email as reply_sender_name
     FROM chat_messages cm
     JOIN workspace_users u ON cm.sender_id = u.user_id
     LEFT JOIN workspace_files f ON cm.media_id = f.file_id
     LEFT JOIN chat_messages parent ON cm.reply_to_msg_id = parent.id
     LEFT JOIN workspace_users parent_u ON parent.sender_id = parent_u.user_id
     WHERE cm.room_id = $1 AND cm.is_deleted = false
     ORDER BY cm.sent_at ASC
     LIMIT $2 OFFSET $3`,
    [roomId, limit, offset]
  );
  return result.rows;
};

const findById = async (messageId) => {
  const result = await pool.query('SELECT * FROM chat_messages WHERE id = $1', [messageId]);
  return result.rows[0];
};

const deleteMessage = async (messageId) => {
  const result = await pool.query(
    'UPDATE chat_messages SET is_deleted = true WHERE id = $1 RETURNING *',
    [messageId]
  );
  return result.rows[0];
};

const updateMessage = async (messageId, content) => {
  const result = await pool.query(
    'UPDATE chat_messages SET content = $2, is_edited = true, edited_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [messageId, content]
  );
  return result.rows[0];
};

module.exports = {
  findRoomByWorkspace,
  createRoom,
  saveMessage,
  getMessagesByRoom,
  findById,
  deleteMessage,
  updateMessage
};
