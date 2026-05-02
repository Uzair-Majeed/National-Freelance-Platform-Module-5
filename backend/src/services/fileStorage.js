/**
 * EXTERNAL INTEGRATION LAYER - FileStorageAdapter
 * Abstracts integration with cloud file storage (e.g., AWS S3, Cloudinary).
 * The FileService depends on this adapter, not on a specific cloud provider.
 */

const path = require('path');
const fs = require('fs');

/**
 * Uploads a file buffer to storage and returns the file path/URL.
 * @param {Buffer} fileBuffer - File data buffer
 * @param {string} fileName - Original file name
 * @param {string} workspaceId - Workspace UUID (used to organize storage)
 * @returns {Promise<string>} Stored file path or URL
 */
const upload = async (fileBuffer, fileName, workspaceId) => {
  // TODO: Replace with actual cloud storage integration (e.g., AWS S3 putObject)
  // Local stub: saves to uploads/ directory
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', workspaceId);
  fs.mkdirSync(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, `${Date.now()}_${fileName}`);
  fs.writeFileSync(filePath, fileBuffer);
  console.log(`[FileStorageAdapter] File stored at: ${filePath}`);
  return filePath;
};

/**
 * Deletes a file from storage.
 * @param {string} filePath - Path or URL of the file to delete
 */
const deleteFile = async (filePath) => {
  // TODO: Replace with actual cloud storage deletion (e.g., AWS S3 deleteObject)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`[FileStorageAdapter] File deleted: ${filePath}`);
  }
};

module.exports = { upload, delete: deleteFile };
