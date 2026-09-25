// Scheme Normalizer — extracts structured eligibility criteria and normalizes fields
// from official raw source data using deterministic, rule-based algorithms.
// NEVER invents data. If information is not explicitly found, stores null or empty array.

const crypto = require('crypto');

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Andaman and Nicobar Islands',
  'Lakshadweep',
];

// Helper: Convert currency string with Lakhs/Crores to standard integer
function parseIncomeAmount(text) {
  if (!text) return null;

  // Check for Lakhs / Lacs: e.g. "3 lakh", "2.5 lakhs", "₹ 5 Lac"
  const lakhMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(?:lakh|lac|lacs|lakhs)/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]);
    if (!isNaN(val)) return Math.round(val * 100000);
  }

  // Check for Crores: e.g. "1 crore", "₹ 2.5 Cr"
  const croreMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(?:crore|cr)/i);
  if (croreMatch) {
    const val = parseFloat(croreMatch[1]);
    if (!isNaN(val)) return Math.round(val * 10000000);
  }

  // Check for direct numeric currency: e.g. "₹2,50,000", "Rs. 15000", "50,000/-"
  const numMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  if (numMatch) {
    const cleanNum = numMatch[1].replace(/,/g, '');
    const val = parseInt(cleanNum, 10);
    if (!isNaN(val) && val > 0) return val;
  }

  return null;
}

// Helper: Extract age range from eligibility text
function extractAgeLimits(text) {
  let minAge = null;
  let maxAge = null;

  if (!text || typeof text !== 'string') return { minAge, maxAge };

  // "Between 18 and 35 years" or "from 18 to 40 years"
  const betweenMatch = text.match(/(?:between|from)\s+(\d{1,2})\s*(?:and|to|-)\s*(\d{1,2})\s*(?:years|yrs)?/i);
  if (betweenMatch) {
    minAge = parseInt(betweenMatch[1], 10);
    maxAge = parseInt(betweenMatch[2], 10);
    return { minAge, maxAge };
  }

  // "18 to 45 years" or "18-40 years"
  const rangeMatch = text.match(/\b(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*years?(?:\s*of\s*age)?/i);
  if (rangeMatch) {
    minAge = parseInt(rangeMatch[1], 10);
    maxAge = parseInt(rangeMatch[2], 10);
    return { minAge, maxAge };
  }

  // "18 years and above", "must be 18 years or older", "minimum 21 years"
  const minMatch = text.match(/(?:minimum|at least|above|must be|aged?)\s+(\d{1,2})\s*years?(?:\s*(?:or|and)\s*above)?/i);
  if (minMatch) {
    const val = parseInt(minMatch[1], 10);
    if (val >= 0 && val <= 100) minAge = val;
  }

  // "up to 35 years", "maximum 40 years", "not exceed 45 years", "below 30 years"
  const maxMatch = text.match(/(?:up\s*to|maximum|not\s*exceed(?:ing)?|below|under)\s+(\d{1,2})\s*years?/i);
  if (maxMatch) {
    const val = parseInt(maxMatch[1], 10);
    if (val >= 0 && val <= 100) maxAge = val;
  }

  return { minAge, maxAge };
}

// Helper: Extract income limit, period and type
function extractIncomeLimits(text) {
  let incomeLimit = null;
  let incomePeriod = null;
  let incomeType = null;

  if (!text || typeof text !== 'string') {
    return { incomeLimit, incomePeriod, incomeType };
  }

  // Find sentences or segments mentioning income (do not stop at decimal point in ₹2.5 lakh)
  const incomeRegex = /(?:family\s+income|annual\s+income|monthly\s+income|household\s+income|income\s+limit|income\s+ceiling|income\s+should\s+not\s+exceed|income\s+below|income\s+less\s+than)[^\n;]*/i;
  const match = text.match(incomeRegex);

  if (match) {
    const snippet = match[0];
    incomeLimit = parseIncomeAmount(snippet);

    if (incomeLimit !== null) {
      // Determine period
      if (/(?:annual|per\s*annum|per\s*year|p\.a\.)/i.test(snippet) || /annual/i.test(text)) {
        incomePeriod = 'annual';
      } else if (/(?:monthly|per\s*month|p\.m\.)/i.test(snippet)) {
        incomePeriod = 'monthly';
      } else if (incomeLimit >= 50000) {
        // Indian government income limits of 50k+ are almost always annual
        incomePeriod = 'annual';
      }

      // Determine type
      if (/family|household/i.test(snippet)) {
        incomeType = 'family';
      } else if (/applicant|individual|personal|candidate/i.test(snippet)) {
        incomeType = 'individual';
      }
    }
  }

  return { incomeLimit, incomePeriod, incomeType };
}

// Helper: Extract states from text
function extractStates(text, schemeLevel = '') {
  if (!text || typeof text !== 'string') {
    return schemeLevel.toLowerCase() === 'central' ? ['ALL'] : [];
  }

  // Check for pan-India keywords
  if (/(?:throughout\s+india|all\s+india|pan\s+india|across\s+(?:the\s+)?country|national\s+level)/i.test(text)) {
    return ['ALL'];
  }

  const matchedStates = [];
  for (const state of INDIAN_STATES) {
    const regex = new RegExp(`\\b${state.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(text)) {
      matchedStates.push(state);
    }
  }

  if (matchedStates.length > 0) {
    return matchedStates;
  }

  if (schemeLevel.toLowerCase() === 'central') {
    return ['ALL'];
  }

  return [];
}

// Helper: Extract gender restrictions
function extractGender(text) {
  if (!text || typeof text !== 'string') return [];

  const lower = text.toLowerCase();
  const genders = [];

  const hasFemale = /\b(?:women|woman|female|females|girls?|widows?|mothers?|daughter)\b/i.test(lower);
  const hasMale = /\b(?:men\s+only|male\s+only|only\s+male|only\s+men)\b/i.test(lower);
  const hasTrans = /\b(?:transgender|trans\s+person|third\s+gender)\b/i.test(lower);

  if (hasFemale && !hasMale) genders.push('FEMALE');
  if (hasMale && !hasFemale) genders.push('MALE');
  if (hasTrans) genders.push('TRANSGENDER');

  if (/\b(?:all\s+genders|men\s+and\s+women|boys\s+and\s+girls|male\s+and\s+female)\b/i.test(lower)) {
    return ['ALL'];
  }

  return genders;
}

// Helper: Extract social categories (SC, ST, OBC, General, EWS, Minority, PwD)
function extractCategories(text) {
  if (!text || typeof text !== 'string') return [];

  const categories = [];
  if (/\bSC\b|scheduled\s+caste/i.test(text)) categories.push('SC');
  if (/\bST\b|scheduled\s+tribe/i.test(text)) categories.push('ST');
  if (/\bOBC\b|other\s+backward\s+class/i.test(text)) categories.push('OBC');
  if (/\bEWS\b|economically\s+weaker\s+section/i.test(text)) categories.push('EWS');
  if (/\bBPL\b|below\s+poverty\s+line/i.test(text)) categories.push('BPL');
  if (/\bminority\b|\bminorities\b/i.test(text)) categories.push('Minority');
  if (/\b(?:pwd|divyang|disability|disabled|handicapped)\b/i.test(text)) categories.push('Divyang/PwD');

  return [...new Set(categories)];
}

// Helper: Extract education levels
function extractEducationLevels(text) {
  if (!text || typeof text !== 'string') return [];

  const levels = [];
  if (/\b10th\b|matric|secondary\s+school/i.test(text)) levels.push('10th Pass');
  if (/\b12th\b|intermediate|higher\s+secondary/i.test(text)) levels.push('12th Pass');
  if (/\bdiploma\b/i.test(text)) levels.push('Diploma');
  if (/\bgraduate\b|\bbachelor\b|\bdegree\b/i.test(text)) levels.push('Graduate');
  if (/\bpost\s*graduate\b|\bmaster/i.test(text)) levels.push('Post Graduate');
  if (/\bph\.?d\b|\bdoctorate\b/i.test(text)) levels.push('Doctorate');
  if (/\biti\b/i.test(text)) levels.push('ITI');

  return [...new Set(levels)];
}

// Helper: Extract occupations
function extractOccupations(text) {
  if (!text || typeof text !== 'string') return [];

  const occupations = [];
  if (/\bfarmer|cultivator|agriculture|kisan\b/i.test(text)) occupations.push('Farmer');
  if (/\bartisan|craftsperson|handicraft\b/i.test(text)) occupations.push('Artisan');
  if (/\bweaver\b/i.test(text)) occupations.push('Weaver');
  if (/\bstudent|scholar\b/i.test(text)) occupations.push('Student');
  if (/\bunemployed|job\s*seeker\b/i.test(text)) occupations.push('Unemployed');
  if (/\bfisherman|fisheries\b/i.test(text)) occupations.push('Fisherman');
  if (/\bstreet\s+vendor|hawker\b/i.test(text)) occupations.push('Street Vendor');
  if (/\bconstruction\s+worker\b/i.test(text)) occupations.push('Construction Worker');
  if (/\bteacher|faculty\b/i.test(text)) occupations.push('Teacher/Faculty');

  return [...new Set(occupations)];
}

// Helper: Extract business types
function extractBusinessTypes(text) {
  if (!text || typeof text !== 'string') return [];

  const types = [];
  if (/\bmsme\b/i.test(text)) types.push('MSME');
  if (/\bstartup|start-up\b/i.test(text)) types.push('Startup');
  if (/\bmicro\s+enterprise\b/i.test(text)) types.push('Micro Enterprise');
  if (/\bsmall\s+business|small\s+enterprise\b/i.test(text)) types.push('Small Business');
  if (/\bshg\b|self\s*help\s*group/i.test(text)) types.push('Self Help Group');
  if (/\bcooperative|society\b/i.test(text)) types.push('Cooperative');

  return [...new Set(types)];
}

// Helper: Split raw text into clean array of list items
function splitTextToList(text) {
  if (!text) return [];
  if (Array.isArray(text)) return text.map((t) => String(t).trim()).filter(Boolean);

  return text
    .split(/(?:\r?\n|•|\*\s+|\d+\.\s+|;\s*)+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

// Helper: Slugify title
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Compute SHA-256 hash for content change detection
function computeContentHash(obj) {
  const content = JSON.stringify({
    name: (obj.name || obj.scheme_name || '').trim().toLowerCase(),
    details: (obj.details || obj.description || '').trim(),
    eligibility: typeof obj.eligibility === 'string' ? obj.eligibility.trim() : (obj.eligibility?.rawText || '').trim(),
    benefits: Array.isArray(obj.benefits) ? obj.benefits.join('|') : String(obj.benefits || ''),
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Main normalization function: accepts raw item from any source adapter and produces
 * a standard, structured Scheme document matching SmartSchemes architecture.
 */
function normalizeSchemeData(rawItem, sourceMetadata = {}) {
  const name = (rawItem.name || rawItem.scheme_name || rawItem.title || rawItem.Scheme_Name || '').trim();
  const rawDetails = (rawItem.details || rawItem.description || rawItem.Scheme_Details || rawItem.summary || '').trim();
  const rawEligibility = (
    typeof rawItem.eligibility === 'string'
      ? rawItem.eligibility
      : rawItem.eligibility?.rawText || rawItem.Eligibility_Criteria || ''
  ).trim();

  const combinedText = `${rawEligibility} ${rawDetails}`;

  const { minAge, maxAge } = extractAgeLimits(rawEligibility || combinedText);
  const { incomeLimit, incomePeriod, incomeType } = extractIncomeLimits(rawEligibility || combinedText);
  const states = extractStates(rawEligibility || combinedText, rawItem.level || rawItem.schemeType);
  const gender = extractGender(rawEligibility || combinedText);
  const categories = extractCategories(rawEligibility || combinedText);
  const educationLevels = extractEducationLevels(rawEligibility || combinedText);
  const occupations = extractOccupations(rawEligibility || combinedText);
  const businessTypes = extractBusinessTypes(rawEligibility || combinedText);

  const benefitsArray = Array.isArray(rawItem.benefits)
    ? rawItem.benefits
    : splitTextToList(rawItem.benefits || rawItem.Benefits);

  const documentsArray = Array.isArray(rawItem.documentsRequired)
    ? rawItem.documentsRequired
    : splitTextToList(rawItem.documents || rawItem.documentsRequired || rawItem.Documents_Required);

  const applicationProcess = (
    rawItem.applicationProcess ||
    rawItem.application ||
    rawItem.Application_Process ||
    ''
  ).trim();

  const structured = {
    name,
    scheme_name: name,
    slug: rawItem.slug || slugify(name),
    shortDescription: (rawItem.shortDescription || rawDetails.slice(0, 200) + (rawDetails.length > 200 ? '…' : '')).trim(),
    description: rawDetails,
    details: rawDetails,
    ministry: (rawItem.ministry || rawItem.Ministry || rawItem.ministry_name || '').trim(),
    department: (rawItem.department || rawItem.Department || '').trim(),
    schemeType: (rawItem.schemeType || rawItem.level || (states.includes('ALL') ? 'Central' : 'State')).trim(),
    level: (rawItem.level || (states.includes('ALL') ? 'Central' : 'State')).trim(),
    schemeCategory: (rawItem.schemeCategory || rawItem.category || rawItem.Category || 'General').trim(),
    tags: Array.isArray(rawItem.tags)
      ? rawItem.tags
      : splitTextToList(rawItem.tags || '').map((t) => t.trim()),
    eligibility: {
      rawText: rawEligibility,
      minAge,
      maxAge,
      incomeLimit,
      incomePeriod,
      incomeType,
      gender,
      categories,
      educationLevels,
      occupations,
      businessTypes,
      states,
      districts: Array.isArray(rawItem.districts) ? rawItem.districts : [],
    },
    benefits: benefitsArray,
    benefitsList: benefitsArray,
    documentsRequired: documentsArray,
    documents: documentsArray.join(', '),
    applicationProcess,
    application: applicationProcess,
    applicationUrl: (rawItem.applicationUrl || rawItem.apply_url || '').trim(),
    officialUrl: (rawItem.officialUrl || rawItem.website || rawItem.portal_url || '').trim(),
    source: {
      name: sourceMetadata.name || rawItem.source?.name || 'Government Portal',
      url: sourceMetadata.url || rawItem.source?.url || '',
      datasetId: sourceMetadata.datasetId || rawItem.source?.datasetId || null,
      retrievedAt: new Date(),
    },
    status: 'active',
    lastVerifiedAt: new Date(),
    ingestionMetadata: {
      sourceIdentifier: rawItem.id || rawItem.identifier || rawItem.slug || slugify(name),
      contentHash: '',
      isLLMProcessed: false,
      llmModel: null,
    },
  };

  structured.ingestionMetadata.contentHash = computeContentHash(structured);
  return structured;
}

module.exports = {
  normalizeSchemeData,
  extractAgeLimits,
  extractIncomeLimits,
  extractStates,
  extractGender,
  extractCategories,
  extractEducationLevels,
  extractOccupations,
  extractBusinessTypes,
  computeContentHash,
  slugify,
};
