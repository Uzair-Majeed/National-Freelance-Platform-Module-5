/**
 * APPLICATION LAYER - RoleController (RoleCoordinator)
 */
const roleService = require('../services/role.service');

const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles(req.params.workspaceId);
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    const role = await roleService.createRole(req.params.workspaceId, roleName, permissions);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const { targetUserId, roleId } = req.body;
    const result = await roleService.assignRole(req.user?.userId, targetUserId, req.params.workspaceId, roleId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

const checkPermission = async (req, res) => {
  try {
    const { action } = req.query;
    const allowed = await roleService.checkPermission(req.user?.userId, req.params.workspaceId, action);
    res.status(200).json({ success: true, data: { allowed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllRoles, createRole, assignRole, checkPermission };
