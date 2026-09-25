// IndiaGovAdapter — Ingestion adapter for National Portal of India (india.gov.in).
// Accesses official open catalogs, feeds, or authorized dataset exports.
// Respects national portal guidelines and does not bypass technical controls.

const fs = require('fs');
const BaseAdapter = require('./BaseAdapter');
const logger = require('../../utils/logger');

class IndiaGovAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('India.gov.in', 'https://www.india.gov.in');
    this.feedUrl = config.feedUrl || process.env.INDIAGOV_FEED_URL || null;
  }

  getSourceInfo() {
    return {
      name: 'India.gov.in',
      portalUrl: 'https://www.india.gov.in',
      type: 'official_national_portal',
      feedConfigured: Boolean(this.feedUrl),
    };
  }

  /**
   * Fetches raw schemes from india.gov.in feeds or permitted exports.
   */
  async fetchRawSchemes(options = {}) {
    const limit = Math.max(1, Math.min(options.limit || 20, 500));

    // 1. Configured official feed URL
    if (this.feedUrl) {
      try {
        logger.info('IndiaGovAdapter', `Fetching official feed: ${this.feedUrl}`);
        const response = await this.safeFetch(this.feedUrl);
        const data = await response.json();
        const records = Array.isArray(data) ? data : data.schemes || data.items || [];

        return records.slice(0, limit).map((record) => ({
          rawItem: record,
          sourceMetadata: {
            name: 'India.gov.in',
            url: record.officialUrl || 'https://www.india.gov.in/my-government/schemes',
            datasetId: record.id || 'INDIAGOV-FEED',
            retrievedAt: new Date(),
          },
        }));
      } catch (err) {
        logger.error('IndiaGovAdapter', 'Feed fetch failed', { error: err.message });
        throw err;
      }
    }

    // 2. Local permitted structured file
    if (options.file && fs.existsSync(options.file)) {
      const content = fs.readFileSync(options.file, 'utf8');
      const data = JSON.parse(content);
      const records = Array.isArray(data) ? data : data.schemes || [];
      return records.slice(0, limit).map((record) => ({
        rawItem: record,
        sourceMetadata: {
          name: 'India.gov.in',
          url: record.officialUrl || 'https://www.india.gov.in/my-government/schemes',
          datasetId: record.id || 'INDIAGOV-CATALOG',
          retrievedAt: new Date(),
        },
      }));
    }

    logger.info('IndiaGovAdapter', 'No INDIAGOV_FEED_URL configured; awaiting official feed endpoint.');
    return [];
  }
}

module.exports = IndiaGovAdapter;
