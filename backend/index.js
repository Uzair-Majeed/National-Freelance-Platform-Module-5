require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Collaboration Workspace Module running on port ${PORT}`);
});

// Prevent "Clean Exit" - Force the event loop to stay active
setInterval(() => {}, 1000 * 60 * 60); 

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
});
