// Standardized API response builder — enforces { success, data, message } shape.
// Every controller must use these helpers instead of raw res.json().

function sendSuccess(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

function sendCreated(res, data, message = 'Created') {
  return sendSuccess(res, data, message, 201);
}

function sendError(res, message = 'Internal server error', statusCode = 500, data = null) {
  return res.status(statusCode).json({
    success: false,
    data,
    message,
  });
}

function sendBadRequest(res, message = 'Bad request', data = null) {
  return sendError(res, message, 400, data);
}

function sendUnauthorized(res, message = 'Unauthorized') {
  return sendError(res, message, 401);
}

function sendNotFound(res, message = 'Not found') {
  return sendError(res, message, 404);
}

function sendServiceUnavailable(res, message = 'Service unavailable') {
  return sendError(res, message, 503);
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendNotFound,
  sendServiceUnavailable,
};
