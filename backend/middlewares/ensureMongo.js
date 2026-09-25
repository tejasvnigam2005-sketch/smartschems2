// Middleware: ensures MongoDB is connected before processing the request.
// In serverless (Netlify Functions), the top-level connectMongoDB() may not
// have resolved yet when the first request arrives. This middleware awaits
// the cached connection promise so the handler always sees readyState === 1.

const connectMongoDB = require('../config/mongodb');
const { sendServiceUnavailable } = require('../utils/responseHelper');

async function ensureMongo(req, res, next) {
  try {
    await connectMongoDB();
    next();
  } catch (err) {
    const logger = require('../utils/logger');
    logger.error('ensureMongo', `Database connection failed: ${err.message}`);
    return sendServiceUnavailable(res, 'Database connection failed');
  }
}

module.exports = ensureMongo;
