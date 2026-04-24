const express = require('express');
const supabase = require('../config/supabase');
const { getRequiredDocuments } = require('../utils/documentHelper');
const router = express.Router();

// ─── Relevance Scoring Engine ───────────────────────────────────────
function computeBusinessRelevance(scheme, filters) {
  let score = 0;
  const maxScore = 100;

  // Age match (20 points)
  if (filters.age >= scheme.min_age && filters.age <= scheme.max_age) {
    score += 20;
  }

  // Income match (25 points)
  if (filters.income >= scheme.min_income && filters.income <= scheme.max_income) {
    score += 25;
    const midIncome = (scheme.min_income + Math.min(scheme.max_income, 10000000)) / 2;
    const distanceRatio = 1 - Math.abs(filters.income - midIncome) / Math.max(midIncome, 1);
    score += Math.max(0, distanceRatio * 5);
  }

  // Business type match (25 points)
  if (scheme.business_type.includes('all') || scheme.business_type.includes(filters.businessType)) {
    score += 25;
  }

  // Investment range match (15 points)
  if (filters.investment >= scheme.min_investment && filters.investment <= scheme.max_investment) {
    score += 15;
  }

  // State match (15 points)
  if (scheme.states.includes('all') || scheme.states.includes(filters.state?.toLowerCase())) {
    score += 15;
  }

  // Keyword bonus (up to 5 extra points)
  if (filters.keywords && scheme.tags) {
    const keywords = filters.keywords.toLowerCase().split(/\s+/);
    const tagMatches = keywords.filter(kw => scheme.tags.some(tag => tag.toLowerCase().includes(kw)));
    score += Math.min(tagMatches.length * 2, 5);
  }

  return Math.min(Math.round(score), maxScore);
}

function computeEducationRelevance(scheme, filters) {
  let score = 0;
  const maxScore = 100;

  if (filters.age >= scheme.min_age && filters.age <= scheme.max_age) score += 15;

  if (scheme.education_level.includes('all') || scheme.education_level.includes(filters.educationLevel)) score += 25;

  if (scheme.category.includes('all') || scheme.category.includes(filters.category)) score += 25;

  if (filters.income >= scheme.min_income && filters.income <= scheme.max_income) {
    score += 20;
    const midIncome = (scheme.min_income + Math.min(scheme.max_income, 10000000)) / 2;
    const distanceRatio = 1 - Math.abs(filters.income - midIncome) / Math.max(midIncome, 1);
    score += Math.max(0, distanceRatio * 5);
  }

  if (scheme.field_of_study.includes('all') || scheme.field_of_study.includes(filters.fieldOfStudy?.toLowerCase())) score += 10;

  if (scheme.states.includes('all') || scheme.states.includes(filters.state?.toLowerCase())) score += 10;

  return Math.min(Math.round(score), maxScore);
}

// ─── POST /api/recommend ────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    const { category, filters } = req.body;

    if (!category || !filters) {
      return res.status(400).json({ message: 'Category and filters are required' });
    }

    let schemes = [];
    let scoredSchemes = [];

    if (category === 'business') {
      let query = supabase.from('business_schemes').select('*').eq('is_active', true);

      if (filters.businessType) {
        query = query.contains('business_type', [filters.businessType]);
      }
      if (filters.income) {
        query = query.lte('min_income', Number(filters.income)).gte('max_income', Number(filters.income));
      }

      const { data, error } = await query;
      if (error) throw error;

      schemes = data || [];
      scoredSchemes = schemes.map(scheme => ({
        ...scheme,
        relevanceScore: computeBusinessRelevance(scheme, filters)
      }));
    } else if (category === 'education') {
      let query = supabase.from('education_schemes').select('*').eq('is_active', true);

      if (filters.educationLevel) {
        query = query.contains('education_level', [filters.educationLevel]);
      }
      if (filters.category) {
        query = query.contains('category', [filters.category]);
      }
      if (filters.income) {
        query = query.lte('min_income', Number(filters.income)).gte('max_income', Number(filters.income));
      }

      const { data, error } = await query;
      if (error) throw error;

      schemes = data || [];
      scoredSchemes = schemes.map(scheme => ({
        ...scheme,
        relevanceScore: computeEducationRelevance(scheme, filters)
      }));
    } else {
      return res.status(400).json({ message: 'Invalid category. Use "business" or "education"' });
    }

    // Sort by relevance and return top results
    scoredSchemes.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Attach required documents to each scheme
    const enriched = scoredSchemes.slice(0, 5).map(scheme => ({
      ...scheme,
      requiredDocuments: getRequiredDocuments(scheme, category)
    }));

    res.json({
      category,
      totalMatches: scoredSchemes.length,
      results: enriched
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Server error during recommendation' });
  }
});

// ─── POST /api/recommend/eligibility ────────────────────────────────
// Takes questionnaire data, returns eligible schemes from both tables
router.post('/eligibility', async (req, res) => {
  try {
    const { age, income, state, category, occupation, gender, area, disability } = req.body;

    if (!supabase) {
      return res.status(503).json({ message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    const numAge = Number(age) || 25;
    const numIncome = Number(income) || 0;
    const stateVal = (state || '').toLowerCase();

    // Save to profile if authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          await supabase.from('profiles').update({
            pref_age: numAge,
            pref_income: numIncome,
            pref_state: stateVal,
            pref_category: category || '',
            pref_occupation: occupation || '',
            pref_gender: gender || '',
            pref_area: area || '',
            pref_disability: !!disability,
          }).eq('id', user.id);
        }
      } catch (e) { /* proceed without saving */ }
    }

    const results = [];

    // Business schemes
    const { data: bizData } = await supabase.from('business_schemes').select('*').eq('is_active', true);
    if (bizData) {
      for (const s of bizData) {
        const score = computeBusinessRelevance(s, {
          age: numAge, income: numIncome, state: stateVal,
          businessType: occupation === 'business' ? 'startup' : occupation || 'all',
          investment: numIncome * 0.1,
        });
        if (score >= 20) {
          results.push({ ...s, relevanceScore: score, schemeType: 'business', requiredDocuments: getRequiredDocuments(s, 'business') });
        }
      }
    }

    // Education schemes (for students or low age or all)
    const { data: eduData } = await supabase.from('education_schemes').select('*').eq('is_active', true);
    if (eduData) {
      for (const s of eduData) {
        const score = computeEducationRelevance(s, {
          age: numAge, income: numIncome, state: stateVal,
          category: category || 'all',
          educationLevel: numAge < 18 ? 'school' : numAge < 25 ? 'undergraduate' : 'postgraduate',
          fieldOfStudy: 'all',
        });
        if (score >= 20) {
          results.push({ ...s, relevanceScore: score, schemeType: 'education', requiredDocuments: getRequiredDocuments(s, 'education') });
        }
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json({
      totalMatches: results.length,
      results: results.slice(0, 15),
      profile: { age: numAge, income: numIncome, state: stateVal, category, occupation },
    });
  } catch (error) {
    console.error('Eligibility error:', error);
    res.status(500).json({ message: 'Server error during eligibility check' });
  }
});

module.exports = router;

