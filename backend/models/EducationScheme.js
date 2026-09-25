// Mongoose model for education schemes (used by seed.js and recommendation engine).

const mongoose = require('mongoose');

const educationSchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 100 },
    educationLevel: { type: [String], default: [] },
    category: { type: [String], default: ['all'] },
    minIncome: { type: Number, default: 0 },
    maxIncome: { type: Number, default: Infinity },
    fieldOfStudy: { type: [String], default: ['all'] },
    states: { type: [String], default: ['all'] },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    applicationProcess: { type: [String], default: [] },
    deadline: { type: String, default: '' },
    website: { type: String, default: '' },
    scholarshipAmount: { type: String, default: '' },
    ministry: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'education_schemes',
  }
);

module.exports = mongoose.models.EducationScheme || mongoose.model('EducationScheme', educationSchemeSchema);
