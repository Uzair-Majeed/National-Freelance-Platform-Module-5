const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

// Upload a file (multipart/form-data)
router.post('/upload', fileController.upload.single('file'), fileController.uploadFile);

// Get all files for a workspace
router.get('/workspace/:workspaceId', fileController.getWorkspaceFiles);

// Get all files for a task
router.get('/task/:taskId', fileController.getTaskFiles);

// Download/View a file
router.get('/:fileId/download', fileController.downloadFile);

// View chat media
router.get('/media/:mediaId', fileController.downloadMedia);

module.exports = router;
