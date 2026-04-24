const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// Guard: all auth routes require Supabase
router.use((req, res, next) => {
  if (!supabase) {
    return res.status(503).json({ message: 'Authentication service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
  }
  next();
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, acceptedTerms } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!acceptedTerms) {
      return res.status(400).json({ message: 'You must accept the Terms & Conditions' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (error) {
      if (error.message.includes('already') || error.message.includes('unique')) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }
      throw error;
    }

    // Store consent in profiles table
    await supabase.from('profiles').update({
      accepted_terms: true,
      accepted_at: new Date().toISOString()
    }).eq('id', data.user.id);

    // Sign in to get a session token
    const { data: signInData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) throw loginError;

    res.status(201).json({
      token: signInData.session.access_token,
      user: {
        id: signInData.user.id,
        name: signInData.user.user_metadata?.name || name,
        email: signInData.user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || '',
        email: data.user.email,
        preferences: {
          category: profile?.pref_category || '',
          state: profile?.pref_state || '',
          age: profile?.pref_age || null,
          income: profile?.pref_income || null
        },
        searchHistory: profile?.search_history || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me — Get current user (requires Supabase JWT)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ message: 'Invalid or expired token' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({
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
      savedSchemes: profile?.saved_schemes || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/preferences — Update preferences
router.put('/preferences', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ message: 'Invalid token' });

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

    if (error) {
      console.error('Preferences update error:', error);
      throw error;
    }
    console.log('✅ Preferences saved for user:', user.id, updateData);
    res.json(data);
  } catch (error) {
    console.error('Preferences endpoint error:', error.message || error);
    res.status(500).json({ message: 'Server error', detail: error.message });
  }
});

module.exports = router;
