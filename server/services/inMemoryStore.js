const { companies, employers, candidates, jobs, applications } = require('../seed/seedData');
const rawSkills = require('../seed/skillsData');
const skillsList = Array.isArray(rawSkills) ? rawSkills : (rawSkills.skillsData || []);

let storeUsers = [...(employers || []), ...(candidates || [])];
let storeCompanies = [...(companies || [])];
let storeJobs = [...(jobs || [])];
let storeApplications = [...(applications || [])];
let storeResumes = [];
let storeInterviews = [];
let storeSkills = skillsList.map((s, idx) => ({
  ...s,
  _id: s._id || `skill_${idx + 1}_${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
  status: s.status || 'Active',
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// Users
function getAllUsers() { return storeUsers; }
function findUserById(id) {
  if (!id) return null;
  return storeUsers.find(u => u._id && u._id.toString() === id.toString()) || null;
}
function findUserByEmail(email) {
  if (!email) return null;
  return storeUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
}
function addUser(user) {
  const newUser = {
    ...user,
    _id: user._id || 'mock_user_' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storeUsers.push(newUser);
  return newUser;
}
function updateUser(id, updates) {
  const user = findUserById(id);
  if (!user) return null;
  Object.assign(user, updates, { updatedAt: new Date() });
  return user;
}

// Jobs
function getAllJobs() { return storeJobs; }
function findJobById(id) {
  if (!id) return null;
  return storeJobs.find(j => j._id && j._id.toString() === id.toString()) || null;
}
function addJob(job) {
  const newJob = {
    ...job,
    _id: job._id || 'mock_job_' + Date.now(),
    applicantsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storeJobs.unshift(newJob);
  return newJob;
}
function updateJob(id, updates) {
  const job = findJobById(id);
  if (!job) return null;
  Object.assign(job, updates, { updatedAt: new Date() });
  return job;
}
function deleteJob(id) {
  if (!id) return null;
  const idx = storeJobs.findIndex(j => j._id && j._id.toString() === id.toString());
  if (idx !== -1) {
    return storeJobs.splice(idx, 1)[0];
  }
  return null;
}

// Companies
function getAllCompanies() { return storeCompanies; }
function findCompanyById(id) {
  if (!id) return null;
  return storeCompanies.find(c => c._id && c._id.toString() === id.toString()) || null;
}
function findCompanyByEmployerId(empId) {
  if (!empId) return null;
  return storeCompanies.find(c => c.employerId && c.employerId.toString() === empId.toString()) || null;
}
function addCompany(comp) {
  const newComp = {
    ...comp,
    _id: comp._id || 'mock_comp_' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storeCompanies.push(newComp);
  return newComp;
}
function updateCompany(id, updates) {
  const comp = findCompanyById(id);
  if (!comp) return null;
  Object.assign(comp, updates, { updatedAt: new Date() });
  return comp;
}

// Applications
function getAllApplications() { return storeApplications; }
function findApplicationsByCandidate(candId) {
  if (!candId) return [];
  return storeApplications.filter(a => a.candidateId && a.candidateId.toString() === candId.toString());
}
function findApplicationsByJob(jobId) {
  if (!jobId) return [];
  return storeApplications.filter(a => a.jobId && a.jobId.toString() === jobId.toString());
}
function findApplicationsByEmployer(empId) {
  if (!empId) return [];
  return storeApplications.filter(a => a.employerId && a.employerId.toString() === empId.toString());
}
function addApplication(app) {
  const newApp = {
    ...app,
    _id: app._id || 'mock_app_' + Date.now() + Math.random().toString(36).substr(2, 4),
    appliedAt: new Date(),
    updatedAt: new Date(),
  };
  storeApplications.unshift(newApp);
  
  const job = findJobById(app.jobId);
  if (job) {
    job.applicantsCount = (job.applicantsCount || 0) + 1;
  }
  return newApp;
}
function updateApplicationStatus(id, status, notes = '', interviewDate = null) {
  if (!id) return null;
  const app = storeApplications.find(a => a._id && a._id.toString() === id.toString());
  if (!app) return null;
  app.status = status;
  if (notes) app.notes = notes;
  if (interviewDate) app.interviewDate = interviewDate;
  app.updatedAt = new Date();
  return app;
}

// Resumes
function saveResume(resume) {
  const existingIdx = storeResumes.findIndex(r => r.userId && r.userId.toString() === resume.userId.toString());
  if (existingIdx !== -1) {
    const existing = storeResumes[existingIdx];
    const newVersion = (existing.currentVersion || 1) + 1;
    const versions = existing.versions || [];
    versions.unshift({
      versionNumber: existing.currentVersion || 1,
      fileName: existing.fileName,
      fileUrl: existing.fileUrl,
      targetRole: existing.targetRole || 'Full Stack Developer',
      overallScore: existing.intelligence?.overallScore || existing.aiAnalysis?.overallScore || 75,
      scoreLabel: existing.intelligence?.scoreLabel || 'Developing',
      scoreBreakdown: existing.intelligence?.scoreBreakdown || {},
      differencesFromPrevious: resume.intelligence?.comparisonAgainstPrevious?.improvementsDetected || [],
      createdAt: existing.uploadedAt || new Date(),
    });

    const updated = {
      ...existing,
      ...resume,
      _id: existing._id,
      currentVersion: newVersion,
      versions,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    };
    storeResumes[existingIdx] = updated;
    return updated;
  }

  const newRes = {
    ...resume,
    _id: resume._id || 'mock_res_' + Date.now(),
    currentVersion: 1,
    versions: [],
    uploadedAt: new Date(),
    updatedAt: new Date(),
  };
  storeResumes.unshift(newRes);
  return newRes;
}

function findResumeByUserId(userId) {
  if (!userId) return null;
  return storeResumes.find(r => r.userId && r.userId.toString() === userId.toString()) || null;
}

function deleteResumeByUserId(userId) {
  if (!userId) return false;
  const idx = storeResumes.findIndex(r => r.userId && r.userId.toString() === userId.toString());
  if (idx !== -1) {
    storeResumes.splice(idx, 1);
    return true;
  }
  return false;
}

// Interview Sessions
function saveInterviewSession(session) {
  const newSess = {
    ...session,
    _id: session._id || 'mock_sess_' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storeInterviews.unshift(newSess);
  return newSess;
}
function findInterviewsByUserId(userId) {
  if (!userId) return [];
  return storeInterviews.filter(s => s.userId && s.userId.toString() === userId.toString());
}

// Notifications
let storeNotifications = [];


function addNotification(notif) {
  const newNotif = {
    ...notif,
    _id: notif._id || 'mock_notif_' + Date.now() + Math.random().toString(36).substr(2, 4),
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storeNotifications.unshift(newNotif);
  return newNotif;
}

function getNotificationsByUserId(userId) {
  if (!userId) return [];
  return storeNotifications.filter(n => n.recipientId && n.recipientId.toString() === userId.toString());
}

function markNotificationAsRead(id) {
  const notif = storeNotifications.find(n => n._id && n._id.toString() === id.toString());
  if (notif) {
    notif.isRead = true;
    notif.updatedAt = new Date();
  }
  return notif;
}

function markAllNotificationsAsRead(userId) {
  storeNotifications.forEach(n => {
    if (n.recipientId && n.recipientId.toString() === userId.toString()) {
      n.isRead = true;
      n.updatedAt = new Date();
    }
  });
  return true;
}

function deleteNotification(id) {
  const idx = storeNotifications.findIndex(n => n._id && n._id.toString() === id.toString());
  if (idx !== -1) {
    return storeNotifications.splice(idx, 1)[0];
  }
  return null;
}

// Skills
function getAllSkills() {
  return storeSkills;
}

function findSkillById(id) {
  if (!id) return null;
  return storeSkills.find(s => s._id && s._id.toString() === id.toString()) || null;
}

function findSkillByName(name) {
  if (!name) return null;
  return storeSkills.find(s => s.name && s.name.toLowerCase() === name.toLowerCase()) || null;
}

function searchSkills({ query, category, subcategory, difficulty }) {
  let result = [...storeSkills];

  if (category && category !== 'All') {
    result = result.filter(s => s.category && s.category.toLowerCase() === category.toLowerCase());
  }

  if (subcategory && subcategory !== 'All') {
    result = result.filter(s => s.subcategory && s.subcategory.toLowerCase() === subcategory.toLowerCase());
  }

  if (difficulty && difficulty !== 'All') {
    result = result.filter(s => s.difficulty && s.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.subcategory && s.subcategory.toLowerCase().includes(q)) ||
      (s.relatedSkills && s.relatedSkills.some(r => r.toLowerCase().includes(q))) ||
      (s.commonRoles && s.commonRoles.some(r => r.toLowerCase().includes(q)))
    );
  }

  return result;
}

function getSkillCategories() {
  const map = new Map();
  storeSkills.forEach(s => {
    if (!map.has(s.category)) {
      map.set(s.category, new Set());
    }
    if (s.subcategory) {
      map.get(s.category).add(s.subcategory);
    }
  });

  return Array.from(map.entries()).map(([category, subcats]) => ({
    category,
    subcategories: Array.from(subcats),
    count: storeSkills.filter(s => s.category === category).length,
  }));
}

function getUserTrackedSkills(userId) {
  const user = findUserById(userId);
  if (!user || !user.profile) return [];
  return user.profile.trackedSkills || [];
}

function updateUserTrackedSkill(userId, skillName, status) {
  const user = findUserById(userId);
  if (!user) return null;
  if (!user.profile) user.profile = {};
  if (!Array.isArray(user.profile.trackedSkills)) {
    user.profile.trackedSkills = [];
  }

  const existingIdx = user.profile.trackedSkills.findIndex(
    s => s.name && s.name.toLowerCase() === skillName.toLowerCase()
  );

  if (existingIdx !== -1) {
    user.profile.trackedSkills[existingIdx].status = status;
    user.profile.trackedSkills[existingIdx].updatedAt = new Date();
  } else {
    user.profile.trackedSkills.push({
      name: skillName,
      status: status || 'Learning',
      addedAt: new Date(),
    });
  }

  // Also sync with user.profile.skills array if Strong or Developing
  if (!Array.isArray(user.profile.skills)) {
    user.profile.skills = [];
  }
  if (status === 'Strong' || status === 'Developing') {
    if (!user.profile.skills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      user.profile.skills.push(skillName);
    }
  }

  user.updatedAt = new Date();
  return user.profile.trackedSkills;
}

function removeUserTrackedSkill(userId, skillName) {
  const user = findUserById(userId);
  if (!user || !user.profile || !Array.isArray(user.profile.trackedSkills)) return [];

  user.profile.trackedSkills = user.profile.trackedSkills.filter(
    s => s.name && s.name.toLowerCase() !== skillName.toLowerCase()
  );
  user.updatedAt = new Date();
  return user.profile.trackedSkills;
}

module.exports = {
  getAllUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateUser,
  getAllJobs,
  findJobById,
  addJob,
  updateJob,
  deleteJob,
  getAllCompanies,
  findCompanyById,
  findCompanyByEmployerId,
  addCompany,
  updateCompany,
  getAllApplications,
  findApplicationsByCandidate,
  findApplicationsByJob,
  findApplicationsByEmployer,
  addApplication,
  updateApplicationStatus,
  saveResume,
  findResumeByUserId,
  deleteResumeByUserId,
  saveInterviewSession,
  findInterviewsByUserId,
  addNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getAllSkills,
  findSkillById,
  findSkillByName,
  searchSkills,
  getSkillCategories,
  getUserTrackedSkills,
  updateUserTrackedSkill,
  removeUserTrackedSkill,
};

