// Mongoose model for business schemes (used by seed.js and recommendation engine).

const mongoose = require('mongoose');

const businessSchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 100 },
    minIncome: { type: Number, default: 0 },
    maxIncome: { type: Number, default: Infinity },
    businessType: { type: [String], default: [] },
    minInvestment: { type: Number, default: 0 },
    maxInvestment: { type: Number, default: Infinity },
    states: { type: [String], default: ['all'] },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    applicationProcess: { type: [String], default: [] },
    deadline: { type: String, default: '' },
    website: { type: String, default: '' },
    fundingAmount: { type: String, default: '' },
    ministry: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'business_schemes',
  }
);

module.exports = mongoose.models.BusinessScheme || mongoose.model('BusinessScheme', businessSchemeSchema);
