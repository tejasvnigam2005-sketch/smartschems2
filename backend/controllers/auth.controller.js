// Auth controller — handles signup, login, profile retrieval, and preference updates.
// All business logic extracted from routes/auth.js; uses Supabase for identity.

const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendServiceUnavailable,
} = require('../utils/responseHelper');
const { signupSchema, loginSchema, formatZodError } = require('../validators/schemas');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function signup(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { name, email, password } = parsed.data;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      if (error.message.includes('already') || error.message.includes('unique')) {
        return sendBadRequest(res, 'An account with this email already exists');
      }
      throw error;
    }

    await supabase
      .from('profiles')
      .update({ accepted_terms: true, accepted_at: new Date().toISOString() })
      .eq('id', data.user.id);

    const { data: signInData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) throw loginError;

    res.cookie('ss_token', signInData.session.access_token, COOKIE_OPTIONS);

    return sendCreated(res, {
      user: {
        id: signInData.user.id,
        name: signInData.user.user_metadata?.name || name,
        email: signInData.user.email,
      },
    }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured');
    }

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { email, password } = parsed.data;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.cookie('ss_token', data.session.access_token, COOKIE_OPTIONS);

    return sendSuccess(res, {
      user: {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || '',
        email: data.user.email,
        preferences: {
          category: profile?.pref_category || '',
          state: profile?.pref_state || '',
          age: profile?.pref_age || null,
          income: profile?.pref_income || null,
        },
        searchHistory: profile?.search_history || [],
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const safeProfile = {
      id: user.id,
      name: profile ? profile.name : (user.user_metadata ? user.user_metadata.name || '' : ''),
      email: user.email,
      preferences: {
        age: profile ? profile.pref_age || null : null,
        state: profile ? profile.pref_state || '' : '',
        category: profile ? profile.pref_category || '' : '',
        income: profile ? profile.pref_income || null : null,
        occupation: profile ? profile.pref_occupation || '' : '',
        gender: profile ? profile.pref_gender || '' : '',
        area: profile ? profile.pref_area || '' : '',
        disability: profile ? profile.pref_disability || false : false,
      },
      hasCompletedProfile: !!(profile && profile.pref_age && profile.pref_state),
      searchHistory: profile ? profile.search_history || [] : [],
      savedSchemes: profile ? profile.saved_schemes || [] : [],
    };

    return sendSuccess(res, safeProfile, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
}

async function updatePreferences(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured');
    }

    const token = req.cookies?.ss_token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return sendUnauthorized(res, 'No token provided');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return sendUnauthorized(res, 'Invalid token');
    }

    const updateData = {};
    if (req.body.category !== undefined) updateData.pref_category = req.body.category;
    if (req.body.state !== undefined) updateData.pref_state = req.body.state;
    if (req.body.age !== undefined) updateData.pref_age = Number(req.body.age) || null;
    if (req.body.income !== undefined) updateData.pref_income = Number(req.body.income) || null;
    if (req.body.occupation !== undefined) updateData.pref_occupation = req.body.occupation;
    if (req.body.gender !== undefined) updateData.pref_gender = req.body.gender;
    if (req.body.area !== undefined) updateData.pref_area = req.body.area;
    if (req.body.disability !== undefined) updateData.pref_disability = !!req.body.disability;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    logger.info('Auth', 'Preferences updated', { userId: user.id });

    const safePrefs = {
      pref_age: data.pref_age || null,
      pref_state: data.pref_state || '',
      pref_category: data.pref_category || '',
      pref_income: data.pref_income || null,
      pref_occupation: data.pref_occupation || '',
      pref_gender: data.pref_gender || '',
      pref_area: data.pref_area || '',
      pref_disability: data.pref_disability || false,
    };

    return sendSuccess(res, safePrefs, 'Preferences updated');
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login, getMe, updatePreferences };
