import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Briefcase,
  MapPin,
  Check,
  ArrowRight,
  ChevronDown,
  Building2,
  Users,
  Compass,
  FileText,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import MatchBadge from '../components/MatchBadge';

const LandingPage = () => {
  const { demoLogin, isAuthenticated, isEmployer } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    if (role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const sampleJobs = [
    {
      title: 'Frontend Developer',
      company: 'TechNova Solutions',
      location: 'Bengaluru',
      type: 'Full-time',
      salary: '₹6–9 LPA',
      experience: '1–2 years experience',
      posted: '2 days ago',
      skills: ['React', 'JavaScript', 'TypeScript', 'Git'],
      compatibility: {
        overall: 82,
        matchedSkills: ['React', 'JavaScript', 'Git'],
        missingSkills: ['TypeScript'],
        matchSummary: 'Strong match based on your frontend experience. You may want to strengthen TypeScript before applying.'
      }
    },
    {
      title: 'Full Stack Developer',
      company: 'NextWave Digital',
      location: 'Hyderabad',
      type: 'Hybrid',
      salary: '₹8–12 LPA',
      experience: '1–3 years experience',
      posted: '3 days ago',
      skills: ['React', 'Node.js', 'Express', 'MongoDB'],
      compatibility: {
        overall: 88,
        matchedSkills: ['React', 'Node.js', 'MongoDB'],
        missingSkills: ['Express'],
        matchSummary: 'High alignment with your project history and RESTful backend experience.'
      }
    },
    {
      title: 'Data Analyst',
      company: 'FinEdge Labs',
      location: 'Mumbai',
      type: 'Full-time',
      salary: '₹6–9 LPA',
      experience: '1–2 years experience',
      posted: 'Yesterday',
      skills: ['SQL', 'Python', 'PowerBI', 'Excel'],
      compatibility: {
        overall: 78,
        matchedSkills: ['SQL', 'Python'],
        missingSkills: ['PowerBI'],
        matchSummary: 'Solid database and scripting background with a short learning curve on reporting tools.'
      }
    }
  ];

  const faqs = [
    {
      q: 'How does SkillBridge match jobs with candidates?',
      a: 'SkillBridge compares candidate skill profiles, past projects, and experience with specific employer requirements to calculate a clear compatibility estimate, highlighting matched competencies and areas to strengthen.'
    },
    {
      q: 'Can I upload an existing resume?',
      a: 'Yes. You can upload any standard PDF resume. SkillBridge parses your skills, work experience, education, and projects, providing structural recommendations and formatting insights.'
    },
    {
      q: 'What is the skill gap roadmap?',
      a: 'For any job opening, SkillBridge identifies requirements you have not yet covered and provides a structured 3-step learning plan with official documentation and practice project ideas.'
    },
    {
      q: 'How do employers evaluate candidates?',
      a: 'Employers receive candidate profiles sorted by technical skill alignment and verified experience, allowing recruitment teams to review relevant applicants efficiently.'
    },
    {
      q: 'Can I test the platform with a demo account?',
      a: 'Yes. Use the demo switcher in the navigation bar to log in immediately as a Candidate (Aarav Sharma) or a Recruiter (TechNova Solutions).'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Technical Employment Platform
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Find work that fits your skills.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              SkillBridge helps job seekers discover relevant opportunities and helps employers find candidates based on real skills, experience, and potential.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-colors"
              >
                Find a Job
              </Link>
              <Link
                to="/register?role=employer"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-300 shadow-xs transition-colors"
              >
                Hire Talent
              </Link>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Looking to preview?{' '}
              <button
                type="button"
                onClick={() => handleQuickDemo('jobseeker')}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Launch demo as candidate
              </button>
              {' '}or{' '}
              <button
                type="button"
                onClick={() => handleQuickDemo('employer')}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                as employer
              </button>
            </div>

          </div>

          {/* 2. REALISTIC PRODUCT DASHBOARD PREVIEW */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="ml-2 font-medium text-slate-700">SkillBridge Dashboard Preview</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Candidate View • Aarav Sharma</span>
            </div>

            <div className="p-6 bg-slate-50/50 space-y-6">
              
              {/* Top Summary Banner */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Good morning, Aarav</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    3 new opportunities match your frontend and full-stack profile in Bengaluru and Hyderabad.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    Profile 85% Complete
                  </span>
                  <Link
                    to="/jobs"
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                  >
                    View Matches
                  </Link>
                </div>
              </div>

              {/* Sample Realistic Job Card Preview */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      TN
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">Frontend Developer</h4>
                        <span className="text-[11px] text-slate-500">• Full-time</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        TechNova Solutions • Hyderabad • ₹6–9 LPA • 1–2 years experience
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <MatchBadge compatibility={sampleJobs[0].compatibility} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="tag-skill tag-matched">✓ React</span>
                    <span className="tag-skill tag-matched">✓ JavaScript</span>
                    <span className="tag-skill tag-gap">+ TypeScript</span>
                    <span className="tag-skill tag-matched">✓ Git</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-slate-600 hover:text-slate-900 font-medium">Save</button>
                    <Link to="/jobs" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium">
                      View Job
                    </Link>
                  </div>
                </div>
              </div>

              {/* Realistic Skill Gap Snippet */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Skill Development Suggestion</span>
                  <span className="text-[11px] text-slate-500">Based on active job listings</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Strengthening <strong>TypeScript</strong> will increase your compatibility across 8 additional frontend openings in Bengaluru.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How SkillBridge Works</h2>
            <p className="text-xs text-slate-500">
              Clear, transparent matching based on verifiable skills and project experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">01</span>
              <h3 className="text-sm font-semibold text-slate-900">Profile & Resume</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your technical stack, projects, and education or upload your resume for automatic parsing.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">02</span>
              <h3 className="text-sm font-semibold text-slate-900">Compatibility Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View matched and missing skills on every job listing with clear explanation.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">03</span>
              <h3 className="text-sm font-semibold text-slate-900">Skill Development</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access structured roadmaps, official documentation, and project ideas to bridge skill gaps.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">04</span>
              <h3 className="text-sm font-semibold text-slate-900">Interview Readiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practice technical and behavioral interview questions tailored to specific positions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. REALISTIC FEATURE BREAKDOWN: CANDIDATES & EMPLOYERS */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Candidates */}
            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">For Job Seekers</span>
              <h3 className="text-xl font-bold text-slate-900">Find roles aligned with your experience</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Transparent Compatibility:</strong> Understand why a role fits your background before applying.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Resume Review:</strong> Receive structure and content formatting suggestions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Actionable Roadmaps:</strong> Step-by-step guides to master missing competencies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Mock Interview Sessions:</strong> Practice answering role-specific questions.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  <span>Explore open roles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Employers */}
            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">For Employers</span>
              <h3 className="text-xl font-bold text-slate-900">Discover qualified technical candidates</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Skill-First Review:</strong> Review applicants ranked by technical competency alignment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Job Description Drafting:</strong> Draft comprehensive job postings with structured criteria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Application Pipeline:</strong> Manage candidates from Applied to Review, Interview, and Offer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span><strong>Fair Evaluation:</strong> Evaluate candidates strictly on verified skills and project proof.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/register?role=employer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-slate-900">
                  <span>Start hiring talent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SAMPLE ACTIVE OPENINGS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Opportunities</h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore open software and engineering positions across Indian tech hubs.</p>
            </div>
            <Link to="/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
              View all positions →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sampleJobs.map((job, idx) => (
              <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                  </div>
                  <MatchBadge compatibility={job.compatibility} size="sm" />
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  {job.salary} • {job.type}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {job.skills.map((s, sIdx) => (
                    <span key={sIdx} className="tag-skill text-[10px]">{s}</span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{job.posted}</span>
                  <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Common questions about the SkillBridge platform.</p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER */}
      <section className="py-14 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Connect your skills with your next opportunity.
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Create your profile, explore compatibility scores, and prepare for interviews on SkillBridge.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs"
            >
              Create Account
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
