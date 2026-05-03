const multer = require('multer');
const { uploadToStorage, downloadFromStorage } = require('../repositories/storage.repository');
const fileRepository = require('../repositories/file.repository');
const activityService = require('../services/activity.service');
const chatMediaRepository = require('../repositories/chatmedia.repository');
const groupChatRepository = require('../repositories/groupchat.repository');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { workspaceId, taskId, isChat } = req.body;
    const userId = req.user?.userId;

    // 1. Save binary to Supabase Storage
    const storageResult = await uploadToStorage(
      req.file.originalname,
      req.file.mimetype,
      req.file.buffer
    );

    let resultData;

    if (isChat === 'true') {
      // Chat Media Handling
      const room = await groupChatRepository.findRoomByWorkspace(workspaceId);
      if (!room) throw new Error('Chat room not found for this workspace');

      const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 
                       req.file.mimetype.startsWith('video/') ? 'video' : 
                       req.file.mimetype.includes('pdf') ? 'pdf' : 'other';

      resultData = await chatMediaRepository.create({
        uploader_id: userId,
        room_id: room.id,
        file_name: req.file.originalname,
        file_type: fileType,
        mime_type: req.file.mimetype,
        file_size_bytes: req.file.size,
        storage_url: storageResult.id
      });
    } else {
      // Standard Workspace/Task File Handling
      resultData = await fileRepository.create({
        workspace_id: workspaceId,
        task_id: taskId || null,
        uploaded_by: userId,
        file_name: req.file.originalname,
        file_path: storageResult.id,
        mime_type: req.file.mimetype,
        file_size_bytes: req.file.size
      });
    }

    // Log activity
    await activityService.logActivity(
      userId,
      workspaceId,
      'CREATED',
      isChat === 'true' ? 'CHAT_MEDIA' : 'FILE',
      resultData.id,
      null,
      { name: req.file.originalname }
    );

    res.status(201).json({ success: true, data: resultData });
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

    try {
      const buffer = await downloadFromStorage(fileMetadata.file_path);
      res.setHeader('Content-Type', fileMetadata.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.file_name}"`);
      res.send(buffer);
    } catch (storageError) {
      console.error('[DownloadFile] Error fetching from storage:', storageError);
      return res.status(404).json({ success: false, message: 'Binary data not found in storage' });
    }
  } catch (err) {
  }
};
const downloadMedia = async (req, res) => {
  try {
    const mediaMetadata = await chatMediaRepository.findById(req.params.mediaId);
    if (!mediaMetadata) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    try {
      const buffer = await downloadFromStorage(mediaMetadata.storage_url);
      const isImage = mediaMetadata.mime_type.startsWith('image/');
      res.setHeader('Content-Type', mediaMetadata.mime_type);
      res.setHeader('Content-Disposition', `${isImage ? 'inline' : 'attachment'}; filename="${mediaMetadata.file_name}"`);
      res.send(buffer);
    } catch (storageError) {
      console.error('[DownloadMedia] Error fetching from storage:', storageError);
      return res.status(404).json({ success: false, message: 'Binary data not found in storage' });
    }
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
  downloadMedia,
  getWorkspaceFiles,
  getTaskFiles
};
