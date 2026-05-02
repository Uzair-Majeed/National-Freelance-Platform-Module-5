const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/workspace.controller');

// ── Invitation routes (must come BEFORE /:workspaceId to avoid route capture) ──
// GET  /api/workspaces/invitation/:invitationId   – fetch invitation details
router.get('/invitation/:invitationId', ctrl.getInvitationById);
// PATCH /api/workspaces/invitation/:invitationId/respond – accept or decline
router.patch('/invitation/:invitationId/respond', ctrl.respondToInvitation);

// ── Project-scoped workspace list (must come before /:workspaceId) ────────────
// GET  /api/workspaces/project/:projectId
router.get('/project/:projectId', ctrl.getWorkspacesByProject);

// ── Workspace CRUD ────────────────────────────────────────────────────────────
// POST   /api/workspaces
router.post('/', ctrl.createWorkspace);
// GET    /api/workspaces/:workspaceId
router.get('/:workspaceId', ctrl.getWorkspaceById);
// DELETE /api/workspaces/:workspaceId
router.delete('/:workspaceId', ctrl.deleteWorkspace);
// PATCH  /api/workspaces/:workspaceId
router.patch('/:workspaceId', ctrl.updateWorkspace);

// ── Member management ─────────────────────────────────────────────────────────
// POST   /api/workspaces/:workspaceId/members
router.post('/:workspaceId/members', ctrl.addMember);
// GET    /api/workspaces/:workspaceId/members
router.get('/:workspaceId/members', ctrl.getWorkspaceMembers);
// DELETE /api/workspaces/:workspaceId/members/:userId
router.delete('/:workspaceId/members/:userId', ctrl.removeMember);

// ── Invitations ───────────────────────────────────────────────────────────────
// POST   /api/workspaces/:workspaceId/invite
router.post('/:workspaceId/invite', ctrl.inviteUser);
// GET    /api/workspaces/:workspaceId/invitations
router.get('/:workspaceId/invitations', ctrl.getInvitations);

module.exports = router;
