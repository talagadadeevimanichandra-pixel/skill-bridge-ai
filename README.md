# 🚀 SkillBridge AI - AI-Powered Career & Recruitment Intelligence Platform

> **Your Skills. Your Career. Your Next Opportunity.**  
> SkillBridge AI connects candidates with high-compatibility jobs, explains match reasoning transparently, diagnoses skill gaps with step-by-step learning roadmaps, conducts AI mock interviews, and delivers explainable Resume Intelligence.

---

## 🌟 Product Vision & Key Highlights

Traditional employment platforms match candidates based on superficial keyword frequency. **SkillBridge AI** provides an explainable, full-stack recruitment ecosystem:
- **Transparent AI Compatibility Matching:** Calculates multi-factor compatibility scores (skills, experience depth, education, and location), explicitly categorizing **Matched**, **Partial / Adjacent**, and **Missing** skills.
- **Explainable Resume Intelligence:** Analyzes uploaded resumes against industry standards, generating a 0–100 Profile Score with a transparent 7-section breakdown, ATS checks, skill evidence extraction, and version history.
- **Structured Skill Development Library:** Features 12 core tech and career domains with 175+ curated skills, difficulty filters, and interactive progress tracking (`Learning`, `Developing`, `Strong`).
- **Actionable Skill-Gap Roadmaps:** Pinpoints missing skills for any job listing and synthesizes a step-by-step mastery plan, documentation links, and portfolio project recommendations.
- **Interactive AI Mock Interview Simulator:** Generates technical, behavioral, and system design rounds with instant answer scoring and model answer feedback.
- **AI Recruiter Suite:** Enables hiring teams to post vacancies, generate structured job descriptions, and evaluate candidates based on genuine technical compatibility.
- **Conversational Career Copilot:** 24/7 AI mentor answering career questions, resume optimization tips, and project ideation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Lucide React, Canvas Confetti, Axios |
| **Backend** | Node.js, Express.js, Multer, PDF-Parse, JWT, bcryptjs, Morgan, CORS |
| **Database** | MongoDB Atlas, Mongoose *(with built-in high-performance fallback store)* |
| **AI Engine** | Google Gemini API *(with graceful fallback to offline heuristic intelligence)* |
| **Deployment** | Netlify (Frontend SPA), Render / Railway / Docker (Backend) |

---

## 📁 Project Structure

```
skillbridge-ai/
├── client/                     # Frontend React SPA
│   ├── public/
│   │   ├── _redirects          # Netlify SPA redirect rules
│   │   └── favicon.svg         # Brand Favicon
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MatchBadge, SkillGapCard, Modal, StatCard...
│   │   ├── context/            # AuthContext.jsx (JWT auth, role-switching, session recovery)
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, Live Match Simulator, Workflow, FAQ
│   │   │   ├── LoginPage.jsx           # Sign in + Demo Quick Access
│   │   │   ├── RegisterPage.jsx        # Role-based registration (Job Seeker / Employer)
│   │   │   ├── JobSearchPage.jsx       # Search & multi-parameter filtering
│   │   │   ├── JobDetailPage.jsx       # Job specs, AI compatibility panel, 1-click apply
│   │   │   ├── seeker/                 # Dashboard, Profile, Resume Intelligence, Skill Gap, Interview
│   │   │   └── employer/               # Dashboard, Job Creator, Candidate Pipeline
│   │   ├── services/api.js     # Centralized Axios client with dynamic VITE_API_URL normalization
│   │   ├── utils/helpers.js    # Formatting utilities
│   │   ├── App.jsx             # React Router routing & Protected Routes
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── config/db.js            # MongoDB Atlas connection & auto-seed handler
│   ├── controllers/            # Auth, Job, Application, Resume, Company, Skill, AI controllers
│   ├── middleware/             # JWT auth, RBAC, Rate limiter, Multer PDF upload
│   ├── models/                 # User, Job, Company, Resume, Application, Skill, InterviewSession
│   ├── routes/                 # Express REST endpoints
│   ├── seed/                   # 24+ jobs, 8+ companies, 175+ skills, realistic Indian candidates
│   ├── services/
│   │   ├── aiService.js        # Gemini AI integration + fallback generators
│   │   ├── matchingService.js  # Multi-factor AI compatibility algorithm
│   │   ├── resumeIntelligenceService.js # Resume parsing & transparent scoring
│   │   └── inMemoryStore.js    # Resilient demo persistence store
│   ├── .env.example
│   ├── index.js                # Express app entry point
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore                  # Comprehensive gitignore rules
├── netlify.toml                # Netlify SPA configuration
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚡ Quick Start (Local Setup)

### 1. Install Dependencies
```bash
# From root directory
npm run install:all
```

Or install separately:
```bash
cd server && npm install
cd ../client && npm install
```

---

### 2. Environment Configuration

Copy `.env.example` in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillbridge_ai
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

In `client/` (optional for local dev with Vite proxy):
```env
VITE_API_URL=/api
```

---

### 3. Run Application

**Start Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Start Frontend Client:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 👤 Instant Demo Credentials

Use the **Test with Demo Accounts** quick buttons on the Login page or sign in manually:

| Role | Demo Email | Password | Profile Highlights |
|---|---|---|---|
| **Candidate** | `aarav@skillbridge.demo` | `password123` | Aarav Sharma (Full Stack Developer, Bengaluru) |
| **Recruiter** | `recruiter@technova.demo` | `password123` | Priya Nambiar (Technical Recruiter @ TechNova Solutions) |
| **Data/ML Candidate** | `ananya.reddy@skillbridge.demo` | `password123` | Ananya Reddy (ML Engineer, Hyderabad) |

---

## 🌐 Production Deployment

### Backend (Render / Railway)
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node index.js` (or `npm start`)
- **Environment Variables:**
  - `MONGODB_URI` = MongoDB Atlas connection string
  - `JWT_SECRET` = Strong random 256-bit string
  - `CLIENT_URL` = Netlify frontend URL (e.g. `https://your-site.netlify.app`)
  - `GEMINI_API_KEY` = *(Optional)* Google Gemini API Key

### Frontend (Netlify)
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL` = Your deployed backend URL (e.g. `https://your-backend.onrender.com`)

---

## 🔒 Security & Privacy Practices

- 🛡️ **Strict Secret Isolation:** Database URIs, JWT secrets, and AI keys remain server-side.
- 🔑 **Bcrypt Password Encryption:** 10-round salted password hashing.
- 🛡️ **Role-Based Access Control:** Strict RBAC separating candidate and employer access.
- 🌐 **Protected CORS:** Normalized origin validation preventing unauthorized cross-origin calls.
- 🧹 **Error Sanitization:** Zero database traces or stack leaks returned in production API responses.
