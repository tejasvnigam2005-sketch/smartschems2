// SchemeGuide controller — handles document checklists and application step guides.
// Uses documentHelper and schemeGuide utilities.

const supabase = require('../config/supabase');
const { getRequiredDocuments } = require('../utils/documentHelper');
const { getApplicationGuide } = require('../utils/schemeGuide');
const {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
} = require('../utils/responseHelper');
const { businessSchemes: localBusinessSchemes, educationSchemes: localEducationSchemes } = require('../data/schemes');

function resolveTable(schemeType) {
  if (schemeType === 'business') return 'business_schemes';
  if (schemeType === 'education') return 'education_schemes';
  return null;
}

function findLocalScheme(schemeType, id) {
  const list = schemeType === 'business' ? localBusinessSchemes : localEducationSchemes;
  return list.find((s) => {
    const slug = s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
    return s.id === id || s._id === id || slug === id || s.name === id;
  });
}

async function getDocumentChecklist(req, res, next) {
  try {
    const { schemeType, id } = req.params;
    const table = resolveTable(schemeType);

    if (!table) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    let scheme = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        if (!error && data) scheme = data;
      } catch {
        // Fall back to local
      }
    }

    if (!scheme) {
      scheme = findLocalScheme(schemeType, id);
    }

    if (!scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    const documents = getRequiredDocuments(scheme, schemeType);

    return sendSuccess(res, {
      schemeId: scheme.id || id,
      schemeName: scheme.name,
      schemeType,
      documents,
      totalDocuments: documents.length,
    }, 'Document checklist generated');
  } catch (error) {
    next(error);
  }
}

async function getApplicationSteps(req, res, next) {
  try {
    const { schemeType, id } = req.params;
    const table = resolveTable(schemeType);

    if (!table) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    let scheme = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        if (!error && data) scheme = data;
      } catch {
        // Fall back to local
      }
    }

    if (!scheme) {
      scheme = findLocalScheme(schemeType, id);
    }

    if (!scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    const steps = getApplicationGuide(scheme);

    return sendSuccess(res, {
      schemeId: scheme.id || id,
      schemeName: scheme.name,
      schemeType,
      website: scheme.website || '',
      deadline: scheme.deadline || 'Ongoing',
      steps,
      totalSteps: steps.length,
    }, 'Application guide generated');
  } catch (error) {
    next(error);
  }
}

module.exports = { getDocumentChecklist, getApplicationSteps };
