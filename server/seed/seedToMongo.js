require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const InterviewSession = require('../models/InterviewSession');
const { companies, employers, candidates, jobs, applications } = require('./seedData');

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge_ai';
  console.log('Connecting to MongoDB...');

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Resume.deleteMany({}),
      Notification.deleteMany({}),
      InterviewSession.deleteMany({}),
    ]);
    console.log('✅ Existing collections cleared.');

    console.log('Seeding Users (Employers & Candidates)...');
    const allUsers = [...employers, ...candidates];
    await User.insertMany(allUsers);
    console.log(`✅ Seeded ${allUsers.length} users.`);

    console.log('Seeding Companies...');
    await Company.insertMany(companies);
    console.log(`✅ Seeded ${companies.length} companies.`);

    console.log('Seeding Jobs...');
    await Job.insertMany(jobs);
    console.log(`✅ Seeded ${jobs.length} jobs.`);

    console.log('Seeding Applications...');
    await Application.insertMany(applications);
    console.log(`✅ Seeded ${applications.length} applications.`);

    console.log('\n====================================================');
    console.log('🎉 MONGODB DATABASE SEEDED SUCCESSFULLY!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
