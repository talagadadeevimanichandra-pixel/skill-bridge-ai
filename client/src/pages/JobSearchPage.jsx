import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatSalary, formatDate } from '../utils/helpers';
import MatchBadge from '../components/MatchBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  Check,
  CheckCircle2,
  X,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

const JobSearchPage = () => {
  const { user, isAuthenticated, isJobSeeker } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'all');
  const [role, setRole] = useState(searchParams.get('role') || 'all');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'all');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'all');
  const [sortBy, setSortBy] = useState(isAuthenticated && isJobSeeker ? 'match' : 'recent');
  const [onlySaved, setOnlySaved] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [recommendedFallbackJobs, setRecommendedFallbackJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Saved Jobs tracking
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Multi-step Application Flow Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyStep, setApplyStep] = useState(1); // 1: Profile, 2: Resume, 3: Note, 4: Review, 5: Submitted
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getAll({
        search: search.trim() || undefined,
        location: location !== 'all' ? location : undefined,
        role: role !== 'all' ? role : undefined,
        jobType: jobType !== 'all' ? jobType : undefined,
        experienceLevel: experienceLevel !== 'all' ? experienceLevel : undefined,
        sortBy,
      });

      if (res.data?.success) {
        const fetched = res.data.jobs || [];
        setJobs(fetched);
        setTotalCount(res.data.total || fetched.length);
        if (fetched.length > 0 && recommendedFallbackJobs.length === 0) {
          setRecommendedFallbackJobs(fetched.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, location, role, jobType, experienceLevel, sortBy]);

  // Sync saved jobs from backend if authenticated
  useEffect(() => {
    if (isAuthenticated && isJobSeeker) {
      jobsAPI.getSaved().then(res => {
        if (res.data?.success && res.data.jobs) {
          const ids = res.data.jobs.map(j => j._id);
          setSavedJobIds(ids);
          localStorage.setItem('skillbridge_saved_jobs', JSON.stringify(ids));
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, isJobSeeker]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleClearAllFilters = () => {
    setSearch('');
    setSearchInput('');
    setLocation('all');
    setRole('all');
    setJobType('all');
    setExperienceLevel('all');
    setOnlySaved(false);
  };

  const handleToggleSave = async (jobId) => {
    const isCurrentlySaved = savedJobIds.includes(jobId);
    let updated;
    if (isCurrentlySaved) {
      updated = savedJobIds.filter(id => id !== jobId);
      setSavedJobIds(updated);
      localStorage.setItem('skillbridge_saved_jobs', JSON.stringify(updated));
      if (isAuthenticated) {
        try { await jobsAPI.unsave(jobId); } catch (e) {}
      }
    } else {
      updated = [...savedJobIds, jobId];
      setSavedJobIds(updated);
      localStorage.setItem('skillbridge_saved_jobs', JSON.stringify(updated));
      if (isAuthenticated) {
        try { await jobsAPI.save(jobId); } catch (e) {}
      }
    }
  };

  // Open Application Flow
  const handleOpenApply = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedJob(job);
    setApplyStep(1);
    setCoverNote('');
    setApplyError('');
    setSubmittedApp(null);
    setApplyModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedJob) return;
    setSubmitting(true);
    setApplyError('');

    try {
      const res = await applicationsAPI.apply({
        jobId: selectedJob._id,
        coverNote,
      });

      if (res.data?.success) {
        setSubmittedApp(res.data.application);
        setApplyStep(5); // Step 5: Submitted Confirmation
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Unable to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const locationsList = [
    { value: 'all', label: 'All Locations' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Visakhapatnam', label: 'Visakhapatnam' },
    { value: 'Vijayawada', label: 'Vijayawada' },
    { value: 'Delhi', label: 'Delhi NCR' },
    { value: 'Remote', label: 'Remote' },
  ];

  const rolesList = [
    { value: 'all', label: 'All Roles' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'React Developer', label: 'React Developer' },
    { value: 'Node.js Developer', label: 'Node.js Developer' },
    { value: 'Python Developer', label: 'Python Developer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'AI/ML', label: 'AI/ML Intern' },
    { value: 'Cloud Engineer', label: 'Cloud Engineer' },
    { value: 'DevOps Intern', label: 'DevOps Intern' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'QA Engineer', label: 'QA Engineer' },
    { value: 'Cybersecurity Intern', label: 'Cybersecurity Intern' },
  ];

  const hasActiveFilters = Boolean(
    search.trim() ||
    location !== 'all' ||
    role !== 'all' ||
    jobType !== 'all' ||
    experienceLevel !== 'all'
  );

  const displayedJobs = onlySaved
    ? jobs.filter(j => savedJobIds.includes(j._id))
    : jobs;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Available Positions</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore opportunities matched to your skills and check your profile compatibility.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="match">Most Relevant / Match</option>
              <option value="recent">Newest</option>
              <option value="salary_high">Salary: High to Low</option>
              <option value="salary_low">Salary: Low to High</option>
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search job title, skills (e.g. React, Python), company (e.g. TechNova), location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Clean Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {locationsList.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {rolesList.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Work Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Experience Levels</option>
                <option value="Internship">Internship (0 yrs)</option>
                <option value="Entry Level">Entry Level (0–2 yrs)</option>
                <option value="Mid Level">Mid Level (1–3 yrs)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Active filters:
              </span>

              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setSearchInput(''); }}
                    className="hover:text-blue-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {location !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  Location: {location}
                  <button
                    type="button"
                    onClick={() => setLocation('all')}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {role !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  Role: {role}
                  <button
                    type="button"
                    onClick={() => setRole('all')}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {jobType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  Type: {jobType}
                  <button
                    type="button"
                    onClick={() => setJobType('all')}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {experienceLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  Experience: {experienceLevel}
                  <button
                    type="button"
                    onClick={() => setExperienceLevel('all')}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* View Tabs: All Jobs vs Saved & Dynamic Counts */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlySaved(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                !onlySaved
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Openings ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setOnlySaved(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                onlySaved
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Jobs ({savedJobIds.length})</span>
            </button>
          </div>

          <div className="text-xs font-medium text-slate-500">
            {hasActiveFilters
              ? `${displayedJobs.length} ${displayedJobs.length === 1 ? 'job' : 'jobs'} found`
              : `Showing ${displayedJobs.length} open roles`}
          </div>
        </div>

        {/* Job Listings List */}
        {loading ? (
          <CardSkeleton count={4} />
        ) : displayedJobs.length === 0 ? (
          /* Zero Results UX */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {onlySaved ? 'No saved jobs yet' : 'No jobs match your current search.'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {onlySaved
                    ? 'Bookmark jobs from the listings above to save them for later review and direct application.'
                    : 'Try removing a filter or searching for another role (e.g. React, Python, Full Stack).'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                )}
                {onlySaved && (
                  <button
                    type="button"
                    onClick={() => setOnlySaved(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Browse All Jobs
                  </button>
                )}
              </div>
            </div>

            {/* Alternative Recommendations if Zero Search Results */}
            {!onlySaved && recommendedFallbackJobs.length > 0 && (
              <div className="bg-slate-100/70 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Popular Recommended Positions
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View all open positions →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedFallbackJobs.map((recJob) => (
                    <div key={recJob._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/jobs/${recJob._id}`} className="font-semibold text-slate-900 text-xs hover:text-blue-600">
                            {recJob.title}
                          </Link>
                          <p className="text-[11px] text-slate-500 mt-0.5">{recJob.companyName} • {recJob.location}</p>
                        </div>
                        <MatchBadge compatibility={recJob.compatibility} size="sm" />
                      </div>
                      <div className="text-[11px] font-medium text-slate-700">
                        {formatSalary(recJob.salary?.min, recJob.salary?.max, recJob.salary?.currency, recJob.salary?.period)}
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{recJob.jobType}</span>
                        <Link to={`/jobs/${recJob._id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedJobs.map((job) => {
              const isSaved = savedJobIds.includes(job._id);

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Company & Title */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs shrink-0 shadow-2xs">
                        {job.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {job.jobType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-900">{job.companyName}</strong> • {job.location} ({job.workplaceType}) • <span className="font-semibold text-slate-800">{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency, job.salary?.period)}</span> • <span className="text-slate-500">{job.experience?.level || '0–2 yrs'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Badge & Save */}
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      <MatchBadge compatibility={job.compatibility} />
                      <button
                        type="button"
                        onClick={() => handleToggleSave(job._id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title={isSaved ? 'Job saved' : 'Save job'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Skills tags & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {(job.skills || []).map((skill, sIdx) => {
                        const isMatched = job.compatibility?.matchedSkills?.includes(skill);
                        const isMissing = job.compatibility?.missingSkills?.includes(skill);

                        return (
                          <span
                            key={sIdx}
                            className={`tag-skill ${
                              isMatched ? 'tag-matched' : isMissing ? 'tag-gap' : ''
                            }`}
                          >
                            {isMatched && '✓ '}
                            {isMissing && '+ '}
                            {skill}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-400 text-[11px] mr-1">
                        Posted {formatDate(job.createdAt)}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
                      >
                        View Job
                      </Link>
                      {isJobSeeker && (
                        <button
                          onClick={() => handleOpenApply(job)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 5-Step Job Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={applyStep === 5 ? 'Application Submitted' : `Apply to ${selectedJob?.title}`}
        subtitle={applyStep === 5 ? `at ${selectedJob?.companyName}` : `Step ${applyStep} of 4 • ${selectedJob?.companyName}`}
      >
        {applyStep === 5 ? (
          /* Step 5: Submitted Confirmation Screen */
          <div className="text-center py-4 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Application Submitted</h4>
              <p className="text-slate-500">
                Your application has been received by <strong>{selectedJob?.companyName}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1 text-slate-600">
              <div><strong>Position:</strong> {selectedJob?.title}</div>
              <div><strong>Status:</strong> Applied (Under Review)</div>
              <div><strong>Submitted on:</strong> {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to="/applications"
                onClick={() => setApplyModalOpen(false)}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700"
              >
                Track in My Applications
              </Link>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Steps 1 to 4 */
          <div className="space-y-4 text-xs">
            {applyError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                {applyError}
              </div>
            )}

            {/* Step Stepper Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-500">
              <span className={applyStep >= 1 ? 'font-bold text-blue-600' : ''}>1. Profile</span>
              <span>→</span>
              <span className={applyStep >= 2 ? 'font-bold text-blue-600' : ''}>2. Resume</span>
              <span>→</span>
              <span className={applyStep >= 3 ? 'font-bold text-blue-600' : ''}>3. Note</span>
              <span>→</span>
              <span className={applyStep >= 4 ? 'font-bold text-blue-600' : ''}>4. Review</span>
            </div>

            {/* Step 1: Confirm Profile */}
            {applyStep === 1 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Confirm Your Contact Details</div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                  <div><strong>Full Name:</strong> {user?.name}</div>
                  <div><strong>Email:</strong> {user?.email}</div>
                  <div><strong>Phone:</strong> {user?.profile?.phone || '+91 98765 43210'}</div>
                  <div><strong>Current Location:</strong> {user?.profile?.location || 'Bengaluru, India'}</div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Need to update these details? You can edit them in your <Link to="/profile" className="text-blue-600 underline">Profile Settings</Link>.
                </p>
              </div>
            )}

            {/* Step 2: Resume */}
            {applyStep === 2 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Attach Verified Resume</div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {user?.profile?.resumeUrl ? 'Aarav_Sharma_Resume.pdf' : 'Primary Candidate Profile PDF'}
                      </div>
                      <div className="text-[11px] text-slate-500">ATS-Optimized Profile</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Your primary profile and extracted competencies will be shared with the recruiter.
                </p>
              </div>
            )}

            {/* Step 3: Optional Cover Note */}
            {applyStep === 3 && (
              <div className="space-y-2">
                <label className="block font-semibold text-slate-800">
                  Optional Note to Hiring Team
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a brief overview of relevant projects, internships, or why this position interests you..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            {/* Step 4: Final Review */}
            {applyStep === 4 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Review Application Summary</div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
                  <div><strong>Position:</strong> {selectedJob?.title}</div>
                  <div><strong>Company:</strong> {selectedJob?.companyName}</div>
                  <div><strong>Location:</strong> {selectedJob?.location}</div>
                  {selectedJob?.compatibility && (
                    <div className="text-emerald-700 font-semibold">
                      <strong>Compatibility:</strong> {selectedJob.compatibility.overall}% match
                    </div>
                  )}
                  {coverNote && (
                    <div className="pt-1 text-[11px] text-slate-600">
                      <strong>Note:</strong> "{coverNote}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {applyStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setApplyStep(applyStep - 1)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

              {applyStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setApplyStep(applyStep + 1)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default JobSearchPage;
