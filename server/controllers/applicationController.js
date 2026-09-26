const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Resume = require('../models/Resume');
const inMemoryStore = require('../services/inMemoryStore');
const { calculateJobCompatibility } = require('../services/matchingService');
const { createNotificationHelper } = require('./notificationController');
const { getStatus } = require('../config/db');

// @desc Apply to a job
// @route POST /api/applications
const applyToJob = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { jobId, coverNote } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    const { isConnected } = getStatus();

    // Fetch Job & Candidate details
    let job = null;
    let candidate = req.user;

    if (isConnected) {
      job = await Job.findById(jobId);
    } else {
      job = inMemoryStore.findJobById(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check if job is closed
    if (job.status && job.status.toLowerCase() === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is closed and no longer accepting applications.'
      });
    }

    // Check if already applied (Duplicate application prevention)
    let existingApp = null;
    if (isConnected) {
      existingApp = await Application.findOne({ jobId, candidateId });
    } else {
      existingApp = inMemoryStore.getAllApplications().find(
        a => a.jobId.toString() === jobId.toString() && a.candidateId.toString() === candidateId.toString()
      );
    }

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this role.' });
    }

    // Calculate AI match compatibility snapshot
    const matchBreakdown = calculateJobCompatibility(candidate, job);

    let createdApp = null;

    if (isConnected) {
      createdApp = await Application.create({
        jobId,
        candidateId,
        employerId: job.employerId,
        status: 'Applied',
        matchScore: {
          overall: matchBreakdown.overall,
          skillScore: matchBreakdown.skillScore,
          experienceScore: matchBreakdown.experienceScore,
          matchedSkills: matchBreakdown.matchedSkills,
          partialSkills: matchBreakdown.partialSkills,
          missingSkills: matchBreakdown.missingSkills,
          matchSummary: matchBreakdown.matchSummary,
        },
        coverNote: coverNote || '',
      });

      // Update job applicantsCount
      await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });
    } else {
      createdApp = inMemoryStore.addApplication({
        jobId,
        candidateId,
        employerId: job.employerId,
        status: 'Applied',
        matchScore: {
          overall: matchBreakdown.overall,
          skillScore: matchBreakdown.skillScore,
          experienceScore: matchBreakdown.experienceScore,
          matchedSkills: matchBreakdown.matchedSkills,
          partialSkills: matchBreakdown.partialSkills,
          missingSkills: matchBreakdown.missingSkills,
          matchSummary: matchBreakdown.matchSummary,
        },
        coverNote: coverNote || '',
      });
    }

    // Persistent notifications for candidate and employer
    await createNotificationHelper({
      recipientId: candidateId,
      jobId: job._id,
      applicationId: createdApp._id,
      title: 'Application Submitted',
      message: `Your application for "${job.title}" at ${job.companyName} was submitted with a ${matchBreakdown.overall}% compatibility estimate.`,
      type: 'APPLICATION_SUBMITTED',
      link: '/applications',
    });

    if (job.employerId) {
      await createNotificationHelper({
        recipientId: job.employerId,
        senderId: candidateId,
        jobId: job._id,
        applicationId: createdApp._id,
        title: 'New Candidate Application',
        message: `${candidate.name} applied for "${job.title}" with a ${matchBreakdown.overall}% compatibility estimate.`,
        type: 'APPLICATION_SUBMITTED',
        link: `/employer/candidates?jobId=${job._id}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: createdApp,
      matchSummary: matchBreakdown.matchSummary,
    });
  } catch (error) {
    console.error('applyToJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit application.', error: error.message });
  }
};

// @desc Get current candidate applications
// @route GET /api/applications/my
const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    const { isConnected } = getStatus();

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    let apps = [];
    let total = 0;

    if (isConnected) {
      total = await Application.countDocuments({ candidateId });
      apps = await Application.find({ candidateId })
        .populate('jobId')
        .sort({ appliedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean();
    } else {
      const rawApps = inMemoryStore.findApplicationsByCandidate(candidateId);
      total = rawApps.length;
      apps = rawApps.map(app => {
        const job = inMemoryStore.findJobById(app.jobId);
        return {
          ...app,
          jobId: job,
        };
      }).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }

    return res.json({
      success: true,
      count: apps.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      applications: apps
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch your applications.' });
  }
};

// @desc Get applications for a specific job or all employer jobs with candidate matching & ranking
// @route GET /api/jobs/:id/applications or GET /api/applications/employer
const getJobApplications = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { jobId, page = 1, limit = 30 } = req.query; // optional specific filter
    const paramJobId = req.params.id; // from /jobs/:id/applications
    const targetJobId = jobId || paramJobId;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;

    const { isConnected } = getStatus();
    let apps = [];
    let total = 0;

    if (isConnected) {
      const query = { employerId };
      if (targetJobId && targetJobId !== 'all') {
        query.jobId = targetJobId;
      }
      total = await Application.countDocuments(query);
      apps = await Application.find(query)
        .populate('jobId')
        .populate('candidateId', '-passwordHash')
        .sort({ 'matchScore.overall': -1, appliedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean();
    } else {
      let rawApps = targetJobId && targetJobId !== 'all'
        ? inMemoryStore.findApplicationsByJob(targetJobId)
        : inMemoryStore.findApplicationsByEmployer(employerId);

      total = rawApps.length;
      apps = rawApps.map(app => {
        const job = inMemoryStore.findJobById(app.jobId);
        const candidate = inMemoryStore.findUserById(app.candidateId);
        let safeCandidate = candidate ? { ...candidate } : null;
        if (safeCandidate) delete safeCandidate.passwordHash;

        return {
          ...app,
          jobId: job,
          candidateId: safeCandidate,
        };
      }).sort((a, b) => (b.matchScore?.overall || 0) - (a.matchScore?.overall || 0)).slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }

    return res.json({
      success: true,
      count: apps.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      applications: apps
    });
  } catch (error) {
    console.error('getJobApplications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch candidate applications.' });
  }
};

// @desc Update application status (Employer only)
// @route PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate } = req.body;
    const employerId = req.user._id;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const { isConnected } = getStatus();
    let updatedApp = null;
    let candidateId = null;
    let jobId = null;

    if (isConnected) {
      const app = await Application.findById(id).populate('jobId');
      if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

      // Authorization: Employer ownership verification
      if (app.employerId.toString() !== employerId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to modify this application.' });
      }

      app.status = status;
      if (notes !== undefined) app.notes = notes;
      if (interviewDate) app.interviewDate = interviewDate;
      app.updatedAt = new Date();
      await app.save();
      updatedApp = app;
      candidateId = app.candidateId;
      jobId = app.jobId?._id;
    } else {
      updatedApp = inMemoryStore.updateApplicationStatus(id, status, notes, interviewDate);
      if (updatedApp) {
        candidateId = updatedApp.candidateId;
        jobId = updatedApp.jobId;
      }
    }

    // Create candidate notification
    if (candidateId) {
      const isInterview = status === 'Interview' || Boolean(interviewDate);
      await createNotificationHelper({
        recipientId: candidateId,
        senderId: employerId,
        jobId,
        applicationId: id,
        title: isInterview ? 'Interview Scheduled!' : 'Application Status Update',
        message: isInterview
          ? `An interview has been scheduled for your application${interviewDate ? ` on ${new Date(interviewDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}` : ''}.`
          : `Your application status has been updated to "${status}".`,
        type: isInterview ? 'INTERVIEW_SCHEDULED' : 'APPLICATION_STATUS_UPDATED',
        link: '/applications',
      });
    }

    return res.json({
      success: true,
      message: `Candidate status updated to ${status}.`,
      application: updatedApp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};

