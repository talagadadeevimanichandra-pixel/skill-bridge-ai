const mongoose = require('mongoose');

const compatibilitySchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required'],
    index: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
    index: true,
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  matchedSkills: [{ type: String, trim: true }],
  partialSkills: [{ type: String, trim: true }],
  missingSkills: [{ type: String, trim: true }],
  matchedPreferredSkills: [{ type: String, trim: true }],
  missingPreferredSkills: [{ type: String, trim: true }],
  experienceMatch: {
    status: { type: String, default: 'Meets requirement' },
    candidateYears: { type: Number, default: 0 },
    requiredYears: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  educationMatch: {
    status: { type: String, default: 'Matches' },
    candidateDegree: { type: String, default: '' },
    requiredEducation: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  locationMatch: {
    status: { type: String, default: 'Location preference match' },
    candidateLocation: { type: String, default: '' },
    jobLocation: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  roleMatch: {
    status: { type: String, default: 'Matches target role' },
    explanation: { type: String, default: '' },
  },
  projectRelevance: {
    hasRelevantProjects: { type: Boolean, default: false },
    score: { type: Number, default: 75 },
    relevantProjects: [{
      title: String,
      matchingTechnologies: [String],
      description: String,
    }],
    explanation: { type: String, default: '' },
  },
  explanation: {
    type: String,
    default: '',
  },
  recommendations: [{
    skill: String,
    why: String,
    learn: String,
    suggestedProject: String,
  }],
  disclaimer: {
    type: String,
    default: 'Note: This score is an AI compatibility estimate, not a hiring probability.',
  },
  candidateVersion: {
    type: Date,
    default: Date.now,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound unique index for Candidate + Job pair
compatibilitySchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
compatibilitySchema.index({ candidateId: 1, matchScore: -1 });

module.exports = mongoose.model('Compatibility', compatibilitySchema);
