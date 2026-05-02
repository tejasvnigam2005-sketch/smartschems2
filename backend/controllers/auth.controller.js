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

async function signup(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    const { name, email, password, acceptedTerms } = req.body;

    if (!name || !email || !password) {
      return sendBadRequest(res, 'Name, email, and password are required');
    }
    if (name.length < 2) {
      return sendBadRequest(res, 'Name must be at least 2 characters');
    }
    if (password.length < 8) {
      return sendBadRequest(res, 'Password must be at least 8 characters');
    }
    if (!acceptedTerms) {
      return sendBadRequest(res, 'You must accept the Terms & Conditions');
    }

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

    return sendCreated(res, {
      token: signInData.session.access_token,
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

    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequest(res, 'Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return sendSuccess(res, {
      token: data.session.access_token,
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

    const token = req.header('Authorization')?.replace('Bearer ', '');
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

    return sendSuccess(res, {
      id: user.id,
      name: profile?.name || user.user_metadata?.name || '',
      email: user.email,
      preferences: {
        category: profile?.pref_category || '',
        state: profile?.pref_state || '',
        age: profile?.pref_age || null,
        income: profile?.pref_income || null,
        occupation: profile?.pref_occupation || '',
        gender: profile?.pref_gender || '',
        area: profile?.pref_area || '',
        disability: profile?.pref_disability || false,
      },
      hasCompletedProfile: !!(profile?.pref_age && profile?.pref_state),
      searchHistory: profile?.search_history || [],
      savedSchemes: profile?.saved_schemes || [],
    }, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
}

async function updatePreferences(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Authentication service not configured');
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
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

    return sendSuccess(res, data, 'Preferences updated');
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login, getMe, updatePreferences };
