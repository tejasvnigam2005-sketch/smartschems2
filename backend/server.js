const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ── Middleware ─────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(a => origin.startsWith(a))) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ── Lazy DB connection ────────────────────
let dbReady = false;

async function ensureDB() {
  if (dbReady) return;
  if (mongoose.connection.readyState === 1) { dbReady = true; return; }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Auto-seed if empty
  const BusinessScheme = require('./models/BusinessScheme');
  const EducationScheme = require('./models/EducationScheme');
  const [bCount, eCount] = await Promise.all([
    BusinessScheme.countDocuments(),
    EducationScheme.countDocuments()
  ]);
  if (bCount === 0 || eCount === 0) {
    try {
      const seedData = require('./data/seed');
      if (bCount === 0 && seedData.businessSchemes) await BusinessScheme.insertMany(seedData.businessSchemes);
      if (eCount === 0 && seedData.educationSchemes) await EducationScheme.insertMany(seedData.educationSchemes);
      console.log('✅ Auto-seeded');
    } catch (e) { console.log('Seed skip:', e.message); }
  }
  dbReady = true;
}

// DB middleware - runs before every request
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// ── Routes ────────────────────────────────
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/business-schemes', require('./routes/businessSchemes'));
app.use('/api/education-schemes', require('./routes/educationSchemes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start server (local only) ─────────────
if (!process.env.VERCEL) {
  const dotenv = require('dotenv');
  dotenv.config();

  const PORT = process.env.PORT || 5000;
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 SmartSchemes API on port ${PORT}`);
    });
  });
}

module.exports = app;
