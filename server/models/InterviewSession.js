const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'HR', 'System Design', 'Situational'],
    default: 'Technical',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  question: { type: String, required: true },
  suggestedAnswer: { type: String, default: '' },
  keyConcepts: [{ type: String }],
  followUpQuestions: [{ type: String }],
  userAnswer: { type: String, default: '' },
  aiEvaluation: {
    score: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    feedback: { type: String, default: '' },
    suggestedRefinement: { type: String, default: '' },
  },
}, { _id: true });

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    index: true,
  },
  jobTitle: {
    type: String,
    default: 'Full Stack Developer',
    trim: true,
  },
  targetRole: {
    type: String,
    default: 'Software Engineer',
    trim: true,
  },
  targetCompany: {
    type: String,
    default: 'Technology Company',
    trim: true,
  },
  targetSkills: [{ type: String, trim: true }],
  questions: [questionSchema],
  overallFeedback: {
    score: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    readinessLevel: { type: String, default: 'Moderate' },
    recommendedTopics: [{ type: String }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

interviewSessionSchema.index({ userId: 1, createdAt: -1 });

interviewSessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
