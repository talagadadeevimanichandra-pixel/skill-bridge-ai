const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
    index: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required'],
    index: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer ID is required'],
    index: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied',
    index: true,
  },
  matchScore: {
    overall: { type: Number, default: 0, min: 0, max: 100 },
    skillScore: { type: Number, default: 0, min: 0, max: 100 },
    experienceScore: { type: Number, default: 0, min: 0, max: 100 },
    matchedSkills: [{ type: String, trim: true }],
    partialSkills: [{ type: String, trim: true }],
    missingSkills: [{ type: String, trim: true }],
    matchSummary: { type: String, default: '' },
  },
  coverNote: {
    type: String,
    default: '',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  interviewDate: {
    type: Date,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual getter for compatibilitySnapshot
applicationSchema.virtual('compatibilitySnapshot').get(function () {
  return this.matchScore;
});

// Indexes for fast recruitment pipeline retrieval & ranking
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ candidateId: 1, appliedAt: -1 });
applicationSchema.index({ employerId: 1, status: 1, appliedAt: -1 });
applicationSchema.index({ jobId: 1, 'matchScore.overall': -1 });

applicationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);

