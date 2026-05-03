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
  
  // Normalize priority to lowercase for Centralized DB constraints
  const normalizedPriority = priority ? priority.toLowerCase() : 'medium';
  
  const task = await taskRepository.create({ 
    workspace_id: workspaceId, 
    title, 
    description, 
    priority: normalizedPriority, 
    deadline, 
    parent_task_id: parentTaskId, 
    assigned_to: assignedTo, 
    created_by: createdBy 
  });
  
  await activityService.logActivity(createdBy, workspaceId, 'CREATED', 'TASK', task.id, null, task);
  return task;
};

const assignTask = async (taskId, userId, requesterId) => {
  const oldTask = await taskRepository.findById(taskId);
  const task = await taskRepository.update(taskId, { assigned_to: userId });
  await activityService.logActivity(requesterId, task.workspace_id, 'ASSIGNED', 'TASK', taskId, { assigned_to: oldTask.assigned_to }, { assigned_to: userId });
  return task;
};

const updateTaskStatus = async (taskId, status, requesterId) => {
  // Normalize to lowercase for Centralized DB constraints
  const normalizedStatus = status ? status.toLowerCase() : 'todo';
  const validStatuses = ['todo', 'in_progress', 'under_review', 'done'];
  
  if (!validStatuses.includes(normalizedStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  const oldTask = await taskRepository.findById(taskId);
  const task = await taskRepository.update(taskId, { status: normalizedStatus });
  await activityService.logActivity(requesterId, task.workspace_id, 'UPDATED', 'TASK', taskId, { status: oldTask.status }, { status: normalizedStatus });
  return task;
};

const updateTask = async (taskId, updates, requesterId) => {
  const { _comment, _fileId, _fileName, ...taskUpdates } = updates;
  const oldTask = await taskRepository.findById(taskId);
  
  if (_comment || _fileId) {
    await activityService.logActivity(
      requesterId, 
      oldTask.workspace_id, 
      'COMMENT', 
      'TASK', 
      taskId, 
      null, 
      { text: _comment, file_id: _fileId, file_name: _fileName }
    );
  }

  if (Object.keys(taskUpdates).length > 0) {
    // Normalize fields if present
    if (taskUpdates.priority) taskUpdates.priority = taskUpdates.priority.toLowerCase();
    if (taskUpdates.status) taskUpdates.status = taskUpdates.status.toLowerCase();

    const task = await taskRepository.update(taskId, taskUpdates);
    await activityService.logActivity(requesterId, task.workspace_id, 'UPDATED', 'TASK', taskId, oldTask, task);
    return task;
  }
  
  return oldTask;
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
