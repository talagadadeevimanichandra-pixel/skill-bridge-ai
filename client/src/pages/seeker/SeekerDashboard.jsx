import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, applicationsAPI, resumeAPI } from '../../services/api';
import { formatSalary, formatDate, getStatusBadge } from '../../utils/helpers';
import MatchBadge from '../../components/MatchBadge';
import StatCard from '../../components/StatCard';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import {
  FileText,
  Compass,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  User,
  AlertCircle,
  ExternalLink,
  Target,
  Sparkles,
  TrendingUp,
  MapPin,
} from 'lucide-react';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes, resumeRes] = await Promise.all([
          jobsAPI.getAll({ sortBy: 'match', limit: 4 }),
          applicationsAPI.getMyApplications(),
          resumeAPI.getMyResume(),
        ]);

        if (jobsRes.data?.success) setRecommendedJobs(jobsRes.data.jobs || []);
        if (appsRes.data?.success) setApplications(appsRes.data.applications || []);
        if (resumeRes.data?.success) setResumeData(resumeRes.data.resume || null);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user?.profile) return 30;
    let score = 20; // base for registration
    if (user.profile.skills?.length > 0) score += 20;
    if (user.profile.education?.length > 0) score += 15;
    if (user.profile.experience?.length > 0) score += 15;
    if (user.profile.projects?.length > 0) score += 15;
    if (user.profile.resumeUrl || resumeData) score += 15;
    return Math.min(score, 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const avgMatchScore = recommendedJobs.length > 0
    ? Math.round(recommendedJobs.reduce((acc, j) => acc + (j.compatibility?.overall || 70), 0) / recommendedJobs.length)
    : 82;

  const topMissingSkills = Array.from(new Set(
    recommendedJobs.flatMap(j => j.compatibility?.missingSkills || []).slice(0, 4)
  ));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome & Overview Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Job Seeker Workspace</span>
                <span>•</span>
                <span>{user?.profile?.location || 'India'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Candidate'}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Here is your current skill compatibility summary, active job recommendations, and targeted learning pathways.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/resume-analyzer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>Analyze Resume</span>
              </Link>
              <Link
                to="/skill-gap"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 flex items-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Skill Roadmaps</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Restrained Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Profile Readiness"
            value={`${profileCompletion}%`}
            subtitle={profileCompletion < 80 ? 'Add projects to increase score' : 'Profile verified'}
            icon={User}
            color="indigo"
          />
          <StatCard
            title="Avg Job Match"
            value={`${avgMatchScore}%`}
            subtitle="Based on verified skills"
            icon={Sparkles}
            color="blue"
          />
          <StatCard
            title="Applications"
            value={applications.length}
            subtitle={`${applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length} in active review`}
            icon={Briefcase}
            color="emerald"
          />
          <StatCard
            title="Skills to Strengthen"
            value={topMissingSkills.length || 3}
            subtitle="Recommended for 90%+ match"
            icon={Target}
            color="amber"
          />
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Recommended Roles & Applications */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recommended Positions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recommended Opportunities
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Roles matched against your technical skills and experience
                  </p>
                </div>
                <Link to="/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <CardSkeleton count={2} />
              ) : recommendedJobs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No job recommendations available at the moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={job.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80'}
                          alt={job.companyName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-700">{job.companyName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-slate-900">
                              {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency, job.salary?.period)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <MatchBadge compatibility={job.compatibility} />
                        <Link
                          to={`/jobs/${job._id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Applications Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Active Applications
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track the hiring review stages of your submitted applications
                  </p>
                </div>
                <Link to="/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>Manage All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  You haven't submitted any job applications yet.{' '}
                  <Link to="/jobs" className="text-blue-600 font-medium underline ml-1">
                    Explore open positions
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => {
                    const statusConfig = getStatusBadge(app.status);
                    return (
                      <div
                        key={app._id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{app.jobId?.title || 'Engineering Role'}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.jobId?.companyName || 'Technology Company'} • Applied {formatDate(app.appliedAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusConfig.bg}`}>
                            {app.status}
                          </span>
                          {app.matchScore?.overall && (
                            <span className="text-xs text-slate-500">
                              {app.matchScore.overall}% match
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Skill Gaps & Career Assistant */}
          <div className="space-y-6">
            
            {/* Top Skill Gaps Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Skills to Strengthen</h3>
                </div>
                <Link to="/skill-gap" className="text-xs font-semibold text-blue-600 hover:underline">
                  Roadmap
                </Link>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Mastering these competencies will increase your compatibility score across software engineering roles:
              </p>

              <div className="space-y-2">
                {(topMissingSkills.length > 0 ? topMissingSkills : ['TypeScript', 'Docker', 'Jest']).map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{skill}</span>
                    <Link
                      to={`/skill-gap?skill=${encodeURIComponent(skill)}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View Roadmap &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Assistant Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4 border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Career Assistant</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Have questions about resume optimization, portfolio project ideas, or interview questions?
              </p>

              <div className="space-y-2 text-xs">
                <Link
                  to="/career-assistant"
                  className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 block text-slate-200 transition-colors"
                >
                  "How can I tailor my resume for ATS filters?"
                </Link>
                <Link
                  to="/career-assistant"
                  className="w-full p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 block text-slate-200 transition-colors"
                >
                  "What full stack projects will stand out?"
                </Link>
              </div>

              <Link
                to="/career-assistant"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs text-center block shadow-xs transition-colors"
              >
                Open Career Assistant
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SeekerDashboard;
