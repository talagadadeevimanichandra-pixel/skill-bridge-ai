const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer ID is required'],
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true,
  },
  logo: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: 'Enterprise Software & Cloud Platforms',
    trim: true,
    index: true,
  },
  location: {
    type: String,
    default: 'Bengaluru, India',
    trim: true,
    index: true,
  },
  website: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '50-200 employees',
  },
  founded: {
    type: String,
    default: '2020',
  },
  benefits: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

companySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Company', companySchema);
