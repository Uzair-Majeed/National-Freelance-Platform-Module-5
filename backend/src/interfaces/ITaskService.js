/**
 * SERVICE INTERFACE LAYER - ITaskService
 * Defines the contract that TaskService must implement.
 */

const ITaskService = {
  createTask: async (taskData, createdBy) => { throw new Error('Not implemented'); },
  assignTask: async (taskId, userId, requesterId) => { throw new Error('Not implemented'); },
  updateTaskStatus: async (taskId, status, requesterId) => { throw new Error('Not implemented'); },
  updateTask: async (taskId, updates, requesterId) => { throw new Error('Not implemented'); },
  deleteTask: async (taskId, requesterId) => { throw new Error('Not implemented'); },
  getTaskById: async (taskId) => { throw new Error('Not implemented'); },
  getTasksByWorkspace: async (workspaceId) => { throw new Error('Not implemented'); },
  getSubtasks: async (parentTaskId) => { throw new Error('Not implemented'); },
};

module.exports = ITaskService;
