const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/', taskController.createTask);
router.get('/workspace/:workspaceId', taskController.getTasksByWorkspace);
router.get('/:taskId', taskController.getTaskById);
router.get('/:taskId/subtasks', taskController.getSubtasks);
router.put('/:taskId', taskController.updateTask);
router.patch('/:taskId/assign', taskController.assignTask);
router.patch('/:taskId/status', taskController.updateTaskStatus);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
