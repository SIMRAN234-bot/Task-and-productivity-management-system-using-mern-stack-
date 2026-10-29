const mongoose = require('mongoose');

let memoryServer = null;

/**
 * Connect to MongoDB instance
 * Supports MongoDB Atlas, local MongoDB, or automatic in-memory fallback for development
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = !uri || uri.includes('<username>') || uri.includes('<password>');

  // If a valid connection URI is provided, use it
  if (!isPlaceholder) {
    try {
      console.log('📡 Connecting to configured MongoDB instance...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      });
      console.log(`✅ [MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`❌ [MongoDB Connection Failed] ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      console.warn('⚠️ Falling back to embedded in-memory MongoDB for local development/testing...');
    }
  } else {
    console.warn('\n⚠️ [Database Configuration Note]');
    console.warn('No custom MONGODB_URI configured in server/.env.');
    console.warn('Starting embedded in-memory MongoDB database for development & instant evaluation...\n');
  }

  // Automatic in-memory MongoDB fallback in development
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();

    const conn = await mongoose.connect(memoryUri, {
      dbName: 'taskflow_dev',
    });

    console.log(`==================================================================`);
    console.log(`🚀 [Embedded Database Ready] Connected to In-Memory MongoDB`);
    console.log(`📡 Memory URI: ${memoryUri}`);
    console.log(`💡 To persist data permanently across restarts, add your MongoDB Atlas`);
    console.log(`   connection string to server/.env (see docs/DATABASE_SCHEMA.md)`);
    console.log(`==================================================================\n`);

    return conn;
  } catch (memError) {
    console.error(`❌ [Embedded MongoDB Error] ${memError.message}`);
    throw memError;
  }
};

/**
 * Disconnect from MongoDB instance
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 [MongoDB Disconnected]');
    }
    if (memoryServer) {
      await memoryServer.stop();
      console.log('🛑 [Memory MongoDB Server Stopped]');
      memoryServer = null;
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
