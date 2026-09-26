import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../../services/api';
import { formatSalary, formatDate, getStatusBadge } from '../../utils/helpers';
import MatchBadge from '../../components/MatchBadge';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await applicationsAPI.getMyApplications();
        if (res.data?.success) {
          setApplications(res.data.applications || []);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track the progress, status updates, and interview schedules for your submitted applications.
            </p>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Briefcase className="w-4 h-4 text-slate-300" />
            <span>Find Open Positions</span>
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse open tech positions matching your skills and submit your direct application.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-medium shadow-xs hover:bg-blue-700"
            >
              <span>Browse Tech Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusConfig = getStatusBadge(app.status);
              const currentStageIdx = stages.indexOf(app.status);

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900">
                          {app.jobId?.title || 'Engineering Role'}
                        </h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.bg}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {app.jobId?.companyName || 'Company'} • Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.matchScore && (
                        <div className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                          {app.matchScore.overall}% match
                        </div>
                      )}

                      {app.jobId && (
                        <Link
                          to={`/jobs/${app.jobId._id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          View Job
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Visual Status Progress Stepper */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Hiring Process Pipeline
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                      {stages.map((stage, sIdx) => {
                        const isDone = currentStageIdx >= sIdx && app.status !== 'Rejected';
                        const isCurrent = app.status === stage;
                        return (
                          <div key={sIdx} className="space-y-1.5">
                            <div className={`h-1.5 rounded-full transition-all ${
                              isDone ? 'bg-blue-600' : 'bg-slate-200'
                            }`} />
                            <span className={`text-[10px] font-medium block truncate ${
                              isCurrent ? 'text-blue-700 font-semibold' : isDone ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interview & Notes Notifications if any */}
                  {app.interviewDate && (
                    <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span><strong>Interview Scheduled:</strong> {new Date(app.interviewDate).toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                      </div>
                      <Link
                        to={`/interview-prep?jobId=${app.jobId?._id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shrink-0"
                      >
                        Interview Prep
                      </Link>
                    </div>
                  )}

                  {app.notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong>Recruiter Note:</strong> {app.notes}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplicationsPage;
