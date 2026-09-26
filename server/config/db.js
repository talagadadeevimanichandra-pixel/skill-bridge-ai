const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { companies, employers, candidates, jobs, applications } = require('../seed/seedData');

const Skill = require('../models/Skill');
const rawSkills = require('../seed/skillsData');
const skillsList = Array.isArray(rawSkills) ? rawSkills : (rawSkills.skillsData || []);

let isConnected = false;
let isMockMode = false;

const seedInitialDataIfEmpty = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('[Database] MongoDB is empty. Seeding realistic Indian tech ecosystem dataset...');
      
      // Seed users
      const allUsers = [...employers, ...candidates];
      for (const u of allUsers) {
        const exists = await User.findById(u._id);
        if (!exists) {
          await User.create(u);
        }
      }

      // Seed companies
      for (const c of companies) {
        const exists = await Company.findById(c._id);
        if (!exists) {
          await Company.create(c);
        }
      }

      // Seed jobs
      for (const j of jobs) {
        const exists = await Job.findById(j._id);
        if (!exists) {
          await Job.create(j);
        }
      }

      // Seed sample applications
      for (const a of applications) {
        const exists = await Application.findById(a._id);
        if (!exists) {
          await Application.create(a);
        }
      }

      console.log('[Database] Initial MongoDB Atlas dataset seeded successfully.');
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0 && skillsList.length > 0) {
      console.log('[Database] Seeding skills library into MongoDB...');
      for (const s of skillsList) {
        await Skill.findOneAndUpdate(
          { name: s.name },
          { $set: s },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`[Database] Seeded ${skillsList.length} skills into MongoDB.`);
    }
  } catch (seedErr) {
    console.warn('[Database] Auto-seeding notice:', seedErr.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }
  const rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge_ai';
  // Redact credentials for secure logging
  const sanitizedUri = rawUri.replace(/\/\/(.*?):(.*?)@/, '//***:***@');

  try {
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connected', () => {
      isConnected = true;
      isMockMode = false;
      console.log(`[Database] MongoDB Connection Established to: ${sanitizedUri}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[Database] MongoDB runtime error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected.');
      isConnected = false;
    });

    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 4000,
      autoIndex: true,
    });

    isConnected = true;
    isMockMode = false;
    console.log(`[Database] Connected to MongoDB host: ${conn.connection.host}`);

    // Auto-seed if database is freshly created
    await seedInitialDataIfEmpty();

    return true;
  } catch (error) {
    console.warn(`[Database] Direct MongoDB connection unreached (${error.message}).`);
    console.log(`[Database] Initializing In-Memory High-Performance Fallback Store with full persistence for hackathon demo.`);
    isConnected = false;
    isMockMode = true;
    return false;
  }
};

const getStatus = () => ({
  isConnected,
  isMockMode,
});

module.exports = { connectDB, getStatus, seedInitialDataIfEmpty };
