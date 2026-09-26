require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Skill = require('../models/Skill');
const { companies, employers, candidates, jobs, applications } = require('./seedData');
const skillsData = require('./skillsData');

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge_ai';
  console.log(`[Seed Runner] Connecting to MongoDB: ${uri}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed Runner] MongoDB connected successfully.');

    // Clear existing collections
    console.log('[Seed Runner] Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      Skill.deleteMany({}),
    ]);

    // Insert companies
    console.log('[Seed Runner] Seeding companies...');
    await Company.insertMany(companies);

    // Insert users (employers + candidates)
    console.log('[Seed Runner] Seeding users...');
    await User.insertMany([...employers, ...candidates]);

    // Insert jobs
    console.log('[Seed Runner] Seeding jobs...');
    await Job.insertMany(jobs);

    // Insert applications
    console.log('[Seed Runner] Seeding applications...');
    await Application.insertMany(applications);

    // Insert skills
    console.log('[Seed Runner] Seeding skill library...');
    await Skill.insertMany(skillsData);

    console.log('[Seed Runner] ✅ Seeding completed successfully!');
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Users: ${employers.length + candidates.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Applications: ${applications.length}`);
    console.log(`- Skills: ${skillsData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Runner] Error during seeding:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
