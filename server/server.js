const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Listen immediately so the API remains reachable while MongoDB connects.
const server = app.listen(PORT, () => {
  console.log(`TaskFlow API listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

connectDB()
  .then(() => console.log('TaskFlow database connection ready.'))
  .catch((error) => {
    console.error(`TaskFlow database connection failed: ${error.message}`);
    console.error('Database-backed requests will return 503 until MongoDB is available.');
  });

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down TaskFlow...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
});
process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});
