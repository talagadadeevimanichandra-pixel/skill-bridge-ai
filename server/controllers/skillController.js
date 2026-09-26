const Skill = require('../models/Skill');
const Job = require('../models/Job');
const User = require('../models/User');
const inMemoryStore = require('../services/inMemoryStore');
const { getStatus } = require('../config/db');

// @desc Get all skills with search, category filtering and pagination
// @route GET /api/skills
const getSkills = async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      difficulty,
      page = 1,
      limit = 30,
    } = req.query;

    const { isConnected } = getStatus();

    if (isConnected) {
      const query = { status: 'Active' };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (subcategory && subcategory !== 'All') {
        query.subcategory = subcategory;
      }

      if (difficulty && difficulty !== 'All') {
        query.difficulty = difficulty;
      }

      if (search && search.trim()) {
        const s = search.trim();
        query.$or = [
          { name: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
          { subcategory: { $regex: s, $options: 'i' } },
          { relatedSkills: { $in: [new RegExp(s, 'i')] } },
          { commonRoles: { $in: [new RegExp(s, 'i')] } },
        ];
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 30;
      const skip = (pageNum - 1) * limitNum;

      const [skills, totalCount] = await Promise.all([
        Skill.find(query).sort({ category: 1, name: 1 }).skip(skip).limit(limitNum).lean(),
        Skill.countDocuments(query),
      ]);

      return res.json({
        success: true,
        count: skills.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        skills,
      });
    }

    // In-memory fallback
    const filtered = inMemoryStore.searchSkills({
      query: search,
      category,
      subcategory,
      difficulty,
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      count: paginated.length,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum),
      currentPage: pageNum,
      skills: paginated,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving skills library' });
  }
};

// @desc Get skill categories with subcategories and item counts
// @route GET /api/skills/categories
const getCategories = async (req, res) => {
  try {
    const { isConnected } = getStatus();

    if (isConnected) {
      const skills = await Skill.find({ status: 'Active' }, 'category subcategory').lean();
      const map = new Map();

      skills.forEach(s => {
        if (!map.has(s.category)) {
          map.set(s.category, { subcategories: new Set(), count: 0 });
        }
        const catObj = map.get(s.category);
        catObj.count += 1;
        if (s.subcategory) {
          catObj.subcategories.add(s.subcategory);
        }
      });

      const categories = Array.from(map.entries()).map(([category, data]) => ({
        category,
        subcategories: Array.from(data.subcategories),
        count: data.count,
      }));

      return res.json({ success: true, categories });
    }

    // In-memory fallback
    const categories = inMemoryStore.getSkillCategories();
    return res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving categories' });
  }
};

// @desc Get single skill details with matching live jobs
// @route GET /api/skills/:id
const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    let skill = null;
    let relatedJobs = [];

    if (isConnected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        skill = await Skill.findById(id).lean();
      } else {
        skill = await Skill.findOne({ name: new RegExp(`^${id}$`, 'i') }).lean();
      }

      if (skill) {
        // Query live jobs requiring this skill
        const skillNameRegex = new RegExp(skill.name, 'i');
        relatedJobs = await Job.find({
          status: { $in: ['Active', 'published', 'active'] },
          $or: [
            { skills: { $in: [skillNameRegex] } },
            { preferredSkills: { $in: [skillNameRegex] } },
            { title: { $in: (skill.commonRoles || []).map(r => new RegExp(r, 'i')) } },
          ],
        })
          .select('title companyName location workplaceType salary minSalary maxSalary skills jobType')
          .limit(6)
          .lean();
      }
    } else {
      skill = inMemoryStore.findSkillById(id) || inMemoryStore.findSkillByName(id);

      if (skill) {
        const allJobs = inMemoryStore.getAllJobs();
        const skillLower = skill.name.toLowerCase();
        relatedJobs = allJobs
          .filter(j =>
            (j.skills && j.skills.some(s => s.toLowerCase() === skillLower)) ||
            (j.preferredSkills && j.preferredSkills.some(s => s.toLowerCase() === skillLower)) ||
            (skill.commonRoles && skill.commonRoles.some(r => j.title.toLowerCase().includes(r.toLowerCase())))
          )
          .slice(0, 6);
      }
    }

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({
      success: true,
      skill,
      relatedJobs,
    });
  } catch (error) {
    console.error('Error fetching skill detail:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving skill' });
  }
};

// @desc Get user tracked skills
// @route GET /api/skills/my
const getMyTrackedSkills = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { isConnected } = getStatus();

    if (isConnected) {
      const user = await User.findById(userId).select('profile.trackedSkills profile.skills').lean();
      return res.json({
        success: true,
        trackedSkills: user?.profile?.trackedSkills || [],
        profileSkills: user?.profile?.skills || [],
      });
    }

    // In-memory
    const trackedSkills = inMemoryStore.getUserTrackedSkills(userId);
    const user = inMemoryStore.findUserById(userId);
    return res.json({
      success: true,
      trackedSkills,
      profileSkills: user?.profile?.skills || [],
    });
  } catch (error) {
    console.error('Error fetching user tracked skills:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving tracked skills' });
  }
};

// @desc Add or update tracked skill for authenticated user
// @route POST /api/skills/my
const updateMyTrackedSkill = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name, status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const validStatuses = ['Strong', 'Developing', 'Learning'];
    const skillStatus = validStatuses.includes(status) ? status : 'Learning';

    const { isConnected } = getStatus();

    if (isConnected) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.profile) user.profile = {};
      if (!Array.isArray(user.profile.trackedSkills)) {
        user.profile.trackedSkills = [];
      }

      const existingIdx = user.profile.trackedSkills.findIndex(
        s => s.name && s.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (existingIdx !== -1) {
        user.profile.trackedSkills[existingIdx].status = skillStatus;
        user.profile.trackedSkills[existingIdx].updatedAt = new Date();
      } else {
        user.profile.trackedSkills.push({
          name: name.trim(),
          status: skillStatus,
          addedAt: new Date(),
        });
      }

      // Sync with user's core skills array if Strong or Developing
      if (!Array.isArray(user.profile.skills)) {
        user.profile.skills = [];
      }
      if (skillStatus === 'Strong' || skillStatus === 'Developing') {
        if (!user.profile.skills.some(s => s.toLowerCase() === name.trim().toLowerCase())) {
          user.profile.skills.push(name.trim());
        }
      }

      await user.save();

      return res.json({
        success: true,
        message: `Skill ${name} marked as ${skillStatus}`,
        trackedSkills: user.profile.trackedSkills,
      });
    }

    // In-memory
    const trackedSkills = inMemoryStore.updateUserTrackedSkill(userId, name.trim(), skillStatus);
    return res.json({
      success: true,
      message: `Skill ${name} marked as ${skillStatus}`,
      trackedSkills,
    });
  } catch (error) {
    console.error('Error updating tracked skill:', error);
    res.status(500).json({ success: false, message: 'Server error updating tracked skill' });
  }
};

// @desc Remove a tracked skill for authenticated user
// @route DELETE /api/skills/my/:name
const removeMyTrackedSkill = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { name } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { isConnected } = getStatus();

    if (isConnected) {
      const user = await User.findById(userId);
      if (!user || !user.profile || !Array.isArray(user.profile.trackedSkills)) {
        return res.json({ success: true, trackedSkills: [] });
      }

      user.profile.trackedSkills = user.profile.trackedSkills.filter(
        s => s.name && s.name.toLowerCase() !== decodeURIComponent(name).toLowerCase()
      );

      await user.save();

      return res.json({
        success: true,
        message: 'Skill removed from tracked skills',
        trackedSkills: user.profile.trackedSkills,
      });
    }

    // In-memory
    const trackedSkills = inMemoryStore.removeUserTrackedSkill(userId, decodeURIComponent(name));
    return res.json({
      success: true,
      message: 'Skill removed from tracked skills',
      trackedSkills,
    });
  } catch (error) {
    console.error('Error removing tracked skill:', error);
    res.status(500).json({ success: false, message: 'Server error removing tracked skill' });
  }
};

module.exports = {
  getSkills,
  getCategories,
  getSkillById,
  getMyTrackedSkills,
  updateMyTrackedSkill,
  removeMyTrackedSkill,
};
