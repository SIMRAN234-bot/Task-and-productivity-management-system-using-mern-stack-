require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start server after attempting database connection
const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 TaskFlow API Server running in [${process.env.NODE_ENV || 'development'}] mode`);
      console.log(`📡 Listening on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('✅ Server and Database connections closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (err) => {
      console.error(`💥 Unhandled Rejection: ${err.message}`);
      // Keep server alive or exit based on severity
    });

    process.on('uncaughtException', (err) => {
      console.error(`💥 Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error(`⚠️ Server started in degraded mode (Database not connected yet).`);
    console.error(`Please update server/.env with your valid MONGODB_URI to enable database persistence.`);

    // Still listen so health check and helpful error responses can be served
    app.listen(PORT, () => {
      console.log(`📡 Fallback HTTP Server listening on http://localhost:${PORT} (Waiting for MongoDB Atlas configuration)`);
    });
  }
};

startServer();
