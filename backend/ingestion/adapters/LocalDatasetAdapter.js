// LocalDatasetAdapter — Ingestion adapter for verified local open datasets (CSV/JSON).
// Reuses the exact same normalizer, validator, and duplicate detection pipeline.

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const BaseAdapter = require('./BaseAdapter');

class LocalDatasetAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('LocalDataset', 'local://verified_data');
    this.defaultFilePath =
      config.filePath || path.resolve(__dirname, '../../data/updated_data.csv');
  }

  getSourceInfo() {
    return {
      name: 'LocalOpenDataset',
      defaultFile: this.defaultFilePath,
      type: 'local_verified_dataset',
    };
  }

  async fetchRawSchemes(options = {}) {
    const limit = Math.max(1, Math.min(options.limit || 20, 5000));
    const filePath = options.file || this.defaultFilePath;

    if (!fs.existsSync(filePath)) {
      throw new Error(`Dataset file not found: ${filePath}`);
    }

    if (filePath.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const records = Array.isArray(data) ? data : data.schemes || [];
      return records.slice(0, limit).map((record) => ({
        rawItem: record,
        sourceMetadata: {
          name: 'Local Open Dataset',
          url: record.officialUrl || '',
          datasetId: record.id || path.basename(filePath),
          retrievedAt: new Date(),
        },
      }));
    }

    // CSV format
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (results.length < limit) {
            results.push({
              rawItem: {
                name: row.scheme_name || row.name || row.Scheme_Name,
                slug: row.slug,
                details: row.details || row.description,
                benefits: row.benefits,
                eligibility: row.eligibility,
                application: row.application,
                documents: row.documents,
                level: row.level,
                schemeCategory: row.schemeCategory || row.category,
                tags: row.tags ? row.tags.split(',').map((t) => t.trim()) : [],
              },
              sourceMetadata: {
                name: 'Verified Government Scheme Dataset',
                url: '',
                datasetId: 'KAGGLE-GOV-SCHEMES-CSV',
                retrievedAt: new Date(),
              },
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}

module.exports = LocalDatasetAdapter;
