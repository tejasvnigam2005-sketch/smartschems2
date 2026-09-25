// Ownership guard middleware — prevents BOLA/IDOR by ensuring the
// authenticated user can only access resources they own.
//
// Usage:
//   router.get('/users/:userId/account', authMiddleware, requireOwnership('userId'), controller);
//   router.put('/users/:userId/settings', authMiddleware, requireOwnership('userId'), controller);
//
// How it works:
//   1. authMiddleware sets req.user from the JWT (trusted identity)
//   2. requireOwnership compares req.user.id with req.params[paramName]
//   3. If they don't match → 403 Forbidden
//
// For admin bypass, check req.user.role before calling this middleware.

const { sendBadRequest } = require('../utils/responseHelper');

/**
 * Returns middleware that verifies the authenticated user owns the resource
 * identified by the given route parameter.
 *
 * @param {string} paramName - The route parameter containing the resource owner's ID (default: 'userId')
 */
function requireOwnership(paramName = 'userId') {
  return (req, res, next) => {
    const resourceOwnerId = req.params[paramName];

    if (!resourceOwnerId) {
      return sendBadRequest(res, `Missing route parameter: ${paramName}`);
    }

    // req.user is set by authMiddleware (Supabase JWT → user object)
    if (!req.user || req.user.id !== resourceOwnerId) {
      // Return 403 (not 404) so the caller knows the resource exists
      // but they don't have permission. Use 404 if you want to hide
      // the resource's existence entirely.
      return res.status(403).json({
        success: false,
        data: null,
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
}

module.exports = requireOwnership;
