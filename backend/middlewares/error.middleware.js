// Central error handling middleware — catches all errors passed via next(err).
// Returns standardized { success, data, message } response shape.

const logger = require('../utils/logger');

function errorMiddleware(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('ErrorHandler', message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  return res.status(statusCode).json({
    success: false,
    data: null,
    message: statusCode === 500 ? 'Internal server error' : message,
  });
}

module.exports = errorMiddleware;
