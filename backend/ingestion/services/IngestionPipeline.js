// Ingestion Pipeline Orchestrator — executes the complete ingestion lifecycle:
// Source Retrieval ➔ Parser ➔ Normalizer ➔ Validator ➔ Duplicate Detection ➔ MongoDB.

const Scheme = require('../../models/Scheme');
const DataGovAdapter = require('../adapters/DataGovAdapter');
const MySchemeAdapter = require('../adapters/MySchemeAdapter');
const IndiaGovAdapter = require('../adapters/IndiaGovAdapter');
const LocalDatasetAdapter = require('../adapters/LocalDatasetAdapter');
const { normalizeSchemeData } = require('../normalizers/SchemeNormalizer');
const { validateNormalizedScheme } = require('../validators/SchemeValidator');
const { isLLMAvailable, extractWithLLM } = require('../parsers/LLMParser');
const DuplicateDetector = require('./DuplicateDetector');
const logger = require('../../utils/logger');

class IngestionPipeline {
  static getAdapter(sourceKey) {
    const key = (sourceKey || 'datagov').toLowerCase().trim();

    switch (key) {
      case 'datagov':
      case 'data.gov.in':
        return new DataGovAdapter();
      case 'myscheme':
      case 'myscheme.gov.in':
        return new MySchemeAdapter();
      case 'indiagov':
      case 'india.gov.in':
        return new IndiaGovAdapter();
      case 'local':
      case 'kaggle':
        return new LocalDatasetAdapter();
      default:
        throw new Error(
          `Unknown source adapter '${sourceKey}'. Available adapters: datagov, myscheme, indiagov, local`
        );
    }
  }

  /**
   * Runs the ingestion pipeline with specified options.
   * @param {Object} options
   * @param {string} options.source - 'datagov' | 'myscheme' | 'indiagov' | 'local'
   * @param {number} options.limit - Max schemes to import (default: 20)
   * @param {boolean} options.dryRun - If true, validates and normalizes without DB writes
   * @param {boolean} options.useLLM - If true and GEMINI_API_KEY present, runs LLM parser
   * @param {string} options.resourceId - OGD resource ID (for data.gov.in)
   * @param {string} options.file - Local file path (optional)
   */
  static async run(options = {}) {
    const startTime = Date.now();
    const adapter = IngestionPipeline.getAdapter(options.source);
    const limit = options.limit || 20;
    const isDryRun = Boolean(options.dryRun);
    const shouldRunLLM = Boolean(options.useLLM && isLLMAvailable());

    logger.info('IngestionPipeline', `Starting ingestion from source: ${adapter.getName()}`, {
      limit,
      dryRun: isDryRun,
      useLLM: shouldRunLLM,
    });

    const stats = {
      success: true,
      source: adapter.getName(),
      found: 0,
      created: 0,
      updated: 0,
      duplicates: 0,
      failed: 0,
      discrepanciesCount: 0,
      details: [],
      durationMs: 0,
    };

    // 1. Fetch raw schemes through authorized adapter
    const rawItems = await adapter.fetchRawSchemes({
      limit,
      resourceId: options.resourceId,
      file: options.file,
    });

    stats.found = rawItems.length;

    if (rawItems.length === 0) {
      stats.durationMs = Date.now() - startTime;
      return stats;
    }

    // 2. Process each scheme through normalization, validation & deduplication
    for (const { rawItem, sourceMetadata } of rawItems) {
      try {
        // Normalization
        let normalized = normalizeSchemeData(rawItem, sourceMetadata);

        // Optional LLM enhancement
        if (shouldRunLLM && normalized.eligibility?.rawText) {
          const llmCriteria = await extractWithLLM(
            normalized.eligibility.rawText,
            normalized
          );
          if (llmCriteria) {
            normalized.eligibility = {
              ...normalized.eligibility,
              ...llmCriteria,
            };
            normalized.ingestionMetadata.isLLMProcessed = true;
            normalized.ingestionMetadata.llmModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
          }
        }

        // Validation
        const validation = validateNormalizedScheme(normalized);
        if (!validation.valid) {
          stats.failed++;
          stats.details.push({
            name: normalized.name || 'Unknown',
            action: 'rejected_validation',
            errors: validation.errors,
          });
          logger.warn('IngestionPipeline', `Scheme validation failed for ${normalized.name}`, {
            errors: validation.errors,
          });
          continue;
        }

        const validScheme = validation.data;

        // Duplicate Check & Reconcile
        const existingDoc = await DuplicateDetector.findExistingScheme(validScheme);

        if (existingDoc) {
          const reconciliation = DuplicateDetector.reconcile(existingDoc, validScheme);

          if (reconciliation.hasDiscrepancies) {
            stats.discrepanciesCount += reconciliation.newDiscrepancies.length;
          }

          if (reconciliation.isIdentical && !reconciliation.hasDiscrepancies) {
            // Document is unchanged; update verification timestamp only
            if (!isDryRun) {
              existingDoc.lastVerifiedAt = new Date();
              existingDoc.sources = reconciliation.mergedSources;
              await existingDoc.save();
            }
            stats.duplicates++;
            stats.details.push({
              name: validScheme.name,
              id: existingDoc._id,
              action: 'duplicate_verified',
            });
          } else {
            // Document has changes or discrepancies; update it
            if (!isDryRun) {
              // Update core fields while preserving existing values where incoming is missing
              existingDoc.description = validScheme.description || existingDoc.description;
              existingDoc.details = validScheme.details || existingDoc.details;
              existingDoc.eligibility = validScheme.eligibility || existingDoc.eligibility;
              existingDoc.benefits = validScheme.benefits.length ? validScheme.benefits : existingDoc.benefits;
              existingDoc.documentsRequired = validScheme.documentsRequired.length ? validScheme.documentsRequired : existingDoc.documentsRequired;
              existingDoc.applicationProcess = validScheme.applicationProcess || existingDoc.applicationProcess;
              existingDoc.applicationUrl = validScheme.applicationUrl || existingDoc.applicationUrl;
              existingDoc.officialUrl = validScheme.officialUrl || existingDoc.officialUrl;
              existingDoc.sources = reconciliation.mergedSources;
              existingDoc.discrepancies = reconciliation.mergedDiscrepancies;
              existingDoc.lastVerifiedAt = new Date();

              if (reconciliation.hasDiscrepancies) {
                existingDoc.status = 'needs_review';
              }

              if (validScheme.ingestionMetadata?.contentHash) {
                existingDoc.ingestionMetadata = {
                  ...existingDoc.ingestionMetadata,
                  ...validScheme.ingestionMetadata,
                };
              }

              await existingDoc.save();
            }

            stats.updated++;
            stats.details.push({
              name: validScheme.name,
              id: existingDoc._id,
              action: 'updated',
              hasDiscrepancies: reconciliation.hasDiscrepancies,
            });
          }
        } else {
          // New Scheme: Insert into MongoDB
          if (!isDryRun) {
            const newDoc = new Scheme(validScheme);
            await newDoc.save();
            stats.created++;
            stats.details.push({
              name: validScheme.name,
              id: newDoc._id,
              action: 'created',
            });
          } else {
            stats.created++;
            stats.details.push({
              name: validScheme.name,
              action: 'created_dry_run',
            });
          }
        }
      } catch (err) {
        stats.failed++;
        stats.details.push({
          name: rawItem?.name || rawItem?.scheme_name || 'Unknown',
          action: 'error',
          error: err.message,
        });
        logger.error('IngestionPipeline', `Error processing scheme item: ${err.message}`);
      }
    }

    stats.durationMs = Date.now() - startTime;
    logger.info('IngestionPipeline', 'Ingestion completed', stats);
    return stats;
  }
}

module.exports = IngestionPipeline;
