/**
 * SERVICE INTERFACE LAYER - IFileService
 * Defines the contract that FileService must implement.
 */

const IFileService = {
  uploadFile: async (userId, workspaceId, taskId, fileStream, fileMetadata) => { throw new Error('Not implemented'); },
  deleteFile: async (userId, fileId) => { throw new Error('Not implemented'); },
  getFileById: async (fileId) => { throw new Error('Not implemented'); },
  getFilesByWorkspace: async (workspaceId) => { throw new Error('Not implemented'); },
  getFilesByTask: async (taskId) => { throw new Error('Not implemented'); },
};

module.exports = IFileService;
