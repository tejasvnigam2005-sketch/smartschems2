// Scheme controller — handles listing, searching, and retrieving schemes.
// ┌──────────────────────────────────────────────────┐
// │  DATA SOURCE: MongoDB Atlas  (Scheme collection) │
// │  Supabase is NOT used here.                      │
// └──────────────────────────────────────────────────┘

const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const { sendSuccess, sendBadRequest, sendNotFound, sendServiceUnavailable } = require('../utils/responseHelper');
const { paginationSchema, formatZodError } = require('../validators/schemas');

// ── Helpers ──────────────────────────────────

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

// Escapes regex metacharacters in user input to prevent ReDoS attacks.
// Without this, crafted input like "(a+)+$" could hang the event loop.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildCategoryRegex(keyword, { escape = false } = {}) {
  // Matches a schemeCategory field that contains the keyword (case-insensitive)
  const pattern = escape ? escapeRegex(keyword) : keyword;
  return new RegExp(pattern, 'i');
}

// ── Business Schemes ─────────────────────────

async function getBusinessSchemes(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { page: pageNum, limit: limitNum } = parsed.data;
    const skip = (pageNum - 1) * limitNum;
    const { search, state } = req.query;

    // Filter: schemeCategory contains "Business" or "Entrepreneurship"
    const filter = {
      schemeCategory: buildCategoryRegex('Business|Entrepreneurship'),
    };

    if (state && state !== 'all') {
      filter.level = new RegExp(escapeRegex(state), 'i');
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const [schemes, total] = await Promise.all([
      Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Scheme.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      schemes,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    }, 'Business schemes retrieved');
  } catch (error) {
    next(error);
  }
}

async function getBusinessSchemeById(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, 'Business scheme not found');
    }

    const scheme = await Scheme.findById(id).lean();
    if (!scheme) {
      return sendNotFound(res, 'Business scheme not found');
    }

    return sendSuccess(res, scheme, 'Business scheme retrieved');
  } catch (error) {
    next(error);
  }
}

// ── Education Schemes ────────────────────────

async function getEducationSchemes(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { page: pageNum, limit: limitNum } = parsed.data;
    const skip = (pageNum - 1) * limitNum;
    const { search, state } = req.query;

    // Filter: schemeCategory contains "Education" or "Learning"
    const filter = {
      schemeCategory: buildCategoryRegex('Education|Learning'),
    };

    if (state && state !== 'all') {
      filter.level = new RegExp(state, 'i');
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const [schemes, total] = await Promise.all([
      Scheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Scheme.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      schemes,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    }, 'Education schemes retrieved');
  } catch (error) {
    next(error);
  }
}

async function getEducationSchemeById(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, 'Education scheme not found');
    }

    const scheme = await Scheme.findById(id).lean();
    if (!scheme) {
      return sendNotFound(res, 'Education scheme not found');
    }

    return sendSuccess(res, scheme, 'Education scheme retrieved');
  } catch (error) {
    next(error);
  }
}

// ── All Schemes (search across 3400+ schemes) ───

async function getAllSchemes(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { page: pageNum, limit: limitNum } = parsed.data;
    const skip = (pageNum - 1) * limitNum;
    const { search, level, category } = req.query;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (level && level !== 'all') {
      filter.level = new RegExp(`^${escapeRegex(level)}$`, 'i');
    }

    if (category && category !== 'all') {
      filter.schemeCategory = buildCategoryRegex(category, { escape: true });
    }

    const sortBy = search
      ? { score: { $meta: 'textScore' }, createdAt: -1 }
      : { createdAt: -1 };

    const projection = search ? { score: { $meta: 'textScore' } } : {};

    const [schemes, total] = await Promise.all([
      Scheme.find(filter, projection).sort(sortBy).skip(skip).limit(limitNum).lean(),
      Scheme.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      schemes,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    }, 'Schemes retrieved');
  } catch (error) {
    next(error);
  }
}

async function getSchemeById(req, res, next) {
  try {
    if (!isMongoReady()) {
      return sendServiceUnavailable(res, 'Database not connected');
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, 'Scheme not found');
    }

    const scheme = await Scheme.findById(id).lean();
    if (!scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    return sendSuccess(res, scheme, 'Scheme retrieved');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBusinessSchemes,
  getBusinessSchemeById,
  getEducationSchemes,
  getEducationSchemeById,
  getAllSchemes,
  getSchemeById,
};
