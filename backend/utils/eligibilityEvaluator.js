// SmartSchemes Eligibility Evaluator — evaluates a user's profile against structured
// scheme criteria and returns match score, reasons, and individual criteria breakdown.

function evaluateSchemeEligibility(scheme, userProfile = {}) {
  const criteria = {
    age: true,
    income: true,
    state: true,
    gender: true,
    category: true,
    occupation: true,
  };

  const reasons = [];
  let score = 0;
  let totalApplicableWeights = 0;

  const elig = scheme.eligibility || {};
  const isStructured = typeof elig === 'object' && elig !== null && !Array.isArray(elig);

  // 1. Age Evaluation (Weight: 25)
  totalApplicableWeights += 25;
  const minAge = isStructured ? elig.minAge : (scheme.min_age ?? scheme.minAge ?? null);
  const maxAge = isStructured ? elig.maxAge : (scheme.max_age ?? scheme.maxAge ?? null);

  if (userProfile.age !== undefined && userProfile.age !== null) {
    const userAge = parseInt(userProfile.age, 10);
    if (!isNaN(userAge)) {
      if (minAge !== null && userAge < minAge) {
        criteria.age = false;
        reasons.push(`Minimum age required is ${minAge} (user is ${userAge})`);
      } else if (maxAge !== null && userAge > maxAge) {
        criteria.age = false;
        reasons.push(`Maximum age limit is ${maxAge} (user is ${userAge})`);
      } else {
        score += 25;
      }
    }
  } else {
    // If user age not provided, grant neutral score if scheme has no restriction
    if (minAge === null && maxAge === null) score += 25;
  }

  // 2. Income Evaluation (Weight: 25)
  totalApplicableWeights += 25;
  const incomeLimit = isStructured
    ? elig.incomeLimit
    : (scheme.max_income ?? scheme.maxIncome ?? null);

  if (userProfile.income !== undefined && userProfile.income !== null) {
    const userIncome = parseFloat(userProfile.income);
    if (!isNaN(userIncome)) {
      if (incomeLimit !== null && incomeLimit > 0 && userIncome > incomeLimit) {
        criteria.income = false;
        reasons.push(
          `Income limit is ₹${incomeLimit.toLocaleString('en-IN')} (user declared ₹${userIncome.toLocaleString('en-IN')})`
        );
      } else {
        score += 25;
      }
    }
  } else {
    if (incomeLimit === null) score += 25;
  }

  // 3. State Evaluation (Weight: 20)
  totalApplicableWeights += 20;
  const states = isStructured
    ? elig.states || []
    : scheme.states || [];

  if (userProfile.state) {
    const userState = userProfile.state.trim().toLowerCase();
    const isPanIndia =
      states.length === 0 ||
      states.some((s) => s.toLowerCase() === 'all' || s.toLowerCase() === 'all india');

    const stateMatch =
      isPanIndia ||
      states.some((s) => s.toLowerCase() === userState || s.toLowerCase().includes(userState));

    if (!stateMatch) {
      criteria.state = false;
      reasons.push(`Scheme restricted to: ${states.join(', ')}`);
    } else {
      score += 20;
    }
  } else {
    score += 20;
  }

  // 4. Gender Evaluation (Weight: 15)
  totalApplicableWeights += 15;
  const genders = isStructured ? elig.gender || [] : [];
  if (userProfile.gender && genders.length > 0) {
    const userGender = userProfile.gender.toUpperCase();
    const genderMatch =
      genders.includes('ALL') ||
      genders.includes(userGender) ||
      (userGender === 'FEMALE' && genders.some((g) => ['FEMALE', 'WOMEN'].includes(g))) ||
      (userGender === 'MALE' && genders.some((g) => ['MALE', 'MEN'].includes(g)));

    if (!genderMatch) {
      criteria.gender = false;
      reasons.push(`Scheme is designated for ${genders.join('/')} applicants`);
    } else {
      score += 15;
    }
  } else {
    score += 15;
  }

  // 5. Social Category (Weight: 15)
  totalApplicableWeights += 15;
  const categories = isStructured ? elig.categories || [] : (scheme.category || []);
  if (userProfile.category && categories.length > 0) {
    const userCat = userProfile.category.toUpperCase();
    const catMatch =
      categories.includes('all') ||
      categories.includes('ALL') ||
      categories.some((c) => c.toUpperCase() === userCat);

    if (!catMatch) {
      criteria.category = false;
      reasons.push(`Reserved for category: ${categories.join(', ')}`);
    } else {
      score += 15;
    }
  } else {
    score += 15;
  }

  const isEligible = Object.values(criteria).every(Boolean);
  const matchPercentage = Math.round((score / totalApplicableWeights) * 100);

  return {
    isEligible,
    matchScore: matchPercentage,
    criteria,
    reasons,
  };
}

module.exports = {
  evaluateSchemeEligibility,
};
