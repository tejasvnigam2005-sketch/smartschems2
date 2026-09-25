// SchemeGuide controller — handles document checklists and application step guides.
// ┌─────────────────────────────────────────────────────────────┐
// │  DATA SOURCE: MongoDB Atlas (Scheme) with local fallback    │
// └─────────────────────────────────────────────────────────────┘

const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const { getRequiredDocuments } = require('../utils/documentHelper');
const { getApplicationGuide } = require('../utils/schemeGuide');
const {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
} = require('../utils/responseHelper');
const { businessSchemes: localBusinessSchemes, educationSchemes: localEducationSchemes } = require('../data/schemes');

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

    if (!['business', 'education'].includes(schemeType)) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    let scheme = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        scheme = await Scheme.findById(id).lean();
      }
      if (!scheme) {
        scheme = await Scheme.findOne({ $or: [{ slug: id }, { name: id }, { scheme_name: id }] }).lean();
      }
    }

    if (!scheme) {
      scheme = findLocalScheme(schemeType, id);
    }

    if (!scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    let documents;
    if (scheme.documents && typeof scheme.documents === 'string' && scheme.documents.trim()) {
      documents = scheme.documents
        .split(/[,;\n]+/)
        .map((d) => d.trim())
        .filter(Boolean);
    } else if (Array.isArray(scheme.documentsRequired) && scheme.documentsRequired.length) {
      documents = scheme.documentsRequired;
    } else {
      documents = getRequiredDocuments(scheme, schemeType);
    }

    return sendSuccess(res, {
      schemeId: scheme._id || scheme.id || id,
      schemeName: scheme.scheme_name || scheme.name,
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

    if (!['business', 'education'].includes(schemeType)) {
      return sendBadRequest(res, 'Invalid scheme type. Use "business" or "education"');
    }

    let scheme = null;
    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        scheme = await Scheme.findById(id).lean();
      }
      if (!scheme) {
        scheme = await Scheme.findOne({ $or: [{ slug: id }, { name: id }, { scheme_name: id }] }).lean();
      }
    }

    if (!scheme) {
      scheme = findLocalScheme(schemeType, id);
    }

    if (!scheme) {
      return sendNotFound(res, 'Scheme not found');
    }

    let steps;
    const rawApp = scheme.applicationProcess || scheme.application;
    if (rawApp && typeof rawApp === 'string' && rawApp.trim()) {
      const raw = rawApp.trim();
      if (/step\s*\d/i.test(raw)) {
        steps = raw.split(/step\s*\d+\s*:\s*/i).filter(Boolean).map((s) => s.trim());
      } else {
        steps = raw.split(/\.\s+/).filter(Boolean).map((s) => s.trim() + (s.endsWith('.') ? '' : '.'));
      }
    } else {
      steps = getApplicationGuide(scheme);
    }

    return sendSuccess(res, {
      schemeId: scheme._id || scheme.id || id,
      schemeName: scheme.scheme_name || scheme.name,
      schemeType,
      website: scheme.officialUrl || scheme.website || '',
      deadline: scheme.deadline || 'Ongoing',
      steps,
      totalSteps: steps.length,
    }, 'Application guide generated');
  } catch (error) {
    next(error);
  }
}

module.exports = { getDocumentChecklist, getApplicationSteps };
