const express = require('express');
const router = express.Router();
const { getMyCompany, updateMyCompany, getCompanyById, getAllCompanies } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllCompanies);
router.get('/my', protect, authorize('employer'), getMyCompany);
router.get('/me', protect, authorize('employer'), getMyCompany);
router.put('/my', protect, authorize('employer'), updateMyCompany);
router.put('/me', protect, authorize('employer'), updateMyCompany);
router.get('/:id', getCompanyById);

module.exports = router;
