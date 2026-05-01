const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace.controller');

// POST   /api/workspaces               - Create a new workspace
router.post('/', workspaceController.createWorkspace);
// GET    /api/workspaces/:workspaceId        - Get workspace by ID
router.get('/:workspaceId', workspaceController.getWorkspaceById);
// DELETE /api/workspaces/:workspaceId        - Soft-delete a workspace
router.delete('/:workspaceId', workspaceController.deleteWorkspace);
// PATCH  /api/workspaces/:workspaceId        - Update workspace details
router.patch('/:workspaceId', workspaceController.updateWorkspace);
// GET    /api/workspaces/project/:projectId - Get all workspaces in a project
router.get('/project/:projectId', workspaceController.getWorkspacesByProject);
// POST   /api/workspaces/:workspaceId/members     - Add member to workspace
router.post('/:workspaceId/members', workspaceController.addMember);
// GET    /api/workspaces/:workspaceId/members     - Get all members
router.get('/:workspaceId/members', workspaceController.getWorkspaceMembers);
// DELETE /api/workspaces/:workspaceId/members/:userId - Remove member from workspace
router.delete('/:workspaceId/members/:userId', workspaceController.removeMember);
// POST   /api/workspaces/:workspaceId/invite      - Invite user to workspace
router.post('/:workspaceId/invite', workspaceController.inviteUser);

module.exports = router;
