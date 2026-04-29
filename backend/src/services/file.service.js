/**
 * BUSINESS LOGIC LAYER - FileService
 * Implements IFileService. Manages file upload lifecycle.
 * Integrates with FileStorageAdapter for external cloud storage.
 */

const fileRepository = require('../repositories/file.repository');
const activityService = require('./activity.service');
const fileStorageAdapter = require('../adapters/fileStorage.adapter');

const uploadFile = async (userId, workspaceId, taskId, fileBuffer, fileMetadata) => {
  const { originalname, mimetype, size } = fileMetadata;
  const filePath = await fileStorageAdapter.upload(fileBuffer, originalname, workspaceId);
  const file = await fileRepository.create({
    workspace_id: workspaceId,
    task_id: taskId || null,
    uploaded_by: userId,
    file_name: originalname,
    file_path: filePath,
    mime_type: mimetype,
    file_size_bytes: size,
  });
  await activityService.logActivity(userId, workspaceId, 'UPLOADED', 'FILE', file.file_id, null, { fileName: originalname });
  return file;
};

const deleteFile = async (userId, fileId) => {
  const file = await fileRepository.findById(fileId);
  if (!file) throw new Error(`File ${fileId} not found`);
  await fileStorageAdapter.delete(file.file_path);
  await fileRepository.softDelete(fileId);
  await activityService.logActivity(userId, file.workspace_id, 'DELETED', 'FILE', fileId, { fileName: file.file_name }, null);
};

const getFileById = async (fileId) => {
  const file = await fileRepository.findById(fileId);
  if (!file) throw new Error(`File ${fileId} not found`);
  return file;
};

const getFilesByWorkspace = async (workspaceId) => fileRepository.findByWorkspace(workspaceId);

const getFilesByTask = async (taskId) => fileRepository.findByTask(taskId);

module.exports = { uploadFile, deleteFile, getFileById, getFilesByWorkspace, getFilesByTask };
