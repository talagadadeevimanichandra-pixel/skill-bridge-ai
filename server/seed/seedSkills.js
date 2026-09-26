require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const skillsData = require('./skillsData');

async function seedSkills() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge_ai';
  console.log(`[Skills Seed] Connecting to MongoDB: ${uri}`);

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('[Skills Seed] Connected to MongoDB.');
    }

    console.log(`[Skills Seed] Processing ${skillsData.length} skills across categories...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const skill of skillsData) {
      const result = await Skill.findOneAndUpdate(
        { name: skill.name },
        { $set: skill },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result.isNew) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }

    const totalCount = await Skill.countDocuments();
    const categories = await Skill.distinct('category');

    console.log('[Skills Seed] ✅ Skills seeded successfully!');
    console.log(`- Total Skills in DB: ${totalCount}`);
    console.log(`- Categories Count: ${categories.length}`);
    console.log(`- Categories: ${categories.join(', ')}`);

    return { totalCount, categoriesCount: categories.length };
  } catch (error) {
    console.error('[Skills Seed] Error seeding skills:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedSkills()
    .then(() => {
      console.log('[Skills Seed] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Skills Seed] Failed:', err);
      process.exit(1);
    });
}

module.exports = seedSkills;
