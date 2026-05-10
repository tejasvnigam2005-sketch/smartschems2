// App entry point — assembles middleware, routes, and error handler.
// Kept minimal; all business logic lives in controllers.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const errorMiddleware = require('./middlewares/error.middleware');

dotenv.config();
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

logger.info('Server', `Environment: ${process.env.NODE_ENV}`);

const app = express();

// ── Security headers ─────────────────────────
app.use(helmet());

// ── Cookie parser ────────────────────────────
app.use(cookieParser());

// ── CORS ─────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (server-to-server, curl, Netlify functions)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((allowed) => origin === allowed)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50kb' }));

// ── Rate limiters ────────────────────────────
const rateLimitMessage = { success: false, message: 'Too many requests, please try again later.' };

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

// ── Routes ───────────────────────────────────
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));
app.use('/api/business-schemes', require('./routes/businessSchemes.routes'));
app.use('/api/education-schemes', require('./routes/educationSchemes.routes'));
app.use('/api/scheme-guide', require('./routes/schemeGuide.routes'));
app.use('/api/chat', chatLimiter, require('./routes/chat.routes'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'Healthy' });
});

// ── Central error handler ────────────────────
app.use(errorMiddleware);

// ── Start server (skipped on Netlify) ────────
if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info('Server', `SmartSchemes API running on port ${PORT}`);
  });
}

module.exports = app;
