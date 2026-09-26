const express = require('express');
const router = express.Router();
const {
  getSkills,
  getCategories,
  getSkillById,
  getMyTrackedSkills,
  updateMyTrackedSkill,
  removeMyTrackedSkill,
} = require('../controllers/skillController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public / Semi-public routes
router.get('/', optionalProtect, getSkills);
router.get('/categories', getCategories);

// Protected user skill tracking routes (placed before /:id to avoid collision)
router.get('/my', protect, getMyTrackedSkills);
router.post('/my', protect, updateMyTrackedSkill);
router.delete('/my/:name', protect, removeMyTrackedSkill);

// Single skill details by ID or Name
router.get('/:id', optionalProtect, getSkillById);

module.exports = router;
