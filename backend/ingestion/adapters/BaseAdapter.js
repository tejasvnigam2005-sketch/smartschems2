// Base Source Adapter — Abstract base class for all government scheme source adapters.
// Enforces security constraints, domain validation, and common retrieval interfaces.

const { ALLOWED_GOV_DOMAINS } = require('../validators/SchemeValidator');

class BaseAdapter {
  constructor(name, defaultUrl = '') {
    if (new.target === BaseAdapter) {
      throw new TypeError('Cannot construct BaseAdapter instances directly');
    }
    this.name = name;
    this.defaultUrl = defaultUrl;
  }

  getName() {
    return this.name;
  }

  getSourceInfo() {
    return {
      name: this.name,
      url: this.defaultUrl,
      type: 'official_government_source',
    };
  }

  /**
   * Validates that an outbound request target is an authorized government domain.
   */
  validateSourceUrl(targetUrl) {
    if (!targetUrl) return true;
    try {
      const parsed = new URL(targetUrl);
      const host = parsed.hostname.toLowerCase();
      const isAllowed = ALLOWED_GOV_DOMAINS.some(
        (domain) => host === domain || host.endsWith('.' + domain)
      );

      if (!isAllowed) {
        throw new Error(
          `Security violation: Target domain '${host}' is not in the authorized government domain whitelist`
        );
      }
      return true;
    } catch (err) {
      throw new Error(`Invalid source URL: ${err.message}`);
    }
  }

  /**
   * Standard fetch helper with timeout and government-compliant user agent.
   */
  async safeFetch(url, options = {}) {
    this.validateSourceUrl(url);

    const controller = new AbortController();
    const timeoutMs = options.timeout || 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers = {
        'User-Agent': 'SmartSchemes-Ingestion-Engine/2.0 (Open Government Data Aggregator; +https://data.gov.in)',
        Accept: 'application/json, text/plain, */*',
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Abstract method: must be implemented by concrete adapters.
   * Returns: Promise<Array<{ rawItem: Object, sourceMetadata: Object }>>
   */
  async fetchRawSchemes(_options = {}) {
    throw new Error('fetchRawSchemes must be implemented by subclass');
  }
}

module.exports = BaseAdapter;
