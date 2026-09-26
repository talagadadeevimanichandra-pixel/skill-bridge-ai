const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '', trim: true },
  fieldOfStudy: { type: String, default: '', trim: true },
  institution: { type: String, default: '', trim: true },
  graduationYear: { type: String, default: '' },
  gpa: { type: String, default: '' },
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  company: { type: String, default: '', trim: true },
  location: { type: String, default: '', trim: true },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  skillsUsed: [{ type: String, trim: true }],
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  description: { type: String, default: '' },
  technologies: [{ type: String, trim: true }],
  liveUrl: { type: String, default: '', trim: true },
  githubUrl: { type: String, default: '', trim: true },
}, { _id: true });

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  issuer: { type: String, default: '', trim: true },
  issueDate: { type: String, default: '' },
  credentialUrl: { type: String, default: '', trim: true },
}, { _id: true });

const profileSchema = new mongoose.Schema({
  headline: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  location: { type: String, default: 'Bengaluru, India', trim: true },
  bio: { type: String, default: '' },
  skills: [{ type: String, trim: true }],
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  preferredJobRoles: [{ type: String, trim: true }],
  preferredLocations: [{ type: String, trim: true }],
  workPreference: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site', 'Open'],
    default: 'Open',
  },
  profileCompletion: {
    type: Number,
    default: 30,
    min: 0,
    max: 100,
  },
  expectedSalary: {
    currency: { type: String, default: 'INR' },
    min: { type: Number, default: 600000 },
    max: { type: Number, default: 1200000 },
  },
  github: { type: String, default: '', trim: true },
  linkedin: { type: String, default: '', trim: true },
  portfolio: { type: String, default: '', trim: true },
  trackedSkills: [{
    name: { type: String, trim: true },
    status: { type: String, enum: ['Strong', 'Developing', 'Learning'], default: 'Learning' },
    addedAt: { type: Date, default: Date.now },
  }],
  resumeUrl: { type: String, default: '' },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker',
    index: true,
  },
  profile: {
    type: profileSchema,
    default: () => ({}),
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
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

// Indexes for fast querying
userSchema.index({ 'profile.skills': 1 });
userSchema.index({ 'profile.location': 1 });
userSchema.index({ role: 1, createdAt: -1 });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Calculate profile completion percentage helper
function calculateProfileCompletion(user) {
  let score = 0;
  if (user.name) score += 10;
  if (user.profile?.headline) score += 10;
  if (user.profile?.phone || user.profile?.location) score += 10;
  if ((user.profile?.skills || []).length >= 3) score += 25;
  else if ((user.profile?.skills || []).length > 0) score += 15;
  if ((user.profile?.education || []).length > 0) score += 20;
  if ((user.profile?.experience || []).length > 0) score += 15;
  if ((user.profile?.projects || []).length > 0) score += 10;
  return Math.min(100, Math.max(20, score));
}

userSchema.pre('save', async function () {
  this.updatedAt = new Date();
  
  if (this.role === 'jobseeker' && this.profile) {
    this.profile.profileCompletion = calculateProfileCompletion(this);
  }

  if (this.isModified('passwordHash')) {
    if (this.passwordHash && !this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
  }
});

module.exports = mongoose.model('User', userSchema);

