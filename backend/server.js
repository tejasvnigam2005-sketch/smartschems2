// App entry point — assembles middleware, routes, and error handler.
// Kept minimal; all business logic lives in controllers.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const errorMiddleware = require('./middlewares/error.middleware');

dotenv.config();

const app = express();

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
      if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// ── Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));
app.use('/api/business-schemes', require('./routes/businessSchemes.routes'));
app.use('/api/education-schemes', require('./routes/educationSchemes.routes'));
app.use('/api/scheme-guide', require('./routes/schemeGuide.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

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
