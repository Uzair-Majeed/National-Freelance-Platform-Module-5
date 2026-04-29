const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

router.post('/workspace/:workspaceId/task/:taskId', fileController.uploadFile);
router.get('/workspace/:workspaceId/task/:taskId', fileController.getFilesByTask);
router.delete('/:fileId', fileController.deleteFile);

module.exports = router;
