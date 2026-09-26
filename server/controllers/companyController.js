const Company = require('../models/Company');
const inMemoryStore = require('../services/inMemoryStore');
const { getStatus } = require('../config/db');

// @desc Get current employer's company profile
// @route GET /api/company/my
const getMyCompany = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { isConnected } = getStatus();

    let company = null;
    if (isConnected) {
      company = await Company.findOne({ employerId }).lean();
      if (!company) {
        // Auto-create default
        company = await Company.create({
          employerId,
          companyName: `${req.user.name}'s Organization`,
          location: req.user.profile?.location || 'Bengaluru, India',
          description: "Innovating tomorrow's digital solutions.",
        });
      }
    } else {
      company = inMemoryStore.findCompanyByEmployerId(employerId);
      if (!company) {
        company = inMemoryStore.addCompany({
          employerId,
          companyName: `${req.user.name}'s Organization`,
          location: req.user.profile?.location || 'Bengaluru, India',
          description: "Innovating tomorrow's digital solutions.",
        });
      }
    }

    return res.json({ success: true, company });
  } catch (error) {
    console.error('getMyCompany error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch company profile.', error: error.message });
  }
};

// @desc Update company profile (Employer only)
// @route PUT /api/company/my
const updateMyCompany = async (req, res) => {
  try {
    const employerId = req.user._id;
    const { companyName, logo, industry, location, website, description, size, benefits } = req.body;
    const { isConnected } = getStatus();

    let updated = null;
    if (isConnected) {
      let company = await Company.findOne({ employerId });
      if (!company) {
        company = new Company({ employerId });
      }

      if (companyName) company.companyName = companyName;
      if (logo !== undefined) company.logo = logo;
      if (industry) company.industry = industry;
      if (location) company.location = location;
      if (website !== undefined) company.website = website;
      if (description) company.description = description;
      if (size) company.size = size;
      if (benefits) company.benefits = Array.isArray(benefits) ? benefits : benefits.split(',').map(b => b.trim());

      company.updatedAt = new Date();
      await company.save();
      updated = company;
    } else {
      let company = inMemoryStore.findCompanyByEmployerId(employerId);
      const payload = {
        ...(companyName && { companyName }),
        ...(logo !== undefined && { logo }),
        ...(industry && { industry }),
        ...(location && { location }),
        ...(website !== undefined && { website }),
        ...(description && { description }),
        ...(size && { size }),
        ...(benefits && { benefits: Array.isArray(benefits) ? benefits : benefits.split(',').map(b => b.trim()) }),
      };
      if (company) {
        updated = inMemoryStore.updateCompany(company._id, payload);
      } else {
        updated = inMemoryStore.addCompany({ employerId, ...payload });
      }
    }

    return res.json({ success: true, message: 'Company profile updated successfully.', company: updated });
  } catch (error) {
    console.error('updateMyCompany error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update company profile.', error: error.message });
  }
};

// @desc Get company by ID
// @route GET /api/company/:id
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    let company = null;
    if (isConnected) {
      company = await Company.findById(id).lean();
    } else {
      company = inMemoryStore.findCompanyById(id);
    }

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    return res.json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch company.', error: error.message });
  }
};

// @desc Get all companies
// @route GET /api/company
const getAllCompanies = async (req, res) => {
  try {
    const { isConnected } = getStatus();
    let companies = [];
    if (isConnected) {
      companies = await Company.find().lean();
    } else {
      companies = inMemoryStore.getAllCompanies();
    }

    return res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch companies.' });
  }
};

module.exports = {
  getMyCompany,
  updateMyCompany,
  getCompanyById,
  getAllCompanies,
};
