import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration and auth recovery
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                           error.config?.url?.includes('/auth/register') ||
                           error.config?.url?.includes('/auth/demo-login');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('skillbridge_token');
      localStorage.removeItem('skillbridge_user');

      // Dispatch event for AuthContext & UI recovery
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('skillbridge_session_expired', {
          detail: {
            message: error.response?.data?.message || 'Your session has expired. Please sign in again.',
          }
        }));
      }
    } else if (error.response?.status === 405) {
      error.message = 'Unable to reach backend API. The request was routed to static frontend hosting. Please configure VITE_API_URL in your deployment environment.';
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  demoLogin: (role) => API.post('/auth/demo-login', { role }),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Jobs Endpoints
export const jobsAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getRecommended: () => API.get('/jobs/recommended'),
  getSaved: () => API.get('/jobs/saved'),
  save: (id) => API.post(`/jobs/${id}/save`),
  unsave: (id) => API.delete(`/jobs/${id}/save`),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  getEmployerJobs: () => API.get('/jobs/employer/my'),
};

// Applications Endpoints
export const applicationsAPI = {
  apply: (data) => API.post('/applications', data),
  getMyApplications: () => API.get('/applications/my'),
  getEmployerApplications: (params) => API.get('/applications/employer', { params }),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
};

// Resume Endpoints
export const resumeAPI = {
  analyze: (formData) => API.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyResume: () => API.get('/resume/my'),
  compareJob: (data) => API.post('/resume/compare-job', data),
  deleteResume: () => API.delete('/resume/my'),
};

// Company Endpoints
export const companyAPI = {
  getMyCompany: () => API.get('/company/my'),
  updateMyCompany: (data) => API.put('/company/my', data),
  getAll: () => API.get('/company'),
  getById: (id) => API.get(`/company/${id}`),
};

// AI Endpoints
export const aiAPI = {
  generateJobDescription: (data) => API.post('/ai/job-description', data),
  getMatchExplanation: (jobId) => API.post('/ai/match', { jobId }),
  getSkillGap: (data) => API.post('/ai/skill-gap', data),
  getCareerRecommendations: () => API.post('/ai/career-recommendations'),
  generateInterviewQuestions: (data) => API.post('/ai/interview', data),
  evaluateAnswer: (data) => API.post('/ai/evaluate-answer', data),
  careerAssistant: (data) => API.post('/ai/career-assistant', data),
};

// Notifications Endpoints
export const notificationsAPI = {
  getAll: (params) => API.get('/notifications', { params }),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// Skills Endpoints
export const skillsAPI = {
  getAll: (params) => API.get('/skills', { params }),
  getCategories: () => API.get('/skills/categories'),
  getById: (id) => API.get(`/skills/${id}`),
  getMySkills: () => API.get('/skills/my'),
  updateMySkill: (data) => API.post('/skills/my', data),
  removeMySkill: (name) => API.delete(`/skills/my/${encodeURIComponent(name)}`),
};

export default API;


