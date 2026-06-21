// Recommend controller — handles scheme recommendation and eligibility scoring.
// Uses the relevance engine and document helper utilities.
// Falls back to local seed data when Supabase is unavailable.

const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const { computeBusinessRelevance, computeEducationRelevance } = require('../utils/relevanceEngine');
const { getRequiredDocuments } = require('../utils/documentHelper');
const { sendSuccess, sendBadRequest, sendServiceUnavailable } = require('../utils/responseHelper');
const { eligibilitySchema, recommendSchema, formatZodError } = require('../validators/schemas');
const { businessSchemes: localBusinessSchemes, educationSchemes: localEducationSchemes } = require('../data/schemes');

// Normalize camelCase seed data to snake_case matching Supabase column names
function normalizeScheme(s) {
  // If already has snake_case keys (from Supabase), return as-is
  if ('min_age' in s) return s;
  return {
    ...s,
    min_age: s.minAge,
    max_age: s.maxAge,
    min_income: s.minIncome,
    max_income: s.maxIncome,
    business_type: s.businessType || [],
    min_investment: s.minInvestment,
    max_investment: s.maxInvestment,
    education_level: s.educationLevel || [],
    field_of_study: s.fieldOfStudy || [],
    scholarship_amount: s.scholarshipAmount || '',
    funding_amount: s.fundingAmount || '',
    application_process: s.applicationProcess || [],
    is_active: true,
  };
}

// Helper: fetch schemes from Supabase, fall back to local seed data
async function fetchSchemes(table, localData) {
  if (!supabase) return localData.map(normalizeScheme);
  try {
    const { data, error } = await supabase.from(table).select('*').eq('is_active', true);
    if (error) throw error;
    return data && data.length > 0 ? data : localData.map(normalizeScheme);
  } catch (err) {
    logger.warn('Recommend', `Supabase unavailable for ${table}, using local data`, { error: err.message });
    return localData.map(normalizeScheme);
  }
}

async function recommend(req, res, next) {
  try {
    const parsed = recommendSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { category, filters } = parsed.data;

    if (filters.businessType) filters.businessType = filters.businessType.toLowerCase();
    if (filters.state) filters.state = filters.state.toLowerCase();
    if (filters.educationLevel) filters.educationLevel = filters.educationLevel.toLowerCase();
    if (filters.category) filters.category = filters.category.toLowerCase();
    if (filters.fieldOfStudy) filters.fieldOfStudy = filters.fieldOfStudy.toLowerCase();

    let scoredSchemes = [];

    if (category === 'business') {
      const schemes = await fetchSchemes('business_schemes', localBusinessSchemes);
      scoredSchemes = schemes.map((scheme) => ({
        ...scheme,
        relevanceScore: computeBusinessRelevance(scheme, filters),
      }));
    } else if (category === 'education') {
      const schemes = await fetchSchemes('education_schemes', localEducationSchemes);
      scoredSchemes = schemes.map((scheme) => ({
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
    const parsed = eligibilitySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendBadRequest(res, formatZodError(parsed.error));
    }

    const { age, income, state, category, occupation, gender, area, disability } = parsed.data;

    const numAge = age;
    const numIncome = income;
    const stateVal = state.toLowerCase();

    // Optionally save preferences if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token && supabase) {
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

    const bizData = await fetchSchemes('business_schemes', localBusinessSchemes);
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

    const eduData = await fetchSchemes('education_schemes', localEducationSchemes);
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
