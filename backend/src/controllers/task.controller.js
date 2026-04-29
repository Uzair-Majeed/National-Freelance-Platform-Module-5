/**
 * APPLICATION LAYER - TaskController (TaskCoordinator)
 * Handles HTTP request/response lifecycle for task-related endpoints.
 */

const taskService = require('../services/task.service');

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user?.userId);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getTasksByWorkspace = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByWorkspace(req.params.workspaceId);
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSubtasks = async (req, res) => {
  try {
    const subtasks = await taskService.getSubtasks(req.params.taskId);
    res.status(200).json({ success: true, data: subtasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await taskService.assignTask(req.params.taskId, userId, req.user?.userId);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.params.taskId, status, req.user?.userId);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.taskId, req.body, req.user?.userId);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.taskId, req.user?.userId);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createTask, getTaskById, getTasksByWorkspace, getSubtasks, assignTask, updateTaskStatus, updateTask, deleteTask };
