const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance
 * Supports MongoDB Atlas and local instances.
 * Provides clear console guidance if configuration is missing.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('\n❌ [Database Configuration Error]');
    console.error('MONGODB_URI is not configured properly in server/.env');
    console.error('Please configure your MongoDB Atlas or local connection string.');
    console.error('See docs/DATABASE_SCHEMA.md or README.md for step-by-step setup instructions.\n');
    throw new Error('Invalid or missing MONGODB_URI in environment variables');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Failed] ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect from MongoDB instance (used in tests and graceful shutdown)
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 [MongoDB Disconnected]');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
