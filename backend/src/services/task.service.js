/**
 * BUSINESS LOGIC LAYER - TaskService
 * Implements ITaskService. Contains core domain logic for task management.
 * Depends on TaskRepository and ActivityService.
 */

const taskRepository = require('../repositories/task.repository');
const activityService = require('./activity.service');

const createTask = async (taskData, createdBy) => {
  const { workspaceId, title, description, priority, deadline, parentTaskId, assignedTo } = taskData;
  if (!workspaceId || !title) throw new Error('workspaceId and title are required');
  const task = await taskRepository.create({ workspace_id: workspaceId, title, description, priority, deadline, parent_task_id: parentTaskId, assigned_to: assignedTo, created_by: createdBy });
  await activityService.logActivity(createdBy, workspaceId, 'CREATED', 'TASK', task.task_id, null, task);
  return task;
};

const assignTask = async (taskId, userId, requesterId) => {
  const oldTask = await taskRepository.findById(taskId);
  const task = await taskRepository.update(taskId, { assigned_to: userId });
  await activityService.logActivity(requesterId, task.workspace_id, 'ASSIGNED', 'TASK', taskId, { assigned_to: oldTask.assigned_to }, { assigned_to: userId });
  return task;
};

const updateTaskStatus = async (taskId, status, requesterId) => {
  // Relaxed enum constraint since DB uses VARCHAR now, but we can keep app-level validation
  const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
  if (!validStatuses.includes(status)) throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  const oldTask = await taskRepository.findById(taskId);
  const task = await taskRepository.update(taskId, { status });
  await activityService.logActivity(requesterId, task.workspace_id, 'UPDATED', 'TASK', taskId, { status: oldTask.status }, { status });
  return task;
};

const updateTask = async (taskId, updates, requesterId) => {
  const oldTask = await taskRepository.findById(taskId);
  const task = await taskRepository.update(taskId, updates);
  await activityService.logActivity(requesterId, task.workspace_id, 'UPDATED', 'TASK', taskId, oldTask, task);
  return task;
};

const deleteTask = async (taskId, requesterId) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  await taskRepository.softDelete(taskId);
  await activityService.logActivity(requesterId, task.workspace_id, 'DELETED', 'TASK', taskId, task, null);
};

const getTaskById = async (taskId) => {
  const task = await taskRepository.findById(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);
  return task;
};

const getTasksByWorkspace = async (workspaceId) => taskRepository.findByWorkspace(workspaceId);

const getSubtasks = async (parentTaskId) => taskRepository.findSubtasks(parentTaskId);

module.exports = { createTask, assignTask, updateTaskStatus, updateTask, deleteTask, getTaskById, getTasksByWorkspace, getSubtasks };
