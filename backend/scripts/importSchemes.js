#!/usr/bin/env node
// CLI Scheme Importer — executes government scheme data ingestion from command line.
// Usage:
//   node scripts/importSchemes.js --source=datagov --limit=15
//   node scripts/importSchemes.js --source=datagov --limit=20 --dry-run
//   node scripts/importSchemes.js --quality

require('dotenv').config();
const mongoose = require('mongoose');
const connectMongoDB = require('../config/mongodb');
const IngestionPipeline = require('../ingestion/services/IngestionPipeline');
const DataQualityService = require('../ingestion/services/DataQualityService');
const logger = require('../utils/logger');

// Parse simple CLI flags
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: 'datagov',
    limit: 15,
    dryRun: false,
    useLLM: false,
    qualityOnly: false,
    resourceId: null,
    file: null,
  };

  for (const arg of args) {
    if (arg === '--quality') {
      options.qualityOnly = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--use-llm') {
      options.useLLM = true;
    } else if (arg.startsWith('--source=')) {
      options.source = arg.split('=')[1];
    } else if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1], 10) || 15;
    } else if (arg.startsWith('--resource-id=')) {
      options.resourceId = arg.split('=')[1];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log('\n======================================================');
  console.log('🏛️  SmartSchemes — Official Government Scheme Ingestion');
  console.log('======================================================\n');

  try {
    await connectMongoDB();

    if (options.qualityOnly) {
      console.log('📊 Fetching Data Quality Report...\n');
      const report = await DataQualityService.getQualityReport();
      console.log('--- Overview ---');
      console.table(report.overview);
      console.log('\n--- Sources Breakdown ---');
      console.table(report.sourcesBreakdown);
      console.log('\n--- Data Completeness ---');
      console.table(report.dataCompleteness);
      if (report.flaggedDiscrepancies.length > 0) {
        console.log('\n⚠️ Flagged Discrepancies Requiring Review:');
        console.table(report.flaggedDiscrepancies);
      }
      process.exit(0);
    }

    console.log(`📡 Ingestion Source : ${options.source}`);
    console.log(`🎯 Import Limit     : ${options.limit}`);
    console.log(`🧪 Dry Run Mode     : ${options.dryRun ? 'ENABLED (No DB writes)' : 'DISABLED (Writing to DB)'}`);
    console.log(`🤖 Optional LLM     : ${options.useLLM ? 'ENABLED' : 'DISABLED (100% deterministic)'}\n`);

    const result = await IngestionPipeline.run({
      source: options.source,
      limit: options.limit,
      dryRun: options.dryRun,
      useLLM: options.useLLM,
      resourceId: options.resourceId,
      file: options.file,
    });

    console.log('\n✅ Ingestion Run Complete:');
    console.log('------------------------------------------------------');
    console.log(`• Source              : ${result.source}`);
    console.log(`• Schemes Found       : ${result.found}`);
    console.log(`• Created (New)       : ${result.created}`);
    console.log(`• Updated (Existing)  : ${result.updated}`);
    console.log(`• Unchanged Duplicates: ${result.duplicates}`);
    console.log(`• Discrepancies Flagged: ${result.discrepanciesCount}`);
    console.log(`• Failed / Rejected   : ${result.failed}`);
    console.log(`• Total Duration      : ${result.durationMs}ms`);
    console.log('------------------------------------------------------\n');

    if (result.details && result.details.length > 0) {
      console.log('Import Summary:');
      console.table(
        result.details.slice(0, 15).map((d) => ({
          Scheme: d.name.slice(0, 45),
          Action: d.action,
        }))
      );
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Ingestion failed:', error.message);
    process.exit(1);
  }
}

main();
