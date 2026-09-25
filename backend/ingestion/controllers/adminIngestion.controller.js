// Admin Ingestion Controller — handles HTTP endpoints for scheme data ingestion,
// source inspection, and data quality monitoring.

const IngestionPipeline = require('../services/IngestionPipeline');
const DataQualityService = require('../services/DataQualityService');
const { sendSuccess, sendBadRequest, sendError } = require('../../utils/responseHelper');
const logger = require('../../utils/logger');

async function importSchemes(req, res, next) {
  try {
    const { source = 'datagov', limit = 20, dryRun = false, useLLM = false, resourceId } = req.body;

    // Validate limit
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 500) {
      return sendBadRequest(res, 'Limit must be a positive integer between 1 and 500');
    }

    // Validate source name
    const validSources = ['datagov', 'data.gov.in', 'myscheme', 'myscheme.gov.in', 'indiagov', 'india.gov.in', 'local', 'kaggle'];
    if (!validSources.includes(source.toLowerCase())) {
      return sendBadRequest(
        res,
        `Invalid source '${source}'. Supported sources: datagov, myscheme, indiagov, local`
      );
    }

    const result = await IngestionPipeline.run({
      source,
      limit: parsedLimit,
      dryRun: Boolean(dryRun),
      useLLM: Boolean(useLLM),
      resourceId,
    });

    return sendSuccess(res, result, `Successfully processed ingestion from ${result.source}`);
  } catch (error) {
    logger.error('AdminIngestion', 'Import failed', { error: error.message });
    return sendError(res, error.message, 500);
  }
}

async function getDataQualityReport(_req, res, next) {
  try {
    const report = await DataQualityService.getQualityReport();
    return sendSuccess(res, report, 'Data quality report retrieved');
  } catch (error) {
    logger.error('AdminIngestion', 'Failed to generate data quality report', { error: error.message });
    return sendError(res, error.message, 500);
  }
}

async function getAvailableSources(_req, res) {
  try {
    const sources = [
      {
        key: 'datagov',
        name: 'Open Government Data Platform India (data.gov.in)',
        url: 'https://data.gov.in',
        accessMethod: 'Official OGD REST API & OGPL-India catalogs',
        terms: 'Government Open Data License – India (OGPL)',
        status: 'active',
        apiKeyConfigured: Boolean(process.env.DATA_GOV_IN_API_KEY),
      },
      {
        key: 'myscheme',
        name: 'myScheme (myscheme.gov.in)',
        url: 'https://www.myscheme.gov.in',
        accessMethod: 'Authorized Partner API / Permitted structured feed (No unauthorized scraping)',
        terms: 'Requires MYSCHEME_API_URL / MYSCHEME_API_KEY partner credentials',
        status: process.env.MYSCHEME_API_URL ? 'active' : 'awaiting_partner_credentials',
        apiKeyConfigured: Boolean(process.env.MYSCHEME_API_KEY),
      },
      {
        key: 'indiagov',
        name: 'National Portal of India (india.gov.in)',
        url: 'https://www.india.gov.in',
        accessMethod: 'Official RSS / Open catalogs',
        terms: 'National Portal of India open terms',
        status: process.env.INDIAGOV_FEED_URL ? 'active' : 'awaiting_feed_url',
        apiKeyConfigured: false,
      },
      {
        key: 'local',
        name: 'Verified Government Scheme Dataset (Local / Kaggle)',
        url: 'local://verified_data',
        accessMethod: 'Local structured CSV / JSON file',
        terms: 'Research & Open Database License',
        status: 'active',
        apiKeyConfigured: false,
      },
    ];

    return sendSuccess(res, { sources }, 'Available ingestion sources');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  importSchemes,
  getDataQualityReport,
  getAvailableSources,
};
