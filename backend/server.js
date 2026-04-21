const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(a => origin.startsWith(a))) return callback(null, true);
    callback(null, true); // Allow all for now
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ────────────────────────────────
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/business-schemes', require('./routes/businessSchemes'));
app.use('/api/education-schemes', require('./routes/educationSchemes'));
app.use('/api/scheme-guide', require('./routes/schemeGuide'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: 'supabase' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message, err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ── Start server ──────────────────────────
if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 SmartSchemes API on port ${PORT} (Supabase mode)`);
  });
}

module.exports = app;
