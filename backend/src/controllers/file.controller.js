/**
 * APPLICATION LAYER - FileController (FileCoordinator)
 */
const fileService = require('../services/file.service');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    const { workspaceId, taskId } = req.body;
    const file = await fileService.uploadFile(req.user?.userId, workspaceId, taskId, req.file.buffer, req.file);
    res.status(201).json({ success: true, data: file });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getFilesByWorkspace = async (req, res) => {
  try {
    const files = await fileService.getFilesByWorkspace(req.params.workspaceId);
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFilesByTask = async (req, res) => {
  try {
    const files = await fileService.getFilesByTask(req.params.taskId);
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    await fileService.deleteFile(req.user?.userId, req.params.fileId);
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { uploadFile, getFilesByWorkspace, getFilesByTask, deleteFile };
