// MySchemeAdapter — Ingestion adapter for myScheme (myscheme.gov.in).
// STRICT POLICY: Does NOT perform unauthorized HTML scraping or bypass anti-bot mechanisms.
// Designed with a pluggable architecture for authorized partner APIs, government feeds,
// or officially provided structured datasets.

const fs = require('fs');
const BaseAdapter = require('./BaseAdapter');
const logger = require('../../utils/logger');

class MySchemeAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('myScheme', 'https://www.myscheme.gov.in');
    this.apiUrl = config.apiUrl || process.env.MYSCHEME_API_URL || null;
    this.apiKey = config.apiKey || process.env.MYSCHEME_API_KEY || null;
  }

  getSourceInfo() {
    return {
      name: 'myScheme',
      portalUrl: 'https://www.myscheme.gov.in',
      isAuthorizedEndpointConfigured: Boolean(this.apiUrl),
      scrapingAllowed: false,
      accessPolicy: 'Authorized Partner API / Permitted Structured Feed only (No unauthorized scraping)',
    };
  }

  /**
   * Fetches raw schemes from myScheme authorized endpoints.
   */
  async fetchRawSchemes(options = {}) {
    const limit = Math.max(1, Math.min(options.limit || 20, 500));

    // 1. Authorized API endpoint (when officially provided)
    if (this.apiUrl) {
      try {
        logger.info('MySchemeAdapter', `Connecting to authorized myScheme feed: ${this.apiUrl}`);
        const headers = {};
        if (this.apiKey) {
          headers['Authorization'] = `Bearer ${this.apiKey}`;
          headers['x-api-key'] = this.apiKey;
        }

        const response = await this.safeFetch(this.apiUrl, { headers });
        const data = await response.json();
        const records = Array.isArray(data) ? data : data.schemes || data.data || [];

        return records.slice(0, limit).map((record) => ({
          rawItem: record,
          sourceMetadata: {
            name: 'myScheme',
            url: record.officialUrl || 'https://www.myscheme.gov.in',
            datasetId: record.id || 'MYSCHEME-AUTHORIZED-FEED',
            retrievedAt: new Date(),
          },
        }));
      } catch (err) {
        logger.error('MySchemeAdapter', 'Authorized myScheme feed retrieval failed', {
          error: err.message,
        });
        throw err;
      }
    }

    // 2. Permitted pre-exported feed file (if explicitly passed in options)
    if (options.file && fs.existsSync(options.file)) {
      const content = fs.readFileSync(options.file, 'utf8');
      const data = JSON.parse(content);
      const records = Array.isArray(data) ? data : data.schemes || [];
      return records.slice(0, limit).map((record) => ({
        rawItem: record,
        sourceMetadata: {
          name: 'myScheme',
          url: record.officialUrl || 'https://www.myscheme.gov.in',
          datasetId: record.id || 'MYSCHEME-FILE-EXPORT',
          retrievedAt: new Date(),
        },
      }));
    }

    // 3. Fallback when unconfigured: adhere to legal restrictions, do NOT scrape
    const msg =
      'myScheme does not provide an open unauthenticated developer API. In compliance with portal terms, SmartSchemes does not scrape myscheme.gov.in without authorization. Configure MYSCHEME_API_URL / MYSCHEME_API_KEY in .env or provide an authorized dataset feed.';
    logger.warn('MySchemeAdapter', msg);
    return [];
  }
}

module.exports = MySchemeAdapter;
