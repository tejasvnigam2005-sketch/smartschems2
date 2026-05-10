// Scheme controller — handles listing and retrieving business/education schemes.
// All business logic extracted from routes/businessSchemes.js and educationSchemes.js.

const supabase = require('../config/supabase');
const { sendSuccess, sendBadRequest, sendNotFound, sendServiceUnavailable } = require('../utils/responseHelper');
const { paginationSchema, formatZodError } = require('../validators/schemas');

async function getBusinessSchemes(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { businessType, state } = req.query;
    const { page: pageNum, limit: limitNum } = parsed.data;
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('business_schemes')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (businessType) query = query.contains('business_type', [businessType]);
    if (state) query = query.contains('states', [state.toLowerCase()]);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return sendSuccess(res, {
      schemes: data || [],
      pagination: {
        total: count || 0,
        page: pageNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    }, 'Business schemes retrieved');
  } catch (error) {
    next(error);
  }
}

async function getBusinessSchemeById(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const { data, error } = await supabase
      .from('business_schemes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return sendNotFound(res, 'Business scheme not found');
    }

    return sendSuccess(res, data, 'Business scheme retrieved');
  } catch (error) {
    next(error);
  }
}

async function getEducationSchemes(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { educationLevel, category, state } = req.query;
    const { page: pageNum, limit: limitNum } = parsed.data;
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('education_schemes')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (educationLevel) query = query.contains('education_level', [educationLevel]);
    if (category) query = query.contains('category', [category]);
    if (state) query = query.contains('states', [state.toLowerCase()]);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return sendSuccess(res, {
      schemes: data || [],
      pagination: {
        total: count || 0,
        page: pageNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    }, 'Education schemes retrieved');
  } catch (error) {
    next(error);
  }
}

async function getEducationSchemeById(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const { data, error } = await supabase
      .from('education_schemes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return sendNotFound(res, 'Education scheme not found');
    }

    return sendSuccess(res, data, 'Education scheme retrieved');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBusinessSchemes,
  getBusinessSchemeById,
  getEducationSchemes,
  getEducationSchemeById,
};
