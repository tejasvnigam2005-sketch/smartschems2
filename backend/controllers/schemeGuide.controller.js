// SchemeGuide controller — handles document checklists and application step guides.
// Uses documentHelper and schemeGuide utilities.

const supabase = require('../config/supabase');
const { getRequiredDocuments } = require('../utils/documentHelper');
const { getApplicationGuide } = require('../utils/schemeGuide');
const {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
  sendServiceUnavailable,
} = require('../utils/responseHelper');

function resolveTable(schemeType) {
  if (schemeType === 'business') return 'business_schemes';
  if (schemeType === 'education') return 'education_schemes';
  return null;
}

async function getDocumentChecklist(req, res, next) {
  try {
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const { schemeType, id } = req.params;
    const table = resolveTable(schemeType);

    if (!table) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    const { data: scheme, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error || !scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    const documents = getRequiredDocuments(scheme, schemeType);

    return sendSuccess(res, {
      schemeId: scheme.id,
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
    if (!supabase) {
      return sendServiceUnavailable(res, 'Database not configured');
    }

    const { schemeType, id } = req.params;
    const table = resolveTable(schemeType);

    if (!table) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    const { data: scheme, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error || !scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    const steps = getApplicationGuide(scheme);

    return sendSuccess(res, {
      schemeId: scheme.id,
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
