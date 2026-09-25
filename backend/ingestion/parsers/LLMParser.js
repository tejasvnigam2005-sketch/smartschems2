// Optional LLM Extractor — leverages Google Gemini for extracting structured criteria
// from difficult or highly ambiguous unstructured text ONLY when configured.
// Application works 100% deterministically if GEMINI_API_KEY is omitted.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../../utils/logger');
const { structuredEligibilitySchema } = require('../validators/SchemeValidator');

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    logger.warn('LLMParser', 'Failed to initialize GoogleGenerativeAI', { error: err.message });
  }
}

/**
 * Checks if LLM extraction is configured and available.
 */
function isLLMAvailable() {
  return Boolean(genAI && process.env.GEMINI_API_KEY);
}

/**
 * Extracts structured fields from unstructured text using Gemini.
 * Strictly forbids hallucinating or inventing missing values.
 */
async function extractWithLLM(text, existingNormalizedData = {}) {
  if (!isLLMAvailable() || !text || text.trim().length < 20) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Minimal temperature for deterministic extraction
      },
    });

    const prompt = `You are a strict data extraction parser for official Indian government schemes.
Your task is to extract eligibility criteria from the following text into JSON.
DO NOT INVENT, INFER OR HALLUCINATE ANY VALUES.
If an age limit or income ceiling is not explicitly stated in the text, use null.
If categories, genders, states, or occupations are not explicitly stated, use empty arrays [].
Preserve the exact facts.

Original Eligibility Text:
"${text.slice(0, 3000)}"

Return ONLY a valid JSON object matching this schema:
{
  "minAge": number or null,
  "maxAge": number or null,
  "incomeLimit": number or null (in Indian Rupees, e.g. 300000 for 3 lakh),
  "incomePeriod": "annual" or "monthly" or null,
  "incomeType": "family" or "individual" or null,
  "gender": array of strings (e.g. ["FEMALE"] or ["MALE"] or ["ALL"] or []),
  "categories": array of strings (e.g. ["SC", "ST", "OBC", "General", "EWS", "Minority"] or []),
  "educationLevels": array of strings (e.g. ["10th Pass", "Graduate"] or []),
  "occupations": array of strings (e.g. ["Farmer", "Artisan"] or []),
  "businessTypes": array of strings (e.g. ["MSME", "Startup"] or []),
  "states": array of strings (e.g. ["ALL"] or specific state names or [])
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    // Validate that the LLM output conforms to our rules
    return {
      minAge: typeof parsed.minAge === 'number' && parsed.minAge >= 0 && parsed.minAge <= 120 ? parsed.minAge : existingNormalizedData.eligibility?.minAge ?? null,
      maxAge: typeof parsed.maxAge === 'number' && parsed.maxAge >= 0 && parsed.maxAge <= 120 ? parsed.maxAge : existingNormalizedData.eligibility?.maxAge ?? null,
      incomeLimit: typeof parsed.incomeLimit === 'number' && parsed.incomeLimit > 0 ? parsed.incomeLimit : existingNormalizedData.eligibility?.incomeLimit ?? null,
      incomePeriod: ['annual', 'monthly'].includes(parsed.incomePeriod) ? parsed.incomePeriod : existingNormalizedData.eligibility?.incomePeriod ?? null,
      incomeType: ['family', 'individual'].includes(parsed.incomeType) ? parsed.incomeType : existingNormalizedData.eligibility?.incomeType ?? null,
      gender: Array.isArray(parsed.gender) ? parsed.gender : existingNormalizedData.eligibility?.gender ?? [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : existingNormalizedData.eligibility?.categories ?? [],
      educationLevels: Array.isArray(parsed.educationLevels) ? parsed.educationLevels : existingNormalizedData.eligibility?.educationLevels ?? [],
      occupations: Array.isArray(parsed.occupations) ? parsed.occupations : existingNormalizedData.eligibility?.occupations ?? [],
      businessTypes: Array.isArray(parsed.businessTypes) ? parsed.businessTypes : existingNormalizedData.eligibility?.businessTypes ?? [],
      states: Array.isArray(parsed.states) ? parsed.states : existingNormalizedData.eligibility?.states ?? [],
    };
  } catch (error) {
    logger.warn('LLMParser', 'LLM extraction failed, falling back to deterministic parser', {
      error: error.message,
    });
    return null;
  }
}

module.exports = {
  isLLMAvailable,
  extractWithLLM,
};
