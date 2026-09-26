const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    trim: true,
    index: true,
  },
  subcategory: {
    type: String,
    default: 'General',
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Skill description is required'],
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  relatedSkills: [{
    type: String,
    trim: true,
  }],
  commonRoles: [{
    type: String,
    trim: true,
  }],
  learningTopics: [{
    type: String,
    trim: true,
  }],
  practiceProjects: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Active',
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

// Compound and text indexes for rapid search
skillSchema.index({ name: 1, category: 1 });
skillSchema.index({ category: 1, subcategory: 1 });
skillSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text',
  relatedSkills: 'text',
  commonRoles: 'text',
});

skillSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Skill', skillSchema);
