const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

// Define routes
router.get('/:workspace_id', workspaceController.getWorkspaceDashboard);
router.get('/:workspace_id/members', workspaceController.getWorkspaceMembers);
router.post('/:workspace_id/invitations', workspaceController.sendInvitation);
router.get('/:workspace_id/tasks', workspaceController.getTasks);
router.post('/:workspace_id/tasks', workspaceController.createTask);

module.exports = router;
