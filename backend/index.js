require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Collaboration Workspace Module running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
});
