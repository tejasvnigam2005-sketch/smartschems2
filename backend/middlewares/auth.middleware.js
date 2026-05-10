// Supabase JWT authentication middleware — verifies token and attaches req.user.
// Returns 401 with clear message if token is missing, invalid, or expired.

const supabase = require('../config/supabase');
const { sendUnauthorized, sendServiceUnavailable } = require('../utils/responseHelper');

async function authMiddleware(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured');
    }

    const token = req.cookies?.ss_token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return sendUnauthorized(res, 'No token provided');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendUnauthorized(res, 'Invalid or expired token');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;
