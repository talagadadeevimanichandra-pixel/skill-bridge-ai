const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer ID is required'],
    index: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  responsibilities: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    required: [true, 'At least one skill is required'],
    trim: true,
    index: true,
  }],
  preferredSkills: [{
    type: String,
    trim: true,
  }],
  experience: {
    minYears: { type: Number, default: 0, min: 0 },
    maxYears: { type: Number, default: 3, min: 0 },
    level: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Internship', 'Lead', '1-3 years', '0-2 years', '2-5 years'],
      default: 'Entry Level',
    },
  },
  education: {
    type: String,
    default: "Bachelor's Degree in Computer Science or related engineering field",
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    index: true,
  },
  workplaceType: {
    type: String,
    enum: ['On-site', 'Hybrid', 'Remote'],
    default: 'Hybrid',
    index: true,
  },
  salary: {
    min: { type: Number, default: 600000, min: 0 },
    max: { type: Number, default: 1200000, min: 0 },
    currency: { type: String, default: 'INR' },
    period: { type: String, default: 'per annum' },
    isDisclosed: { type: Boolean, default: true },
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
    index: true,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Closed', 'published', 'draft', 'closed'],
    default: 'Active',
    index: true,
  },
  applicantsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual aliases for requiredSkills, salaryMin, salaryMax
jobSchema.virtual('requiredSkills').get(function () {
  return this.skills;
});
jobSchema.virtual('salaryMin').get(function () {
  return this.salary?.min;
});
jobSchema.virtual('salaryMax').get(function () {
  return this.salary?.max;
});

// Single and Compound Indexes for high query throughput
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ status: 1, location: 1 });
jobSchema.index({ status: 1, jobType: 1 });
jobSchema.index({ status: 1, 'salary.max': -1 });
jobSchema.index({ employerId: 1, status: 1, createdAt: -1 });

// Full text search index
jobSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
  location: 'text',
  companyName: 'text',
});

jobSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Job', jobSchema);

