const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema({
  versionNumber: { type: Number, default: 1 },
  fileName: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  targetRole: { type: String, default: 'Full Stack Developer' },
  overallScore: { type: Number, default: 0 },
  scoreLabel: { type: String, default: 'Developing' },
  scoreBreakdown: {
    structure: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    jobRelevance: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
  },
  differencesFromPrevious: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
  },
  fileUrl: {
    type: String,
    default: '',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  rawText: {
    type: String,
    default: '',
  },
  targetRole: {
    type: String,
    default: '',
  },
  currentVersion: {
    type: Number,
    default: 1,
  },
  versions: [resumeVersionSchema],
  extractedData: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    links: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    skills: [{ type: String, trim: true }],
    categorizedSkills: {
      technical: [{ type: String }],
      tools: [{ type: String }],
      frameworks: [{ type: String }],
      databases: [{ type: String }],
      cloud: [{ type: String }],
      softSkills: [{ type: String }],
    },
    education: [{
      degree: String,
      institution: String,
      graduationYear: String,
      gpa: String,
    }],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
      skillsUsed: [String],
      responsibilities: [String],
      hasMetrics: Boolean,
    }],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      problemSolved: String,
      userImpact: String,
      githubLink: String,
      demoLink: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: String,
    }],
    achievements: [{
      title: String,
      description: String,
      category: String,
    }],
  },
  intelligence: {
    overallScore: { type: Number, default: 0 },
    scoreLabel: { type: String, enum: ['Needs Improvement', 'Developing', 'Strong'], default: 'Developing' },
    scoreNotice: {
      type: String,
      default: 'Based on the information detected in your resume and your selected career target.',
    },
    scoreBreakdown: {
      structure: { score: Number, weight: Number, explanation: String },
      skills: { score: Number, weight: Number, explanation: String },
      experience: { score: Number, weight: Number, explanation: String },
      projects: { score: Number, weight: Number, explanation: String },
      education: { score: Number, weight: Number, explanation: String },
      achievements: { score: Number, weight: Number, explanation: String },
      jobRelevance: { score: Number, weight: Number, explanation: String },
      readability: { score: Number, weight: Number, explanation: String },
    },
    resumeHealth: {
      structure: String,
      content: String,
      skills: String,
      experience: String,
      projects: String,
      jobRelevance: String,
    },
    completenessSections: [{
      name: String,
      status: { type: String, enum: ['Present', 'Needs Improvement', 'Missing'] },
      details: String,
    }],
    areasToImprove: [{
      severity: { type: String, enum: ['Critical', 'High Priority', 'Medium Priority', 'Low Priority'] },
      issue: String,
      whyItMatters: String,
      howToFix: String,
      example: String,
    }],
    atsCompatibilityChecks: [{
      checkName: String,
      passed: Boolean,
      status: String,
      note: String,
    }],
    keywordAnalysis: {
      targetRole: String,
      detectedKeywords: [String],
      missingKeywords: [String],
      overusedKeywords: [String],
      note: String,
    },
    skillEvidence: [{
      skill: String,
      inSkillsList: Boolean,
      inProjects: Boolean,
      inExperience: Boolean,
      evidenceStrength: { type: String, enum: ['Strong', 'Moderate', 'Limited'] },
      contextNote: String,
    }],
    projectAnalysis: [{
      title: String,
      strength: String,
      problemSolvedPresent: Boolean,
      impactPresent: Boolean,
      technologiesPresent: Boolean,
      suggestions: [String],
    }],
    experienceAnalysis: [{
      title: String,
      company: String,
      hasDates: Boolean,
      hasConsistentTitles: Boolean,
      hasMeasurableOutcome: Boolean,
      strengths: [String],
      suggestions: [String],
    }],
    achievementAnalysis: {
      detected: Boolean,
      summary: String,
      items: [String],
      suggestion: String,
    },
    contactPresence: {
      email: { present: Boolean, value: String, status: String },
      phone: { present: Boolean, value: String, status: String },
      linkedin: { present: Boolean, value: String, status: String },
      github: { present: Boolean, value: String, status: String },
      portfolio: { present: Boolean, value: String, status: String },
    },
    summaryAnalysis: {
      present: Boolean,
      clarity: String,
      lengthAssessment: String,
      relevance: String,
      detectedSummary: String,
      suggestedDraft: String,
    },
    writingQuality: {
      actionVerbsUsage: String,
      passiveLanguageNotes: String,
      concisenessNotes: String,
      tenseConsistency: String,
    },
    sectionOrderAdvice: {
      profileType: String,
      recommendation: String,
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    priorityActionPlan: [{
      rank: Number,
      title: String,
      action: String,
      reason: String,
    }],
    comparisonAgainstPrevious: {
      previousScore: Number,
      newScore: Number,
      scoreDifference: Number,
      improvementsDetected: [String],
    },
  },
  aiAnalysis: {
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
    overallScore: { type: Number, default: 0 },
    atsCompatibilityScore: { type: Number, default: 85 },
    strengths: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestedImprovements: [{ type: String }],
    summary: { type: String, default: '' },
    careerPathRecommendations: [{ type: String }],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

resumeSchema.virtual('extractedText').get(function () {
  return this.rawText;
});
resumeSchema.virtual('extractedSkills').get(function () {
  return this.extractedData?.skills || [];
});

resumeSchema.index({ userId: 1, uploadedAt: -1 });

resumeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
