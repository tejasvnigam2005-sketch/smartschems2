// Mongoose model for government schemes.
// Collection: "schemes" in the "smart_schemes" database.
// Supports both legacy Kaggle format and extended official government ingestion format.

const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    // ── Primary Identification ──
    scheme_name: { type: String, required: true, index: true },
    name: { type: String, index: true },
    slug: { type: String, index: true },

    // ── Descriptions & Metadata ──
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    details: { type: String, default: '' }, // Legacy Kaggle field
    ministry: { type: String, default: '', index: true },
    department: { type: String, default: '' },
    schemeType: { type: String, default: '' }, // Central / State / Centrally Sponsored
    level: { type: String, default: '', index: true }, // Central / State (legacy compatibility)
    schemeCategory: { type: String, default: '', index: true },
    tags: { type: [String], default: [] },

    // ── Structured Eligibility & Criteria ──
    // Mixed type supports both structured object and legacy string text
    eligibility: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        rawText: '',
        minAge: null,
        maxAge: null,
        incomeLimit: null,
        incomePeriod: null, // 'annual' | 'monthly'
        incomeType: null,   // 'family' | 'individual'
        gender: [],
        categories: [],
        educationLevels: [],
        occupations: [],
        businessTypes: [],
        states: [],
        districts: [],
      }),
    },

    // ── Benefits ──
    benefits: { type: mongoose.Schema.Types.Mixed, default: '' }, // String or Array
    benefitsList: { type: [String], default: [] },

    // ── Documents & Application ──
    documents: { type: String, default: '' }, // Legacy plain text
    documentsRequired: { type: [String], default: [] },
    application: { type: String, default: '' }, // Legacy plain text
    applicationProcess: { type: String, default: '' },
    applicationUrl: { type: String, default: '' },
    officialUrl: { type: String, default: '', index: true },

    // ── Provenance & Multi-Source Tracking ──
    source: {
      name: { type: String, default: '' },
      url: { type: String, default: '' },
      datasetId: { type: String, default: null },
      retrievedAt: { type: Date, default: Date.now },
    },
    sources: [
      {
        name: { type: String, required: true },
        url: { type: String, default: '' },
        datasetId: { type: String, default: null },
        retrievedAt: { type: Date, default: Date.now },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
      },
    ],

    // ── Conflict & Discrepancy Tracking ──
    discrepancies: [
      {
        field: { type: String },
        values: [
          {
            sourceName: { type: String },
            value: { type: mongoose.Schema.Types.Mixed },
            retrievedAt: { type: Date, default: Date.now },
          },
        ],
        flaggedAt: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
      },
    ],

    // ── Lifecycle & Verification ──
    status: {
      type: String,
      enum: ['active', 'inactive', 'needs_review', 'archived'],
      default: 'active',
      index: true,
    },
    lastVerifiedAt: { type: Date, default: Date.now },

    // ── Ingestion Metadata ──
    ingestionMetadata: {
      sourceIdentifier: { type: String, index: true },
      contentHash: { type: String },
      isLLMProcessed: { type: Boolean, default: false },
      llmModel: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: 'schemes',
  }
);

// Synchronize backward/forward compatibility fields before save
schemeSchema.pre('save', function () {
  // Sync scheme_name and name
  if (this.scheme_name && !this.name) {
    this.name = this.scheme_name;
  } else if (this.name && !this.scheme_name) {
    this.scheme_name = this.name;
  }

  // Sync details and description
  if (this.details && !this.description) {
    this.description = this.details;
  } else if (this.description && !this.details) {
    this.details = this.description;
  }

  // Sync application and applicationProcess
  if (this.application && !this.applicationProcess) {
    this.applicationProcess = this.application;
  } else if (this.applicationProcess && !this.application) {
    this.application = this.applicationProcess;
  }

  // Sync documents and documentsRequired
  if (this.documents && (!this.documentsRequired || !this.documentsRequired.length)) {
    this.documentsRequired = this.documents
      .split(/[,;\n]+/)
      .map((d) => d.trim())
      .filter(Boolean);
  } else if (Array.isArray(this.documentsRequired) && this.documentsRequired.length && !this.documents) {
    this.documents = this.documentsRequired.join(', ');
  }

  // Sync benefits and benefitsList
  if (Array.isArray(this.benefits) && (!this.benefitsList || !this.benefitsList.length)) {
    this.benefitsList = this.benefits;
  } else if (typeof this.benefits === 'string' && this.benefits && (!this.benefitsList || !this.benefitsList.length)) {
    this.benefitsList = this.benefits
      .split(/[,;\n]+/)
      .map((b) => b.trim())
      .filter(Boolean);
  }

  // Sync source and sources array
  if (this.source && this.source.name) {
    if (!this.sources || !this.sources.length) {
      this.sources = [this.source];
    }
  }
});

// Text index for full-text search across key fields
schemeSchema.index({
  scheme_name: 'text',
  name: 'text',
  details: 'text',
  description: 'text',
  benefits: 'text',
  tags: 'text',
  'eligibility.rawText': 'text',
});

// Compound indexes for ingestion & duplicate lookup
schemeSchema.index({ 'source.datasetId': 1, 'source.name': 1 });

module.exports = mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);
