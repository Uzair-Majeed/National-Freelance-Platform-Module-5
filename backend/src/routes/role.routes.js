const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.get('/workspace/:workspaceId', roleController.getAllRoles);
router.post('/workspace/:workspaceId', roleController.createRole);
router.post('/workspace/:workspaceId/assign', roleController.assignRole);
router.get('/workspace/:workspaceId/check', roleController.checkPermission);

module.exports = router;
