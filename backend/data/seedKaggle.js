#!/usr/bin/env node
// -------------------------------------------------------------------
// Seed script: parses the Kaggle CSV and bulk-inserts all government
// schemes into the MongoDB Atlas "smartschemes.schemes" collection.
//
// Usage:  node data/seedKaggle.js
// -------------------------------------------------------------------

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('../models/Scheme');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CSV_PATH = path.join(__dirname, 'updated_data.csv');
const BATCH_SIZE = 500; // insert in batches to avoid memory spikes

async function seedFromCSV() {
  // ── Connect ──────────────────────────────
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌  MONGO_URI is not set in .env');
    process.exit(1);
  }

  console.log('🔗  Connecting to MongoDB Atlas…');
  await mongoose.connect(uri, { dbName: 'smart_schemes' });
  console.log('✅  Connected to MongoDB Atlas (smart_schemes)');

  // ── Clear existing schemes ───────────────
  const existingCount = await Scheme.countDocuments();
  if (existingCount > 0) {
    console.log(`🗑️   Clearing ${existingCount} existing schemes…`);
    await Scheme.deleteMany({});
  }

  // ── Parse CSV ────────────────────────────
  console.log(`📄  Reading CSV: ${CSV_PATH}`);

  const schemes = [];
  let skipped = 0;

  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        skipEmptyLines: true,
      }))
      .on('data', (row) => {
        const name = (row.scheme_name || '').trim();
        if (!name) {
          skipped++;
          return;
        }

        // Parse tags: comma-separated string → array
        const rawTags = (row.tags || '').trim();
        const tags = rawTags
          ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
          : [];

        schemes.push({
          scheme_name: name,
          slug: (row.slug || '').trim(),
          details: (row.details || '').trim(),
          benefits: (row.benefits || '').trim(),
          eligibility: (row.eligibility || '').trim(),
          application: (row.application || '').trim(),
          documents: (row.documents || '').trim(),
          level: (row.level || '').trim(),
          schemeCategory: (row.schemeCategory || '').trim(),
          tags,
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📊  Parsed ${schemes.length} schemes (${skipped} rows skipped)`);

  // ── Bulk insert in batches ───────────────
  let inserted = 0;
  for (let i = 0; i < schemes.length; i += BATCH_SIZE) {
    const batch = schemes.slice(i, i + BATCH_SIZE);
    await Scheme.insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log(`   ✅  Inserted batch ${Math.ceil((i + 1) / BATCH_SIZE)} — ${inserted}/${schemes.length}`);
  }

  console.log(`\n🎉  Done! ${inserted} schemes seeded into MongoDB Atlas.`);
  await mongoose.disconnect();
  process.exit(0);
}

seedFromCSV().catch((err) => {
  console.error('❌  Fatal error:', err);
  process.exit(1);
});
