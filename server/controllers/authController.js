const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const inMemoryStore = require('../services/inMemoryStore');
const { getStatus } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_production';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register a new user (jobseeker or employer)
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'jobseeker', companyName, location, skills } = req.body;

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' });
    }

    const assignedRole = role === 'employer' ? 'employer' : 'jobseeker';
    const cleanEmail = email.trim().toLowerCase();

    const { isConnected } = getStatus();

    let existingUser = null;
    if (isConnected) {
      existingUser = await User.findOne({ email: cleanEmail });
    } else {
      existingUser = inMemoryStore.findUserByEmail(cleanEmail);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser;
    let newCompany = null;

    if (isConnected) {
      newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        profile: {
          location: location || 'Bengaluru, India',
          skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        }
      });


      if (role === 'employer') {
        newCompany = await Company.create({
          employerId: newUser._id,
          companyName: companyName || `${name}'s Organization`,
          location: location || 'Bengaluru, India',
          description: `Leading software and technology services at ${companyName || name}.`,
        });
        newUser.companyId = newCompany._id;
        await newUser.save();
      }
    } else {
      newUser = inMemoryStore.addUser({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role === 'employer' ? 'employer' : 'jobseeker',
        profile: {
          location: location || 'Bengaluru, India',
          skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
          education: [],
          experience: [],
          projects: [],
          certifications: [],
          preferredJobRoles: ['Software Engineer', 'Frontend Developer'],
          preferredLocations: ['Bengaluru', 'Hyderabad'],
          expectedSalary: { min: 600000, max: 1000000, currency: 'INR' },
        }
      });

      if (role === 'employer') {
        newCompany = inMemoryStore.addCompany({
          employerId: newUser._id,
          companyName: companyName || `${name}'s Organization`,
          location: location || 'Bengaluru, India',
          description: `Leading software and technology services at ${companyName || name}.`,
        });
        newUser.companyId = newCompany._id;
      }
    }

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
        companyId: newUser.companyId,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Registration could not be completed.', error: error.message });
  }
};

// @desc Authenticate user & get token
// @desc Authenticate user & get token
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const { isConnected } = getStatus();
    let user = null;

    if (isConnected) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryStore.findUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    const token = generateToken(user._id);

    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.passwordHash;

    return res.json({
      success: true,
      token,
      user: {
        _id: safeUser._id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
        profile: safeUser.profile,
        companyId: safeUser.companyId,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Authentication error.', error: error.message });
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const safeUser = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete safeUser.passwordHash;
    return res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, profile } = req.body;
    const { isConnected } = getStatus();

    let updatedUser;
    if (isConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      if (name) user.name = name;
      if (profile) {
        user.profile = { ...user.profile.toObject(), ...profile };
      }
      user.updatedAt = new Date();
      await user.save();
      updatedUser = user;
    } else {
      updatedUser = inMemoryStore.updateUser(userId, {
        ...(name && { name }),
        ...(profile && { profile: { ...req.user.profile, ...profile } }),
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

// @desc Demo Login helper for presentation
// @route POST /api/auth/demo-login
const quickDemoLogin = async (req, res) => {
  try {
    const { role = 'jobseeker' } = req.body;
    const { isConnected } = getStatus();

    let user = null;
    const demoCandidateEmail = 'aarav@skillbridge.demo';
    const demoEmployerEmail = 'recruiter@technova.demo';
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);

    if (role === 'employer') {
      if (isConnected) {
        user = await User.findOne({ email: demoEmployerEmail }) || await User.findOne({ role: 'employer' });
        if (!user) {
          user = await User.create({
            name: 'Priya Nambiar',
            email: demoEmployerEmail,
            passwordHash: defaultPasswordHash,
            role: 'employer',
            profile: { location: 'Bengaluru, India' },
          });
          const comp = await Company.create({
            employerId: user._id,
            companyName: 'TechNova Solutions',
            location: 'Bengaluru, India',
            description: 'Leading enterprise cloud and full-stack software company.',
          });
          user.companyId = comp._id;
          await user.save();
        }
      } else {
        user = inMemoryStore.findUserByEmail(demoEmployerEmail) || inMemoryStore.getAllUsers().find(u => u.role === 'employer');
        if (!user) {
          user = inMemoryStore.addUser({
            name: 'Priya Nambiar',
            email: demoEmployerEmail,
            passwordHash: defaultPasswordHash,
            role: 'employer',
            profile: { location: 'Bengaluru, India' },
          });
          const comp = inMemoryStore.addCompany({
            employerId: user._id,
            companyName: 'TechNova Solutions',
            location: 'Bengaluru, India',
            description: 'Leading enterprise cloud and full-stack software company.',
          });
          user.companyId = comp._id;
        }
      }
    } else {
      if (isConnected) {
        user = await User.findOne({ email: demoCandidateEmail }) || await User.findOne({ role: 'jobseeker' });
        if (!user) {
          user = await User.create({
            name: 'Aarav Sharma',
            email: demoCandidateEmail,
            passwordHash: defaultPasswordHash,
            role: 'jobseeker',
            profile: {
              location: 'Bengaluru, India',
              skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
              preferredJobRoles: ['Full Stack Developer', 'Frontend Developer'],
            },
          });
        }
      } else {
        user = inMemoryStore.findUserByEmail(demoCandidateEmail) || inMemoryStore.getAllUsers().find(u => u.role === 'jobseeker');
        if (!user) {
          user = inMemoryStore.addUser({
            name: 'Aarav Sharma',
            email: demoCandidateEmail,
            passwordHash: defaultPasswordHash,
            role: 'jobseeker',
            profile: {
              location: 'Bengaluru, India',
              skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
              preferredJobRoles: ['Full Stack Developer', 'Frontend Developer'],
            },
          });
        }
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo account could not be initialized.' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({ success: false, message: 'Demo sign-in failed.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  quickDemoLogin,
};
