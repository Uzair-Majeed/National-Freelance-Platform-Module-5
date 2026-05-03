const supabase = require('../config/supabase');
const crypto = require('crypto');

const BUCKET_NAME = 'workspace-files';

/**
 * Uploads a file to Supabase Storage
 * @param {string} originalName 
 * @param {string} mimeType 
 * @param {Buffer} buffer 
 * @returns {Promise<{id: string, name: string, mimeType: string}>}
 */
const uploadToStorage = async (originalName, mimeType, buffer) => {
  const id = crypto.randomUUID();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(id, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
  }

  return { id, name: originalName, mimeType };
};

/**
 * Downloads a file from Supabase Storage
 * @param {string} id 
 * @returns {Promise<Buffer>}
 */
const downloadFromStorage = async (id) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(id);

  if (error) {
    throw new Error(`Failed to download from Supabase Storage: ${error.message}`);
  }

  // Convert Blob to Buffer
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

module.exports = {
  uploadToStorage,
  downloadFromStorage
};
