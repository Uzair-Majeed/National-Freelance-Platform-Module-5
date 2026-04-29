const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth.middleware');
const errorMiddleware = require('./middleware/error.middleware');

// Route Imports
const workspaceRoutes = require('./routes/workspace.routes');
const taskRoutes = require('./routes/task.routes');
const roleRoutes = require('./routes/role.routes');
const fileRoutes = require('./routes/file.routes');
const activityRoutes = require('./routes/activity.routes');
const groupChatRoutes = require('./routes/groupchat.routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Authentication Middleware (Dummy for now)
app.use(authMiddleware);

// API Routes
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/chat', groupChatRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Collaboration Workspace Module is running' });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
