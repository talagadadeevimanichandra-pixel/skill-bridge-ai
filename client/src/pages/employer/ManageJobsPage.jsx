import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { formatSalary, formatDate } from '../../utils/helpers';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Briefcase,
  Users,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployerJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getEmployerJobs();
      if (res.data?.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load employer jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to remove this job posting?')) return;
    try {
      await jobsAPI.delete(id);
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manage Job Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track applicant volume, review candidate rankings, or publish new technical roles.
            </p>
          </div>

          <Link
            to="/employer/create-job"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No active job postings</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Publish your first opening to begin receiving verified candidate applications.
            </p>
            <Link
              to="/employer/create-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-medium shadow-xs hover:bg-blue-700"
            >
              <span>Post a Job</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {job.jobType}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location} ({job.workplaceType})
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-900">
                      {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency, job.salary?.period)}
                    </span>
                    <span>•</span>
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(job.skills || []).slice(0, 4).map((s, idx) => (
                      <span key={idx} className="tag-skill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                  <Link
                    to={`/employer/candidates?jobId=${job._id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>View Applicants ({job.applicantsCount || 0})</span>
                  </Link>

                  <Link
                    to={`/employer/edit-job/${job._id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    aria-label={`Edit ${job.title} job posting`}
                    title="Edit Job Posting"
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    aria-label={`View public ${job.title} listing`}
                    title="Public Listing View"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </Link>

                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    aria-label={`Delete ${job.title} job posting`}
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageJobsPage;
