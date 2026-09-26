const express = require('express');
const router = express.Router();
const {
  getJobs,
  getRecommendedJobs,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { getJobApplications } = require('../controllers/applicationController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');

router.get('/', optionalProtect, getJobs);
router.get('/recommended', protect, getRecommendedJobs);
router.get('/saved', protect, getSavedJobs);
router.get('/employer/my', protect, authorize('employer'), getEmployerJobs);
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);
router.get('/:id', optionalProtect, getJobById);
router.get('/:id/applications', protect, authorize('employer'), getJobApplications);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;

