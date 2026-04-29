const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

router.get('/workspace/:workspaceId', activityController.getActivityByWorkspace);
router.get('/workspace/:workspaceId/report', activityController.generateWorkspaceReport);

module.exports = router;
