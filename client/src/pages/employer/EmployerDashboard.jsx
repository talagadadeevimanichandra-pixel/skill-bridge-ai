import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI, companyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import StatCard from '../../components/StatCard';
import { CardSkeleton, TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Briefcase,
  Users,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, compRes] = await Promise.all([
        jobsAPI.getEmployerJobs(),
        applicationsAPI.getEmployerApplications(),
        companyAPI.getMyCompany(),
      ]);

      if (jobsRes.data?.success) setJobs(jobsRes.data.jobs || []);
      if (appsRes.data?.success) setApplications(appsRes.data.applications || []);
      if (compRes.data?.success) setCompany(compRes.data.company || null);
    } catch (err) {
      console.error('Failed to load employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(appId, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const totalAppsCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length;
  const avgMatch = applications.length > 0
    ? Math.round(applications.reduce((acc, a) => acc + (a.matchScore?.overall || 75), 0) / applications.length)
    : 85;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Recruiter Workspace Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{company?.companyName || 'NextGen Dynamics'}</span>
                <span>•</span>
                <span>Recruiter Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Recruitment & Candidate Pipeline
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Review verified technical candidate profiles, manage job postings, and track hiring stages.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/employer/create-job"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-300" />
                <span>Post New Job</span>
              </Link>
              <Link
                to="/employer/candidates"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 flex items-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Candidate Ranking</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Listings"
            value={activeJobsCount}
            subtitle={`${jobs.length} total postings`}
            icon={Briefcase}
            color="indigo"
          />
          <StatCard
            title="Total Applicants"
            value={totalAppsCount}
            subtitle="Received across roles"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="In Pipeline"
            value={shortlistedCount}
            subtitle="Shortlisted or interviewing"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Avg Technical Match"
            value={`${avgMatch}%`}
            subtitle="Based on skill overlap"
            icon={Sparkles}
            color="amber"
          />
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Recent Applicants Ranked */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Candidate Applications
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated against required and preferred technical competencies
                  </p>
                </div>
                <Link to="/employer/candidates" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <TableSkeleton rows={3} />
              ) : applications.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No applicants received yet. Check your active job listings.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => {
                    const statusConfig = getStatusBadge(app.status);
                    return (
                      <div
                        key={app._id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-slate-200">
                            {app.candidateId?.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">{app.candidateId?.name}</span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {app.matchScore?.overall || 80}% match
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Applied for <strong className="text-slate-700">{app.jobId?.title}</strong> • {formatDate(app.appliedAt)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(app.matchScore?.matchedSkills || []).slice(0, 4).map((s, idx) => (
                                <span key={idx} className="tag-skill">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${statusConfig.bg}`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Active Jobs List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Active Job Postings</h3>
                <Link to="/employer/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
                  Manage
                </Link>
              </div>

              <div className="space-y-2.5">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <Link to={`/jobs/${job._id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                        {job.title}
                      </Link>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {job.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center justify-between">
                      <span>{job.location}</span>
                      <span>{job.applicantsCount || 0} applicants</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/employer/create-job"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs text-center block transition-colors border border-slate-200"
              >
                + Post Another Job
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;
