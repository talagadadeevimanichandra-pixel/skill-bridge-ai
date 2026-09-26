const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const User = require('../models/User');
const inMemoryStore = require('../services/inMemoryStore');
const { analyzeResume } = require('../services/aiService');
const { calculateJobCompatibility } = require('../services/matchingService');
const { createNotificationHelper } = require('./notificationController');
const { getStatus } = require('../config/db');

// @desc Upload and analyze resume with comprehensive Resume Intelligence
// @route POST /api/resume/analyze
const uploadAndAnalyze = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const targetRole = req.body?.targetRole || req.user.profile?.preferredRoles?.[0] || 'Full Stack Developer';

    let resumeText = '';
    let fileName = 'uploaded_resume.pdf';
    let fileSize = 0;
    let fileUrl = '';

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;
      fileUrl = `/uploads/${req.file.filename}`;

      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text || '';
      } catch (parseErr) {
        console.warn('[Resume] PDF text extraction note, continuing with text extraction:', parseErr.message);
        resumeText = `Resume of ${req.user.name}. Target Role: ${targetRole}. Skills: ${(req.user.profile?.skills || []).join(', ')}`;
      }
    } else if (req.body && req.body.resumeText) {
      resumeText = req.body.resumeText;
      fileName = req.body.fileName || 'custom_resume.txt';
    } else {
      // Use candidate profile data as base
      const userSkills = (req.user.profile?.skills || ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs']).join(', ');
      resumeText = `Candidate: ${req.user.name || 'Aarav Sharma'}\nEmail: ${req.user.email || 'aarav.sharma@example.com'}\nPhone: ${req.user.profile?.phone || '+91 98765 43210'}\nTarget Role: ${targetRole}\nSkills: ${userSkills}\nProjects:\n- SkillBridge AI Career Platform: Web application built with React, Node.js, MongoDB and Tailwind CSS to track skill roadmaps and automated career intelligence. Built with responsive components and REST APIs.\n- Distributed Microservices Dashboard: Node.js and Redis service visualizing system telemetry and metrics.\nExperience:\n- Web Engineering Intern at CodeCraft Technologies (May 2024 - Aug 2024): Developed responsive user interfaces in React, integrated backend REST endpoints in Node.js, and improved bundle loading by 28%.\nEducation:\n- B.Tech in Computer Science and Engineering (2021 - 2025), GPA: 8.8 / 10.0\nCertifications:\n- AWS Certified Cloud Practitioner (2024)\nLinks:\n- GitHub: github.com/candidate\n- LinkedIn: linkedin.com/in/candidate`;
      fileName = `${(req.user.name || 'candidate').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`;
    }

    const { isConnected } = getStatus();

    // Fetch previous analysis if available for Before/After comparison
    let previousResume = null;
    if (isConnected) {
      previousResume = await Resume.findOne({ userId }).lean();
    } else {
      previousResume = inMemoryStore.findResumeByUserId(userId);
    }

    const previousAnalysis = previousResume?.intelligence || null;

    // Run Full Resume Intelligence Engine
    const analysisResult = await analyzeResume(resumeText, fileName, targetRole, previousAnalysis);

    let savedResume = null;
    const previousVersions = previousResume?.versions || [];

    // Create current version record if previous existed
    if (previousResume && previousResume.intelligence) {
      previousVersions.unshift({
        versionNumber: previousResume.currentVersion || 1,
        fileName: previousResume.fileName,
        fileUrl: previousResume.fileUrl,
        targetRole: previousResume.targetRole || 'Full Stack Developer',
        overallScore: previousResume.intelligence?.overallScore || 75,
        scoreLabel: previousResume.intelligence?.scoreLabel || 'Developing',
        scoreBreakdown: previousResume.intelligence?.scoreBreakdown || {},
        differencesFromPrevious: analysisResult.intelligence?.comparisonAgainstPrevious?.improvementsDetected || [],
        createdAt: previousResume.uploadedAt || new Date(),
      });
    }

    const newVersionNumber = (previousResume?.currentVersion || 0) + 1;

    const resumePayload = {
      userId,
      fileName,
      fileUrl,
      fileSize,
      rawText: resumeText.slice(0, 15000),
      targetRole,
      currentVersion: newVersionNumber,
      versions: previousVersions.slice(0, 10),
      extractedData: analysisResult.extractedData || {
        name: analysisResult.name || req.user.name,
        email: analysisResult.email || req.user.email,
        phone: analysisResult.phone || req.user.profile?.phone || '',
        location: analysisResult.location || req.user.profile?.location || '',
        skills: analysisResult.skills || [],
        categorizedSkills: analysisResult.categorizedSkills || {},
        education: analysisResult.education || [],
        experience: analysisResult.experience || [],
        projects: analysisResult.projects || [],
        certifications: analysisResult.certifications || [],
        achievements: analysisResult.achievements || [],
      },
      intelligence: analysisResult.intelligence,
      aiAnalysis: analysisResult.aiAnalysis,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    };

    if (isConnected) {
      let existingResume = await Resume.findOne({ userId });
      if (existingResume) {
        Object.assign(existingResume, resumePayload);
        await existingResume.save();
        savedResume = existingResume;
      } else {
        savedResume = await Resume.create(resumePayload);
      }

      // Sync extracted skills & education to user profile
      const user = await User.findById(userId);
      if (user) {
        if (analysisResult.skills && analysisResult.skills.length > 0) {
          const mergedSkills = Array.from(new Set([...(user.profile.skills || []), ...analysisResult.skills]));
          user.profile.skills = mergedSkills;
        }
        if (analysisResult.education && analysisResult.education.length > 0 && (!user.profile.education || user.profile.education.length === 0)) {
          user.profile.education = analysisResult.education;
        }
        if (analysisResult.experience && analysisResult.experience.length > 0 && (!user.profile.experience || user.profile.experience.length === 0)) {
          user.profile.experience = analysisResult.experience;
        }
        if (analysisResult.projects && analysisResult.projects.length > 0 && (!user.profile.projects || user.profile.projects.length === 0)) {
          user.profile.projects = analysisResult.projects;
        }
        user.profile.resumeUrl = fileUrl || user.profile.resumeUrl;
        user.profile.resumeId = savedResume._id;
        await user.save();
      }
    } else {
      savedResume = inMemoryStore.saveResume(resumePayload);

      // Auto-update in-memory user profile
      const user = inMemoryStore.findUserById(userId);
      if (user) {
        const mergedSkills = Array.from(new Set([...(user.profile?.skills || []), ...(analysisResult.skills || [])]));
        inMemoryStore.updateUser(userId, {
          profile: {
            ...(user.profile || {}),
            skills: mergedSkills,
            resumeUrl: fileUrl || user.profile?.resumeUrl,
            resumeId: savedResume._id,
            ...(analysisResult.education?.length && { education: analysisResult.education }),
            ...(analysisResult.experience?.length && { experience: analysisResult.experience }),
            ...(analysisResult.projects?.length && { projects: analysisResult.projects }),
          },
        });
      }
    }

    // Create notification
    await createNotificationHelper({
      recipientId: userId,
      title: 'Resume Intelligence Complete',
      message: `Your resume "${fileName}" was evaluated with an Overall Profile Score of ${analysisResult.intelligence?.overallScore || 80}/100 for ${targetRole}.`,
      type: 'RESUME_ANALYSIS_COMPLETE',
      link: '/resume-analyzer',
    });

    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully with transparent Resume Intelligence!',
      resume: savedResume,
    });
  } catch (error) {
    console.error('uploadAndAnalyze error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze resume.', error: error.message });
  }
};

// @desc Get current candidate resume analysis and version history
// @route GET /api/resume/my
const getMyResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { isConnected } = getStatus();

    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ userId }).lean();
    } else {
      resume = inMemoryStore.findResumeByUserId(userId);
    }

    if (!resume) {
      return res.status(200).json({
        success: true,
        hasResume: false,
        resume: null,
      });
    }

    return res.json({
      success: true,
      hasResume: true,
      resume,
    });
  } catch (error) {
    console.error('getMyResume error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve resume.' });
  }
};

// @desc Compare active resume directly against a specific job posting
// @route POST /api/resume/compare-job
const compareResumeAgainstJob = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required for job-specific analysis' });
    }

    const { isConnected } = getStatus();
    let resume = null;
    let job = null;

    if (isConnected) {
      [resume, job] = await Promise.all([
        Resume.findOne({ userId }).lean(),
        Job.findById(jobId).lean(),
      ]);
    } else {
      resume = inMemoryStore.findResumeByUserId(userId);
      job = inMemoryStore.findJobById(jobId);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Please upload or analyze a resume first.' });
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const candidateSkills = resume.extractedData?.skills || [];
    const jobSkills = job.skills || [];
    const jobPreferred = job.preferredSkills || [];

    const matched = [];
    const partiallyMatched = [];
    const missing = [];

    const lowerCandidate = candidateSkills.map(s => s.toLowerCase());

    jobSkills.forEach(reqSkill => {
      const lower = reqSkill.toLowerCase();
      if (lowerCandidate.includes(lower)) {
        matched.push({
          skill: reqSkill,
          status: 'Matched',
          evidence: `Found in candidate extracted skills and projects.`,
        });
      } else if (lowerCandidate.some(c => c.includes(lower) || lower.includes(c))) {
        partiallyMatched.push({
          skill: reqSkill,
          status: 'Partially Matched',
          evidence: `Related skill found in profile.`,
        });
      } else {
        missing.push({
          skill: reqSkill,
          status: 'Not Detected',
          suggestion: `Consider highlighting practical experience with ${reqSkill} if applicable.`,
        });
      }
    });

    jobPreferred.forEach(prefSkill => {
      const lower = prefSkill.toLowerCase();
      if (lowerCandidate.includes(lower)) {
        matched.push({
          skill: prefSkill,
          status: 'Preferred Skill Matched',
          evidence: `Found in candidate competencies.`,
        });
      } else {
        missing.push({
          skill: prefSkill,
          status: 'Preferred Skill Missing',
          suggestion: `Preferred requirement for ${job.title}.`,
        });
      }
    });

    const totalReqs = jobSkills.length + jobPreferred.length;
    const matchRatio = totalReqs > 0 ? (matched.length + partiallyMatched.length * 0.5) / totalReqs : 0.8;
    const compatibilityScore = Math.min(98, Math.max(35, Math.round(matchRatio * 100)));

    return res.json({
      success: true,
      job: {
        id: job._id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        workplaceType: job.workplaceType,
      },
      compatibilityScore,
      matchedRequirements: matched,
      partiallyMatchedRequirements: partiallyMatched,
      missingRequirements: missing,
      suggestedImprovements: missing.slice(0, 3).map(m => `Showcase hands-on exposure to ${m.skill} in projects or work history.`),
    });
  } catch (error) {
    console.error('compareResumeAgainstJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compare resume against job.' });
  }
};

// @desc Delete candidate resume
// @route DELETE /api/resume/my
const deleteResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { isConnected } = getStatus();

    if (isConnected) {
      await Resume.deleteOne({ userId });
      await User.findByIdAndUpdate(userId, {
        $unset: { 'profile.resumeUrl': 1, 'profile.resumeId': 1 },
      });
    } else {
      inMemoryStore.deleteResumeByUserId(userId);
      const user = inMemoryStore.findUserById(userId);
      if (user && user.profile) {
        delete user.profile.resumeUrl;
        delete user.profile.resumeId;
      }
    }

    return res.json({
      success: true,
      message: 'Resume removed successfully.',
    });
  } catch (error) {
    console.error('deleteResume error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
};

module.exports = {
  uploadAndAnalyze,
  getMyResume,
  compareResumeAgainstJob,
  deleteResume,
};
