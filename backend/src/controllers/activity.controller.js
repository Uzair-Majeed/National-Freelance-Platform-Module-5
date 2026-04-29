/**
 * APPLICATION LAYER - ActivityController (ActivityCoordinator)
 */
const activityService = require('../services/activity.service');

const getActivityByWorkspace = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const logs = await activityService.getActivityByWorkspace(req.params.workspaceId, parseInt(limit), parseInt(offset));
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const generateWorkspaceReport = async (req, res) => {
  try {
    const report = await activityService.generateWorkspaceReport(req.params.workspaceId);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActivityByWorkspace, generateWorkspaceReport };
