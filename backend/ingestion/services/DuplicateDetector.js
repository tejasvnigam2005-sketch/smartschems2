// Duplicate Detector & Multi-Source Conflict Resolver.
// Enforces zero-duplicate rule using hierarchical identity matching.
// Tracks source provenance and records discrepancies across sources without silent overwrites.

const Scheme = require('../../models/Scheme');
const logger = require('../../utils/logger');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class DuplicateDetector {
  /**
   * Finds an existing scheme record using hierarchical identity rules.
   */
  static async findExistingScheme(normalizedScheme) {
    const { officialUrl, ingestionMetadata, name, ministry } = normalizedScheme;

    // 1. Match by Canonical Official URL (strongest external identity)
    if (officialUrl && officialUrl.trim()) {
      const byUrl = await Scheme.findOne({ officialUrl: officialUrl.trim() });
      if (byUrl) return byUrl;
    }

    // 2. Match by Source Dataset Identifier
    if (ingestionMetadata?.sourceIdentifier) {
      const bySourceId = await Scheme.findOne({
        'ingestionMetadata.sourceIdentifier': ingestionMetadata.sourceIdentifier,
      });
      if (bySourceId) return bySourceId;
    }

    // 3. Match by Normalized Scheme Name (+ Ministry if present)
    if (name && name.trim()) {
      const nameRegex = new RegExp(`^${escapeRegex(name.trim())}$`, 'i');
      const query = { scheme_name: nameRegex };

      if (ministry && ministry.trim()) {
        const byNameAndMinistry = await Scheme.findOne({
          scheme_name: nameRegex,
          ministry: new RegExp(`^${escapeRegex(ministry.trim())}$`, 'i'),
        });
        if (byNameAndMinistry) return byNameAndMinistry;
      }

      const byName = await Scheme.findOne(query);
      if (byName) return byName;
    }

    return null;
  }

  /**
   * Analyzes differences between an existing scheme and an incoming one.
   * Identifies conflicts, merges sources, and determines whether an update is needed.
   */
  static reconcile(existingDoc, incomingScheme) {
    const existing = existingDoc.toObject();
    const discrepancies = [];

    // Check for critical eligibility discrepancies
    const exElig = existing.eligibility || {};
    const inElig = incomingScheme.eligibility || {};

    if (
      exElig.incomeLimit !== null &&
      exElig.incomeLimit !== undefined &&
      inElig.incomeLimit !== null &&
      inElig.incomeLimit !== undefined &&
      exElig.incomeLimit !== inElig.incomeLimit
    ) {
      discrepancies.push({
        field: 'eligibility.incomeLimit',
        values: [
          {
            sourceName: existing.source?.name || 'Existing Record',
            value: exElig.incomeLimit,
            retrievedAt: existing.source?.retrievedAt || new Date(),
          },
          {
            sourceName: incomingScheme.source?.name || 'Incoming Source',
            value: inElig.incomeLimit,
            retrievedAt: new Date(),
          },
        ],
        flaggedAt: new Date(),
        resolved: false,
      });
    }

    if (
      exElig.minAge !== null &&
      exElig.minAge !== undefined &&
      inElig.minAge !== null &&
      inElig.minAge !== undefined &&
      exElig.minAge !== inElig.minAge
    ) {
      discrepancies.push({
        field: 'eligibility.minAge',
        values: [
          {
            sourceName: existing.source?.name || 'Existing Record',
            value: exElig.minAge,
            retrievedAt: existing.source?.retrievedAt || new Date(),
          },
          {
            sourceName: incomingScheme.source?.name || 'Incoming Source',
            value: inElig.minAge,
            retrievedAt: new Date(),
          },
        ],
        flaggedAt: new Date(),
        resolved: false,
      });
    }

    if (
      exElig.maxAge !== null &&
      exElig.maxAge !== undefined &&
      inElig.maxAge !== null &&
      inElig.maxAge !== undefined &&
      exElig.maxAge !== inElig.maxAge
    ) {
      discrepancies.push({
        field: 'eligibility.maxAge',
        values: [
          {
            sourceName: existing.source?.name || 'Existing Record',
            value: exElig.maxAge,
            retrievedAt: existing.source?.retrievedAt || new Date(),
          },
          {
            sourceName: incomingScheme.source?.name || 'Incoming Source',
            value: inElig.maxAge,
            retrievedAt: new Date(),
          },
        ],
        flaggedAt: new Date(),
        resolved: false,
      });
    }

    // Merge multi-source tracking
    const existingSources = Array.isArray(existing.sources) ? [...existing.sources] : [];
    const incomingSource = incomingScheme.source;

    const sourceAlreadyLogged = existingSources.some(
      (s) => s.name.toLowerCase() === incomingSource.name.toLowerCase()
    );

    if (!sourceAlreadyLogged) {
      existingSources.push({
        name: incomingSource.name,
        url: incomingSource.url || '',
        datasetId: incomingSource.datasetId || null,
        retrievedAt: new Date(),
      });
    }

    // Check if content hash changed
    const isIdentical =
      existing.ingestionMetadata?.contentHash &&
      existing.ingestionMetadata.contentHash === incomingScheme.ingestionMetadata?.contentHash;

    const mergedDiscrepancies = [...(existing.discrepancies || []), ...discrepancies];

    return {
      isIdentical,
      hasDiscrepancies: discrepancies.length > 0,
      newDiscrepancies: discrepancies,
      mergedSources: existingSources,
      mergedDiscrepancies,
    };
  }
}

module.exports = DuplicateDetector;
