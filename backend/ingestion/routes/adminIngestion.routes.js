// Admin Ingestion Routes — exposes protected endpoints for scheme ingestion and monitoring.

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminIngestion.controller');
const supabase = require('../../config/supabase');
const logger = require('../../utils/logger');
const { sendUnauthorized, sendForbidden } = require('../../utils/responseHelper');

// Secure Admin Authentication Middleware
async function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const configuredKey = process.env.ADMIN_API_KEY;

  // 1. API Key Authentication (Preferred for backend/CLI/cron jobs)
  if (configuredKey && adminKey && adminKey === configuredKey) {
    return next();
  }

  // 2. Supabase User Authentication (for dashboard/admin UI)
  const token = req.cookies?.ss_token || req.header('Authorization')?.replace('Bearer ', '');
  if (token && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        const role = user.app_metadata?.role || user.user_metadata?.role;
        if (role === 'admin') {
          req.user = user;
          return next();
        }
      }
    } catch (err) {
      logger.warn('AdminAuth', 'Token validation failed', { error: err.message });
    }
  }

  // 3. Fallback in development mode when key is not configured
  if (!configuredKey && process.env.NODE_ENV !== 'production') {
    logger.warn(
      'AdminAuth',
      'ADMIN_API_KEY not configured in .env. Allowing request in development mode. Set ADMIN_API_KEY for production security.'
    );
    return next();
  }

  return sendUnauthorized(res, 'Unauthorized: Valid x-admin-key header or admin session required');
}

// Protected Ingestion Endpoints
router.post('/schemes/import', requireAdmin, adminController.importSchemes);
router.get('/schemes/data-quality', requireAdmin, adminController.getDataQualityReport);
router.get('/schemes/sources', requireAdmin, adminController.getAvailableSources);

module.exports = router;
