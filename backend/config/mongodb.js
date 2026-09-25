// MongoDB Atlas connection using Mongoose.
// Caches the connection PROMISE so that concurrent serverless invocations
// all await the same in-flight connection instead of racing.

const mongoose = require('mongoose');
const logger = require('../utils/logger');

let connectionPromise = null;

async function connectMongoDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) return;

  // Connection already in progress — reuse it
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.warn('MongoDB', 'Missing MONGO_URI in environment — skipping MongoDB connection');
    return;
  }

  connectionPromise = mongoose
    .connect(uri, { dbName: 'smart_schemes' })
    .then(() => {
      logger.info('MongoDB', 'Connected to MongoDB Atlas (smart_schemes)');
    })
    .catch((err) => {
      connectionPromise = null; // allow retry on next invocation
      logger.error('MongoDB', `Connection failed: ${err.message}`);
      throw err;
    });

  return connectionPromise;
}

module.exports = connectMongoDB;
