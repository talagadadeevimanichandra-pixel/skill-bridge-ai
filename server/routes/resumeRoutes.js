const express = require('express');
const router = express.Router();
const { handleUpload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadAndAnalyze,
  getMyResume,
  compareResumeAgainstJob,
  deleteResume,
} = require('../controllers/resumeController');

router.post('/analyze', protect, authorize('jobseeker'), handleUpload('resume'), uploadAndAnalyze);
router.get('/my', protect, authorize('jobseeker'), getMyResume);
router.get('/me', protect, authorize('jobseeker'), getMyResume);
router.post('/compare-job', protect, authorize('jobseeker'), compareResumeAgainstJob);
router.delete('/my', protect, authorize('jobseeker'), deleteResume);

module.exports = router;
