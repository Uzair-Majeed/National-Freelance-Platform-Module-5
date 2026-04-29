/**
 * BUSINESS LOGIC LAYER - ActivityService
 * Implements IActivityService. Records all workspace actions for auditing.
 * Depends on ActivityRepository for persistence.
 */

const activityRepository = require('../repositories/activity.repository');

const logActivity = async (actorUserId, workspaceId, actionType, entityType, entityId, oldValue, newValue) => {
  try {
    return await activityRepository.create({
      actor_user_id: actorUserId,
      workspace_id: workspaceId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      old_value: oldValue ? JSON.stringify(oldValue) : null,
      new_value: newValue ? JSON.stringify(newValue) : null,
    });
  } catch (err) {
    console.error('[ActivityService] Failed to log activity:', err.message);
  }
};

const getActivityByWorkspace = async (workspaceId, limit = 50, offset = 0) => {
  return activityRepository.findByWorkspace(workspaceId, limit, offset);
};

const getActivityByEntity = async (entityType, entityId) => {
  return activityRepository.findByEntity(entityType, entityId);
};

const generateWorkspaceReport = async (workspaceId) => {
  const logs = await activityRepository.findByWorkspace(workspaceId, 1000, 0);
  const summary = logs.reduce((acc, log) => {
    acc[log.action_type] = (acc[log.action_type] || 0) + 1;
    return acc;
  }, {});
  return { workspaceId, totalActions: logs.length, actionBreakdown: summary, generatedAt: new Date().toISOString() };
};

module.exports = { logActivity, getActivityByWorkspace, getActivityByEntity, generateWorkspaceReport };
