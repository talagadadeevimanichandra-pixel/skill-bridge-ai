const aiService = require('../services/aiService');
const Job = require('../models/Job');
const inMemoryStore = require('../services/inMemoryStore');
const { calculateJobCompatibility } = require('../services/matchingService');
const { getStatus } = require('../config/db');

// @desc Generate professional Job Description via AI
// @route POST /api/ai/job-description
const generateJobDescription = async (req, res) => {
  try {
    const { title, industry, experienceLevel, keySkills, workplaceType, location, salary } = req.body;

    const result = await aiService.generateJobDescription({
      title,
      industry,
      experienceLevel,
      keySkills,
      workplaceType,
      location,
      salary,
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('generateJobDescription error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate job description.', error: error.message });
  }
};

// @desc Get detailed AI match explanation for a job
// @route POST /api/ai/match
const getJobMatchExplanation = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = req.user;

    const { isConnected } = getStatus();
    let job = null;
    if (isConnected) {
      job = await Job.findById(jobId).lean();
    } else {
      job = inMemoryStore.findJobById(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const compatibility = calculateJobCompatibility(user, job);

    return res.json({
      success: true,
      jobTitle: job.title,
      companyName: job.companyName,
      compatibility,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to evaluate match.', error: error.message });
  }
};

// @desc Generate Skill Gap and Actionable Learning Roadmap
// @route POST /api/ai/skill-gap
const getSkillGapRoadmap = async (req, res) => {
  try {
    const { jobId, targetRole, missingSkills } = req.body;
    const user = req.user;
    const currentSkills = user.profile?.skills || [];

    let targetJobTitle = targetRole || 'Full Stack Developer';
    let skillsToBridge = missingSkills || [];

    if (jobId) {
      const { isConnected } = getStatus();
      let job = null;
      if (isConnected) {
        job = await Job.findById(jobId).lean();
      } else {
        job = inMemoryStore.findJobById(jobId);
      }

      if (job) {
        targetJobTitle = job.title;
        const comp = calculateJobCompatibility(user, job);
        skillsToBridge = comp.missingSkills;
      }
    }

    const roadmap = await aiService.generateSkillGapRoadmap({
      currentSkills,
      targetJobTitle,
      missingSkills: skillsToBridge,
    });

    return res.json({
      success: true,
      roadmap,
      currentSkills,
    });
  } catch (error) {
    console.error('getSkillGapRoadmap error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate skill gap roadmap.', error: error.message });
  }
};

// @desc Generate AI Interview Preparation Pack
// @route POST /api/ai/interview
const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobId, jobTitle, skills, experienceLevel, companyName } = req.body;

    let targetTitle = jobTitle || 'Software Engineer';
    let targetSkills = skills || ['JavaScript', 'React', 'Node.js'];
    let targetExp = experienceLevel || 'Entry Level';
    let targetCompany = companyName || 'Technology Company';

    if (jobId) {
      const { isConnected } = getStatus();
      let job = null;
      if (isConnected) {
        job = await Job.findById(jobId).lean();
      } else {
        job = inMemoryStore.findJobById(jobId);
      }

      if (job) {
        targetTitle = job.title;
        targetSkills = job.skills;
        targetExp = job.experience?.level || 'Entry Level';
        targetCompany = job.companyName;
      }
    }

    const questions = await aiService.generateInterviewQuestions({
      jobTitle: targetTitle,
      skills: targetSkills,
      experienceLevel: targetExp,
      companyName: targetCompany,
    });

    return res.json({
      success: true,
      jobTitle: targetTitle,
      companyName: targetCompany,
      questions,
    });
  } catch (error) {
    console.error('generateInterviewQuestions error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate interview pack.', error: error.message });
  }
};

// @desc Evaluate User Answer to an Interview Question
// @route POST /api/ai/evaluate-answer
const evaluateInterviewAnswer = async (req, res) => {
  try {
    const { question, answer, jobTitle } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Please provide both question and candidate answer.' });
    }

    const evaluation = await aiService.evaluateInterviewAnswer({
      question,
      answer,
      jobTitle: jobTitle || 'Software Engineer',
    });

    return res.json({ success: true, evaluation });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Evaluation failed.', error: error.message });
  }
};

// @desc AI Career Assistant Chat
// @route POST /api/ai/career-assistant
const careerAssistantChat = async (req, res) => {
  try {
    const { message, history, jobId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    let jobContext = null;
    if (jobId) {
      const { isConnected } = getStatus();
      if (isConnected) {
        jobContext = await Job.findById(jobId).lean();
      } else {
        jobContext = inMemoryStore.findJobById(jobId);
      }
    }

    const reply = await aiService.careerAssistantChat({
      message,
      history: history || [],
      userProfile: req.user,
      jobContext,
    });

    return res.json({ success: true, reply });
  } catch (error) {
    console.error('careerAssistantChat error:', error);
    return res.status(500).json({ success: false, message: 'Career assistant is momentarily unavailable.', error: error.message });
  }
};

// @desc Get personalized career recommendations based on user profile
// @route POST /api/ai/career-recommendations
const getCareerRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const recommendations = await aiService.getCareerRecommendations({ userProfile: user });
    return res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('getCareerRecommendations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate career recommendations.', error: error.message });
  }
};

module.exports = {
  generateJobDescription,
  getJobMatchExplanation,
  getSkillGapRoadmap,
  getCareerRecommendations,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  careerAssistantChat,
};
