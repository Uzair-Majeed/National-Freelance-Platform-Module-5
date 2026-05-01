/**
 * APPLICATION LAYER - WorkspaceController (WorkspaceCoordinator)
 * Handles HTTP request/response lifecycle for workspace-related endpoints.
 * Delegates all business logic to WorkspaceService.
 */

const workspaceService = require('../services/workspace.service');

const createWorkspace = async (req, res) => {
  try {
    const { name, projectId } = req.body;
    const createdBy = req.user?.userId; // Set by auth middleware
    const workspace = await workspaceService.createWorkspace(name, projectId, createdBy);
    res.status(201).json({ success: true, data: workspace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const inviteUser = async (req, res) => {
  try {
    const { inviteeEmail } = req.body;
    const invitedBy = req.user?.userId;
    const invitation = await workspaceService.inviteUser(req.params.workspaceId, invitedBy, inviteeEmail);
    res.status(201).json({ success: true, data: invitation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.workspaceId);
    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getWorkspacesByProject = async (req, res) => {
  try {
    const workspaces = await workspaceService.getWorkspacesByProject(req.params.projectId);
    res.status(200).json({ success: true, data: workspaces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const requesterId = req.user?.userId;
    const membership = await workspaceService.addMember(req.params.workspaceId, userId, roleId, requesterId);
    res.status(200).json({ success: true, data: membership });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const requesterId = req.user?.userId;
    await workspaceService.removeMember(req.params.workspaceId, req.params.userId, requesterId);
    res.status(200).json({ success: true, message: 'Member removed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const members = await workspaceService.getMembers(req.params.workspaceId);
    res.status(200).json({ success: true, data: members });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const requesterId = req.user?.userId;
    await workspaceService.deleteWorkspace(req.params.workspaceId, requesterId);
    res.status(200).json({ success: true, message: 'Workspace deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const requesterId = req.user?.userId;
    const workspace = await workspaceService.updateWorkspace(req.params.workspaceId, req.body, requesterId);
    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createWorkspace, inviteUser, getWorkspaceById, getWorkspacesByProject, addMember, removeMember, getWorkspaceMembers, deleteWorkspace, updateWorkspace };
