// Recommend controller — handles scheme recommendation and eligibility scoring.
// Uses the relevance engine and document helper utilities.

const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const { computeBusinessRelevance, computeEducationRelevance } = require('../utils/relevanceEngine');
const { getRequiredDocuments } = require('../utils/documentHelper');
const { sendSuccess, sendBadRequest, sendServiceUnavailable } = require('../utils/responseHelper');
const { eligibilitySchema, formatZodError } = require('../validators/schemas');

async function recommend(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const { category, filters } = req.body;

    if (!category || !filters) {
      return sendBadRequest(res, 'Category and filters are required');
    }

    if (filters.businessType) filters.businessType = filters.businessType.toLowerCase();
    if (filters.state) filters.state = filters.state.toLowerCase();
    if (filters.educationLevel) filters.educationLevel = filters.educationLevel.toLowerCase();
    if (filters.category) filters.category = filters.category.toLowerCase();
    if (filters.fieldOfStudy) filters.fieldOfStudy = filters.fieldOfStudy.toLowerCase();

    let scoredSchemes = [];

    if (category === 'business') {
      let query = supabase.from('business_schemes').select('*').eq('is_active', true);
      if (filters.businessType) query = query.contains('business_type', [filters.businessType]);
      if (filters.income) {
        query = query.lte('min_income', Number(filters.income)).gte('max_income', Number(filters.income));
      }

      const { data, error } = await query;
      if (error) throw error;

      scoredSchemes = (data || []).map((scheme) => ({
        ...scheme,
        relevanceScore: computeBusinessRelevance(scheme, filters),
      }));
    } else if (category === 'education') {
      let query = supabase.from('education_schemes').select('*').eq('is_active', true);
      if (filters.educationLevel) query = query.contains('education_level', [filters.educationLevel]);
      if (filters.category) query = query.contains('category', [filters.category]);
      if (filters.income) {
        query = query.lte('min_income', Number(filters.income)).gte('max_income', Number(filters.income));
      }

      const { data, error } = await query;
      if (error) throw error;

      scoredSchemes = (data || []).map((scheme) => ({
        ...scheme,
        relevanceScore: computeEducationRelevance(scheme, filters),
      }));
    } else {
      return sendBadRequest(res, 'Invalid category. Use "business" or "education"');
    }

    scoredSchemes.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const enriched = scoredSchemes.slice(0, 5).map((scheme) => ({
      ...scheme,
      requiredDocuments: getRequiredDocuments(scheme, category),
    }));

    return sendSuccess(res, {
      category,
      totalMatches: scoredSchemes.length,
      results: enriched,
    }, 'Recommendations generated');
  } catch (error) {
    next(error);
  }
}

async function checkEligibility(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const parsed = eligibilitySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { age, income, state, category, occupation, gender, area, disability } = parsed.data;

    const numAge = age;
    const numIncome = income;
    const stateVal = state.toLowerCase();

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
      } catch (profileError) {
        logger.warn('Recommend', 'Failed to save profile preferences', { error: profileError.message });
      }
    }

    const results = [];

    const { data: bizData } = await supabase.from('business_schemes').select('*').eq('is_active', true);
    if (bizData) {
      for (const s of bizData) {
        const score = computeBusinessRelevance(s, {
          age: numAge,
          income: numIncome,
          state: stateVal,
          businessType: occupation === 'business' ? 'startup' : occupation || 'all',
          investment: numIncome * 0.1,
        });
        if (score >= 20) {
          results.push({
            ...s,
            relevanceScore: score,
            schemeType: 'business',
            requiredDocuments: getRequiredDocuments(s, 'business'),
          });
        }
      }
    }

    const { data: eduData } = await supabase.from('education_schemes').select('*').eq('is_active', true);
    if (eduData) {
      for (const s of eduData) {
        const score = computeEducationRelevance(s, {
          age: numAge,
          income: numIncome,
          state: stateVal,
          category: category || 'all',
          educationLevel: numAge < 18 ? 'school' : numAge < 25 ? 'undergraduate' : 'postgraduate',
          fieldOfStudy: 'all',
        });
        if (score >= 20) {
          results.push({
            ...s,
            relevanceScore: score,
            schemeType: 'education',
            requiredDocuments: getRequiredDocuments(s, 'education'),
          });
        }
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return sendSuccess(res, {
      totalMatches: results.length,
      results: results.slice(0, 15),
      profile: { age: numAge, income: numIncome, state: stateVal, category, occupation },
    }, 'Eligibility check completed');
  } catch (error) {
    next(error);
  }
}

module.exports = { recommend, checkEligibility };
