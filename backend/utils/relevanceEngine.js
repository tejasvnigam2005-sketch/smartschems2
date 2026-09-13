// Relevance scoring engine — computes match scores for scheme recommendations.
// Extracted from routes/recommend.js to keep route handlers thin.

const MAX_SCORE = 100;
const MAX_INCOME_CAP = 10000000;

function computeBusinessRelevance(scheme, filters) {
  let score = 0;

  if (filters.age >= scheme.min_age && filters.age <= scheme.max_age) {
    score += 20;
  }

  if (filters.income >= scheme.min_income && filters.income <= scheme.max_income) {
    score += 25;
    const midIncome = (scheme.min_income + Math.min(scheme.max_income, MAX_INCOME_CAP)) / 2;
    const distanceRatio = 1 - Math.abs(filters.income - midIncome) / Math.max(midIncome, 1);
    score += Math.max(0, distanceRatio * 5);
  }

  const bizTypes = scheme.business_type || [];
  if (bizTypes.includes('all') || bizTypes.includes(filters.businessType)) {
    score += 25;
  }

  if (filters.investment >= scheme.min_investment && filters.investment <= scheme.max_investment) {
    score += 15;
  }

  const bizStates = scheme.states || [];
  if (bizStates.includes('all') || bizStates.includes(filters.state?.toLowerCase())) {
    score += 15;
  }

  if (filters.keywords && scheme.tags) {
    const keywords = filters.keywords.toLowerCase().split(/\s+/);
    const tagMatches = keywords.filter((kw) =>
      scheme.tags.some((tag) => tag.toLowerCase().includes(kw))
    );
    score += Math.min(tagMatches.length * 2, 5);
  }

  return Math.min(Math.round(score), MAX_SCORE);
}

function computeEducationRelevance(scheme, filters) {
  let score = 0;

  if (filters.age >= scheme.min_age && filters.age <= scheme.max_age) {
    score += 15;
  }

  const eduLevels = scheme.education_level || [];
  if (eduLevels.includes('all') || eduLevels.includes(filters.educationLevel)) {
    score += 25;
  }

  const eduCategories = scheme.category || [];
  if (eduCategories.includes('all') || eduCategories.includes(filters.category)) {
    score += 25;
  }

  if (filters.income >= scheme.min_income && filters.income <= scheme.max_income) {
    score += 20;
    const midIncome = (scheme.min_income + Math.min(scheme.max_income, MAX_INCOME_CAP)) / 2;
    const distanceRatio = 1 - Math.abs(filters.income - midIncome) / Math.max(midIncome, 1);
    score += Math.max(0, distanceRatio * 5);
  }

  const fields = scheme.field_of_study || [];
  if (fields.includes('all') || fields.includes(filters.fieldOfStudy?.toLowerCase())) {
    score += 10;
  }

  const eduStates = scheme.states || [];
  if (eduStates.includes('all') || eduStates.includes(filters.state?.toLowerCase())) {
    score += 10;
  }

  return Math.min(Math.round(score), MAX_SCORE);
}

module.exports = { computeBusinessRelevance, computeEducationRelevance };
