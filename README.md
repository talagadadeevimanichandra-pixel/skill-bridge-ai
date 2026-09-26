# 🚀 SkillBridge AI - AI-Powered Career & Recruitment Intelligence Platform

> **Your Skills. Your Career. Your Next Opportunity.**  
> SkillBridge AI connects candidates with high-compatibility jobs, explains match reasoning transparently, diagnoses skill gaps with step-by-step learning roadmaps, and conducts AI mock interviews.

---

## 🌟 Product Vision & Key Highlights

Traditional employment platforms match candidates based on superficial keyword frequency. **SkillBridge AI** reimagines tech recruitment with:
- **Transparent AI Compatibility Estimation:** Calculates multi-factor compatibility scores (skills, experience depth, education, and location), explicitly categorizing **Matched**, **Partial / Adjacent**, and **Missing** skills.
- **Actionable Skill-Gap Roadmaps:** Pinpoints missing skills for any role and automatically synthesizes a 3-step mastery plan, official documentation/courses, and portfolio projects to reach 90%+ match scores.
- **AI Resume Extraction & ATS Readability:** Extracts structured skills, experience, projects, and certifications from PDF resumes and provides ATS score optimization.
- **Interactive AI Mock Interview Simulator:** Generates Technical, Behavioral, and System Design rounds for any job post with real-time answer scoring and refined model answers.
- **AI Job Description Generator:** Enables recruiters to generate high-converting, professional job descriptions in seconds and rank applicants by genuine technical fit without resume fatigue.
- **AI Career Copilot:** 24/7 conversational mentor answering questions about resume enhancements, high-ROI skills, and portfolio project ideation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router v7, Lucide React, Canvas Confetti, Axios |
| **Backend** | Node.js, Express.js, Multer, PDF-Parse, JWT, bcryptjs, Morgan, CORS |
| **Database** | MongoDB Atlas, Mongoose *(with built-in high-performance fallback demo store)* |
| **AI Engine** | Google Gemini 1.5 Flash API *(with graceful fallback to offline intelligence engine)* |
| **Deployment** | Netlify (Frontend SPA), Node/Docker compatible (Backend) |

---

## 📁 Project Folder Structure

```
Skill bridge ai/
├── client/                     # Frontend React SPA
│   ├── public/
│   │   └── favicon.svg         # SVG Brand Favicon
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MatchBadge, SkillGapCard, Modal, StatCard...
│   │   ├── context/            # AuthContext.jsx (JWT auth, role-switching, demo presets)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, Live Match Simulator, Workflow, Testimonials, FAQ
│   │   │   ├── LoginPage.jsx           # Sign in + 1-Click Demo Login Presets
│   │   │   ├── RegisterPage.jsx        # Role-based registration (Job Seeker / Employer)
│   │   │   ├── JobSearchPage.jsx       # Search, filter by role/city/salary, sort by AI match
│   │   │   ├── JobDetailPage.jsx       # Full job specs, compatibility panel, apply modal
│   │   │   ├── seeker/                 # Seeker Dashboard, Profile, AI Resume, Skill Gap, Interview
│   │   │   └── employer/               # Employer Dashboard, AI Job Creator, Candidate Ranking
│   │   ├── services/api.js     # Axios API service client
│   │   ├── utils/helpers.js    # Currency formatting (INR), date formatting, match colors
│   │   ├── App.jsx             # React Router routing & Protected Routes
│   │   ├── index.css           # Tailwind CSS imports, gradients, glass effects
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── config/db.js            # MongoDB Atlas connection & fallback handler
│   ├── controllers/            # Auth, Job, Application, Resume, Company, AI controllers
│   ├── middleware/             # JWT auth & Multer PDF upload middleware
│   ├── models/                 # User, Job, Company, Resume, Application, InterviewSession
│   ├── routes/                 # Express REST endpoints
│   ├── seed/                   # Realistic seed data (10+ jobs, 5+ companies, 8+ candidates)
│   ├── services/
│   │   ├── aiService.js        # Google Gemini 1.5 integration + resilient fallback generators
│   │   ├── matchingService.js  # Multi-factor AI compatibility algorithm
│   │   └── inMemoryStore.js    # Resilient demo persistence store
│   ├── index.js                # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── netlify.toml                # Netlify SPA redirect & build config
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚡ Quick Start (Local Setup)

### 1. Clone & Install Dependencies

In the project root directory, run:
```bash
# Install root, backend and frontend dependencies
npm run install:all
```

Alternatively, install individually:
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

---

### 2. Environment Configuration

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillbridge_ai
JWT_SECRET=skillbridge_super_secret_jwt_key_2026_production
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Note on AI & Database Fallbacks:**  
> If `GEMINI_API_KEY` is not provided or Gemini is unreachable, SkillBridge AI **gracefully falls back to high-yield built-in AI generators**. If MongoDB is offline, it seamlessly activates the **in-memory demo store**, ensuring a **100% functional hackathon presentation**.

---

### 3. Seed Realistic Indian Tech Data (Optional)

To seed 10+ jobs, 5+ companies, and 8+ candidates into MongoDB:
```bash
cd server
npm run seed
```

---

### 4. Run the Application

**Start the Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Start the Frontend Client:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 👤 Instant Demo Credentials (Hackathon Testing)

You can use the **1-Click Demo Switcher** in the top navigation bar or log in manually with:

| Role | Demo Email | Password | Preloaded Profile Highlights |
|---|---|---|---|
| **Job Seeker** | `aarav@skillbridge.demo` | `password123` | Aarav Sharma (MERN Stack, VIT graduate, Bengaluru) |
| **Employer** | `recruiter@nextgen.demo` | `password123` | Priya Nambiar (Recruiter @ NextGen Dynamics) |
| **AI/ML Candidate** | `ananya.reddy@skillbridge.demo` | `password123` | Ananya Reddy (PyTorch, RAG Pipelines, Hyderabad) |

---

## 🌐 Netlify Deployment Instructions

1. Connect your GitHub repository to **Netlify**.
2. Set the build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. In Netlify **Environment Variables**, set:
   - `VITE_API_URL` = URL of your deployed Node.js backend (e.g. `https://skillbridge-api.onrender.com/api`)
4. Deploy site! `netlify.toml` will handle single-page application routing automatically.

---

## 🔒 Security Best Practices Implemented

- ✅ **Zero Secrets on Frontend:** Gemini API keys and JWT secrets are strictly managed on the backend.
- ✅ **Bcrypt Password Hashing:** 10-round salt hashing for all passwords.
- ✅ **Stateless JWT Authentication:** 30-day token lifetime with header bearer authentication.
- ✅ **Role-Based Access Control (RBAC):** Strict separation between Job Seeker and Employer endpoints.
- ✅ **Sanitized AI Parsing:** Automated markdown sanitization and structured JSON schema validation.
- ✅ **Fairness & Bias Prevention:** Sensitive demographic attributes are never used in candidate scoring.

---

## 🏆 Hackathon Evaluation Checklist

- [x] Full-stack architecture with React + Vite frontend and Node.js + Express backend.
- [x] AI Compatibility Matching score with matched, partial, and missing skills breakdown.
- [x] PDF Resume upload and AI extraction (Skills, Education, Experience, Projects, ATS score).
- [x] Skill-gap analysis with step-by-step mastery paths and suggested portfolio projects.
- [x] AI Interview simulator with technical/behavioral rounds and live answer grading.
- [x] Recruiter hub with AI Job Description generator and candidate match ranking.
- [x] Realistic Indian tech market demo data across Bengaluru, Hyderabad, Chennai, Pune, Visakhapatnam, Vijayawada, Mumbai, and Delhi.
- [x] Tested production build with 0 compiler or console errors.
