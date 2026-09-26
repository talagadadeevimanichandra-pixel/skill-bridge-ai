import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  FileText,
  Compass,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Building2,
  Users,
  CheckCircle2,
  Bookmark,
  Bell,
  Sparkles,
  Award,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isJobSeeker, isEmployer, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setDemoMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside and Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
        setDemoMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setDemoMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    if (role === 'jobseeker') navigate('/dashboard');
    else navigate('/employer/dashboard');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header ref={navRef} className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
              aria-label="SkillBridge Home"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs" aria-hidden="true">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">
                  SkillBridge
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Career Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              
              {/* Public Navigation */}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/jobs"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/jobs')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/skill-gap"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/skill-gap')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Career Resources
                  </Link>
                  <Link
                    to="/register?role=employer"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      location.search.includes('role=employer')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    For Employers
                  </Link>
                </>
              )}

              {/* Logged-In Job Seeker Navigation */}
              {isAuthenticated && isJobSeeker && (
                <>
                  <Link
                    to="/jobs"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/jobs')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/applications"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/applications')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/resume-analyzer"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/resume-analyzer')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Resume
                  </Link>
                  <Link
                    to="/skill-gap"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/skill-gap')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Skill Development
                  </Link>
                  <Link
                    to="/interview-prep"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/interview-prep')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Interview Prep
                  </Link>
                  <Link
                    to="/career-assistant"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/career-assistant')
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Career Assistant
                  </Link>
                </>
              )}

              {/* Logged-In Employer Navigation */}
              {isAuthenticated && isEmployer && (
                <>
                  <Link
                    to="/employer/dashboard"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employer/dashboard')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employer/jobs"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employer/jobs')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/employer/candidates"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employer/candidates')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Candidates
                  </Link>
                  <Link
                    to="/employer/create-job"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employer/create-job')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Post a Job
                  </Link>
                  <Link
                    to="/employer/company"
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employer/company')
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Company
                  </Link>
                </>
              )}

            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Switcher (Subtle) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                aria-expanded={demoMenuOpen}
                aria-haspopup="true"
                aria-label="Toggle demo profile selection"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <span>Demo mode</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {demoMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                >
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Accounts
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => handleDemoSwitch('jobseeker')}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Aarav Sharma</div>
                      <div className="text-[11px] text-slate-500">Job Seeker (Frontend / React)</div>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">Candidate</span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => handleDemoSwitch('employer')}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Priya Nambiar</div>
                      <div className="text-[11px] text-slate-500">TechNova Solutions</div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">Recruiter</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User profile and menu"
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold uppercase" aria-hidden="true">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </button>

                {userDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {user?.role === 'employer' ? 'Employer Account' : 'Job Seeker'}
                      </span>
                    </div>

                    <div className="py-1">
                      {isJobSeeker && (
                        <>
                          <Link
                            to="/profile"
                            role="menuitem"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            Profile Details
                          </Link>
                          <Link
                            to="/applications"
                            role="menuitem"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            Application History
                          </Link>
                        </>
                      )}

                      {isEmployer && (
                        <>
                          <Link
                            to="/employer/company"
                            role="menuitem"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            Company Profile
                          </Link>
                          <Link
                            to="/employer/jobs"
                            role="menuitem"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            Manage Listings
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2 font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 text-sm shadow-xl">
          
          {/* Authenticated user banner on mobile */}
          {isAuthenticated && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-xs">{user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{user?.email}</div>
              </div>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {user?.role === 'employer' ? 'Recruiter' : 'Seeker'}
              </span>
            </div>
          )}

          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
              isActive('/jobs') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Find Jobs
          </Link>

          {!isAuthenticated && (
            <>
              <Link
                to="/skill-gap"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-700 hover:bg-slate-50"
              >
                Career Resources
              </Link>
              <Link
                to="/register?role=employer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-700 hover:bg-slate-50"
              >
                For Employers
              </Link>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}

          {isAuthenticated && isJobSeeker && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/applications') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                My Applications
              </Link>
              <Link
                to="/resume-analyzer"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/resume-analyzer') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Resume Insights
              </Link>
              <Link
                to="/skill-gap"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/skill-gap') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Skill Development
              </Link>
              <Link
                to="/interview-prep"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/interview-prep') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Interview Prep
              </Link>
              <Link
                to="/career-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/career-assistant') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Career Assistant
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/profile') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Candidate Profile
              </Link>
            </>
          )}

          {isAuthenticated && isEmployer && (
            <>
              <Link
                to="/employer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/employer/dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Recruiter Dashboard
              </Link>
              <Link
                to="/employer/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/employer/jobs') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Manage Job Listings
              </Link>
              <Link
                to="/employer/create-job"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/employer/create-job') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Post New Job
              </Link>
              <Link
                to="/employer/candidates"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/employer/candidates') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Candidate Pipeline
              </Link>
              <Link
                to="/employer/company"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors ${
                  isActive('/employer/company') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Company Profile
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => handleDemoSwitch('jobseeker')}
              className="flex-1 py-2 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 text-center hover:bg-slate-200 transition-colors"
            >
              Demo Candidate
            </button>
            <button
              onClick={() => handleDemoSwitch('employer')}
              className="flex-1 py-2 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 text-center hover:bg-slate-200 transition-colors"
            >
              Demo Recruiter
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
