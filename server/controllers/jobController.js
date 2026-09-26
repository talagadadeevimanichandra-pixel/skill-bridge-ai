const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const inMemoryStore = require('../services/inMemoryStore');
const { calculateJobCompatibility } = require('../services/matchingService');
const { getStatus } = require('../config/db');

// @desc Get all jobs with filtering, search, sorting and personalized AI matching
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      role,
      jobType,
      workplaceType,
      experienceLevel,
      minSalary,
      skills,
      sortBy = 'recent', // 'recent' | 'match' | 'salary_high' | 'salary_low'
      page = 1,
      limit = 50,
    } = req.query;

    const { isConnected } = getStatus();
    let jobsList = [];

    if (isConnected) {
      const query = { status: { $in: ['Active', 'published', 'active'] } };

      if (search && search.trim()) {
        const s = search.trim();
        query.$or = [
          { title: { $regex: s, $options: 'i' } },
          { companyName: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
          { skills: { $in: [new RegExp(s, 'i')] } },
          { preferredSkills: { $in: [new RegExp(s, 'i')] } },
          { location: { $regex: s, $options: 'i' } },
          { workplaceType: { $regex: s, $options: 'i' } },
        ];
      }

      if (skills) {
        const skillArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        query.skills = { $in: skillArray.map(s => new RegExp(s, 'i')) };
      }

      if (location && location !== 'all') {
        query.location = { $regex: location, $options: 'i' };
      }

      if (jobType && jobType !== 'all') {
        query.jobType = jobType;
      }

      if (workplaceType && workplaceType !== 'all') {
        query.workplaceType = workplaceType;
      }

      if (experienceLevel && experienceLevel !== 'all') {
        query['experience.level'] = experienceLevel;
      }

      if (role && role !== 'all') {
        query.title = { $regex: role, $options: 'i' };
      }

      if (minSalary) {
        query['salary.max'] = { $gte: Number(minSalary) };
      }

      jobsList = await Job.find(query).lean();
    } else {
      jobsList = inMemoryStore.getAllJobs().filter(j => j.status === 'Active' || j.status === 'published');

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        jobsList = jobsList.filter(j => 
          (j.title || '').toLowerCase().includes(q) ||
          (j.companyName || '').toLowerCase().includes(q) ||
          (j.description || '').toLowerCase().includes(q) ||
          (j.skills || []).some(s => s.toLowerCase().includes(q)) ||
          (j.preferredSkills || []).some(s => s.toLowerCase().includes(q)) ||
          (j.location || '').toLowerCase().includes(q) ||
          (j.workplaceType || '').toLowerCase().includes(q)
        );
      }

      if (skills) {
        const skillArray = (Array.isArray(skills) ? skills : skills.split(',')).map(s => s.trim().toLowerCase());
        jobsList = jobsList.filter(j => 
          (j.skills || []).some(s => skillArray.includes(s.toLowerCase()))
        );
      }

      if (location && location !== 'all') {
        const locLower = location.toLowerCase();
        jobsList = jobsList.filter(j => (j.location || '').toLowerCase().includes(locLower) || (j.workplaceType || '').toLowerCase().includes(locLower));
      }

      if (jobType && jobType !== 'all') {
        jobsList = jobsList.filter(j => j.jobType === jobType);
      }

      if (workplaceType && workplaceType !== 'all') {
        jobsList = jobsList.filter(j => (j.workplaceType || '').toLowerCase() === workplaceType.toLowerCase());
      }

      if (experienceLevel && experienceLevel !== 'all') {
        jobsList = jobsList.filter(j => j.experience?.level === experienceLevel);
      }

      if (role && role !== 'all') {
        const rLower = role.toLowerCase();
        jobsList = jobsList.filter(j => (j.title || '').toLowerCase().includes(rLower));
      }

      if (minSalary) {
        jobsList = jobsList.filter(j => (j.salary?.max || 0) >= Number(minSalary));
      }
    }

    // If user is logged in as jobseeker, calculate AI match score for each job
    const currentUser = req.user;
    const enrichedJobs = jobsList.map(job => {
      const compatibility = currentUser && currentUser.role === 'jobseeker'
        ? calculateJobCompatibility(currentUser, job)
        : null;

      return {
        ...job,
        compatibility,
      };
    });

    // Sorting
    if (sortBy === 'match') {
      enrichedJobs.sort((a, b) => {
        const aScore = a.compatibility?.overall || (a.salary?.max ? a.salary.max / 100000 : 70);
        const bScore = b.compatibility?.overall || (b.salary?.max ? b.salary.max / 100000 : 70);
        return bScore - aScore;
      });
    } else if (sortBy === 'salary_high') {
      enrichedJobs.sort((a, b) => (b.salary?.max || b.salary?.min || 0) - (a.salary?.max || a.salary?.min || 0));
    } else if (sortBy === 'salary_low') {
      enrichedJobs.sort((a, b) => (a.salary?.min || a.salary?.max || 0) - (b.salary?.min || b.salary?.max || 0));
    } else {
      enrichedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const total = enrichedJobs.length;
    const paginated = enrichedJobs.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      jobs: paginated,
    });
  } catch (error) {
    console.error('getJobs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs.', error: error.message });
  }
};

// @desc Get single job by ID with detailed compatibility breakdown
// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    let job = null;
    let company = null;

    if (isConnected) {
      job = await Job.findById(id).lean();
      if (job && job.companyId) {
        company = await Company.findById(job.companyId).lean();
      }
    } else {
      job = inMemoryStore.findJobById(id);
      if (job && job.companyId) {
        company = inMemoryStore.findCompanyById(job.companyId);
      }
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const currentUser = req.user;
    const compatibility = currentUser && currentUser.role === 'jobseeker'
      ? calculateJobCompatibility(currentUser, job)
      : null;

    return res.json({
      success: true,
      job: {
        ...job,
        company,
        compatibility,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch job details.', error: error.message });
  }
};

// @desc Create a new job (Employer only)
// @route POST /api/jobs
const createJob = async (req, res) => {
  try {
    const employerId = req.user._id;
    const {
      title,
      description,
      responsibilities,
      skills,
      preferredSkills,
      experience,
      education,
      location,
      workplaceType,
      salary,
      jobType,
      deadline,
    } = req.body;

    if (!title || !description || !skills || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, skills, and location.'
      });
    }

    const { isConnected } = getStatus();
    let company = null;

    if (isConnected) {
      company = await Company.findOne({ employerId });
      const newJob = await Job.create({
        employerId,
        companyId: company?._id,
        companyName: company?.companyName || req.user.name,
        companyLogo: company?.logo || '',
        title,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : []),
        skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
        experience: experience || { minYears: 0, maxYears: 3, level: 'Entry Level' },
        education: education || "Bachelor's degree in engineering or related field",
        location,
        workplaceType: workplaceType || 'Hybrid',
        salary: salary || { min: 600000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: jobType || 'Full-time',
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      return res.status(201).json({ success: true, message: 'Job created successfully.', job: newJob });
    } else {
      company = inMemoryStore.findCompanyByEmployerId(employerId);
      const newJob = inMemoryStore.addJob({
        employerId,
        companyId: company?._id,
        companyName: company?.companyName || req.user.name,
        companyLogo: company?.logo || '',
        title,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : []),
        skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
        experience: experience || { minYears: 0, maxYears: 3, level: 'Entry Level' },
        education: education || "Bachelor's degree in engineering or related field",
        location,
        workplaceType: workplaceType || 'Hybrid',
        salary: salary || { min: 600000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: jobType || 'Full-time',
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Active',
      });

      return res.status(201).json({ success: true, message: 'Job created successfully.', job: newJob });
    }
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create job.', error: error.message });
  }
};

// @desc Update job (Employer only)
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    let updated;
    if (isConnected) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      if (job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to modify this job.' });
      }

      Object.assign(job, req.body, { updatedAt: new Date() });
      await job.save();
      updated = job;
    } else {
      const job = inMemoryStore.findJobById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      if (job.employerId && job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to modify this job.' });
      }

      updated = inMemoryStore.updateJob(id, req.body);
    }

    return res.json({ success: true, message: 'Job updated successfully.', job: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update job.' });
  }
};

// @desc Delete job (Employer only)
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    if (isConnected) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      if (job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this job.' });
      }

      await Job.findByIdAndDelete(id);
    } else {
      const job = inMemoryStore.findJobById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      if (job.employerId && job.employerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this job.' });
      }

      inMemoryStore.deleteJob(id);
    }

    return res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
};


// @desc Get all jobs created by the current employer
// @route GET /api/jobs/employer/my
const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { isConnected } = getStatus();

    let jobsList = [];
    if (isConnected) {
      jobsList = await Job.find({ employerId }).sort({ createdAt: -1 }).lean();
    } else {
      jobsList = inMemoryStore.getAllJobs().filter(j => j.employerId && j.employerId.toString() === employerId.toString());
    }

    return res.json({ success: true, count: jobsList.length, jobs: jobsList });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch employer jobs.' });
  }
};

// @desc Get recommended jobs ranked by compatibility for the authenticated jobseeker
// @route GET /api/jobs/recommended
const getRecommendedJobs = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Authentication required for personalized recommendations.' });
    }

    const { isConnected } = getStatus();
    let jobsList = [];
    if (isConnected) {
      jobsList = await Job.find({ status: 'Active' }).lean();
    } else {
      jobsList = inMemoryStore.getAllJobs().filter(j => j.status === 'Active');
    }

    const ranked = jobsList.map(job => {
      const compatibility = calculateJobCompatibility(currentUser, job);
      return {
        job,
        matchScore: compatibility.matchScore,
        matchedSkills: compatibility.matchedSkills,
        missingSkills: compatibility.missingSkills,
        explanation: compatibility.explanation,
        compatibility,
      };
    });

    ranked.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      count: ranked.length,
      recommendations: ranked,
    });
  } catch (error) {
    console.error('getRecommendedJobs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recommended jobs.', error: error.message });
  }
};

// @desc Save a job for current user
// @route POST /api/jobs/:id/save
const saveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isConnected } = getStatus();

    if (isConnected) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedJobs: id }
      });
      const updatedUser = await User.findById(userId).select('savedJobs');
      return res.json({
        success: true,
        message: 'Job saved successfully.',
        savedJobs: updatedUser ? updatedUser.savedJobs : [id],
      });
    } else {
      const job = inMemoryStore.findJobById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const user = inMemoryStore.findUserById(userId);
      if (user) {
        user.savedJobs = user.savedJobs || [];
        if (!user.savedJobs.some(jid => jid.toString() === id.toString())) {
          user.savedJobs.push(id);
        }
      }
      return res.json({
        success: true,
        message: 'Job saved successfully.',
        savedJobs: user ? user.savedJobs : [id],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save job.', error: error.message });
  }
};

// @desc Unsave a job for current user
// @route DELETE /api/jobs/:id/save
const unsaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isConnected } = getStatus();

    if (isConnected) {
      await User.findByIdAndUpdate(userId, {
        $pull: { savedJobs: id }
      });
      const updatedUser = await User.findById(userId).select('savedJobs');
      return res.json({
        success: true,
        message: 'Job removed from saved jobs.',
        savedJobs: updatedUser ? updatedUser.savedJobs : [],
      });
    } else {
      const user = inMemoryStore.findUserById(userId);
      if (user && user.savedJobs) {
        user.savedJobs = user.savedJobs.filter(jid => jid.toString() !== id.toString());
      }
      return res.json({
        success: true,
        message: 'Job removed from saved jobs.',
        savedJobs: user ? user.savedJobs : [],
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to unsave job.', error: error.message });
  }
};

// @desc Get saved jobs for current user
// @route GET /api/jobs/saved
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isConnected } = getStatus();

    let savedJobIds = [];
    if (isConnected) {
      const user = await User.findById(userId).select('savedJobs');
      savedJobIds = user ? user.savedJobs || [] : [];
    } else {
      const user = inMemoryStore.findUserById(userId);
      savedJobIds = user ? user.savedJobs || [] : [];
    }

    if (!savedJobIds.length) {
      return res.json({ success: true, count: 0, jobs: [] });
    }

    let jobsList = [];
    if (isConnected) {
      jobsList = await Job.find({ _id: { $in: savedJobIds } }).lean();
    } else {
      jobsList = inMemoryStore.getAllJobs().filter(j => savedJobIds.some(sid => sid.toString() === j._id.toString()));
    }

    const currentUser = req.user;
    const enrichedJobs = jobsList.map(job => {
      const compatibility = currentUser && currentUser.role === 'jobseeker'
        ? calculateJobCompatibility(currentUser, job)
        : null;

      return {
        ...job,
        compatibility,
        isSaved: true,
      };
    });

    return res.json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch saved jobs.', error: error.message });
  }
};

module.exports = {
  getJobs,
  getRecommendedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  saveJob,
  unsaveJob,
  getSavedJobs,
};

