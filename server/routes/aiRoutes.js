const express = require('express');
const router = express.Router();
const {
  generateJobDescription,
  getJobMatchExplanation,
  getSkillGapRoadmap,
  getCareerRecommendations,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  careerAssistantChat,
} = require('../controllers/aiController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

router.post('/job-description', protect, generateJobDescription);
router.post('/match', protect, getJobMatchExplanation);
router.post('/skill-gap', protect, getSkillGapRoadmap);
router.post('/career-recommendations', protect, getCareerRecommendations);
router.post('/interview', protect, generateInterviewQuestions);
router.post('/evaluate-answer', protect, evaluateInterviewAnswer);
router.post('/career-assistant', protect, careerAssistantChat);

module.exports = router;

