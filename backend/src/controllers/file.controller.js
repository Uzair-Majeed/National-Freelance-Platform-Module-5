const multer = require('multer');
const { saveImage, getImage, saveChatFile, getChatFile } = require('../repositories/sqlite.repository');
const fileRepository = require('../repositories/file.repository');
const activityService = require('../services/activity.service');

// Configure multer for memory storage (since we save to SQLite)
const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { workspaceId, taskId, isChat } = req.body;
    const userId = req.user?.userId;

    // 1. Save binary to SQLite (Choose table based on context)
    let sqliteResult;
    if (isChat === 'true') {
      sqliteResult = await saveChatFile(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );
    } else {
      sqliteResult = await saveImage(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );
    }

    // 2. Save metadata to PostgreSQL (Supabase)
    const fileMetadata = await fileRepository.create({
      workspace_id: workspaceId,
      task_id: taskId || null,
      uploaded_by: userId,
      file_name: req.file.originalname,
      file_path: sqliteResult.id, // Store SQLite ID as path
      mime_type: req.file.mimetype,
      file_size_bytes: req.file.size
    });

    // 3. Tag metadata with source table (optional but good for download routing)
    // We'll use the file_path to decide which table to query in downloadFile
    
    // Log activity
    await activityService.logActivity(
      userId,
      workspaceId,
      'CREATED',
      'FILE',
      fileMetadata.file_id,
      null,
      { name: req.file.originalname, isChat: isChat === 'true' }
    );

    res.status(201).json({ success: true, data: fileMetadata });
  } catch (err) {
    console.error('[FileUpload] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const fileMetadata = await fileRepository.findById(req.params.fileId);
    if (!fileMetadata) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Try both tables or use a flag. For simplicity, we'll try chat_files first then images.
    let sqliteRow = await getChatFile(fileMetadata.file_path);
    if (!sqliteRow) {
      sqliteRow = await getImage(fileMetadata.file_path);
    }

    if (!sqliteRow) {
      return res.status(404).json({ success: false, message: 'Binary data not found in local DB' });
    }

    res.setHeader('Content-Type', sqliteRow.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${sqliteRow.name}"`);
    
    const buffer = Buffer.isBuffer(sqliteRow.data) ? sqliteRow.data : Buffer.from(sqliteRow.data);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getWorkspaceFiles = async (req, res) => {
  try {
    const files = await fileRepository.findByWorkspace(req.params.workspaceId);
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTaskFiles = async (req, res) => {
  try {
    const files = await fileRepository.findByTask(req.params.taskId);
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  upload,
  uploadFile,
  downloadFile,
  getWorkspaceFiles,
  getTaskFiles
};
