import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { applicationsAPI, jobsAPI } from '../../services/api';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import MatchBadge from '../../components/MatchBadge';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Calendar,
  Briefcase,
  GraduationCap,
  FolderGit2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Search,
  Filter,
  AlertCircle,
  Clock,
  Globe,
  ExternalLink,
  User,
} from 'lucide-react';

const CandidateRankingPage = () => {
  const [searchParams] = useSearchParams();
  const paramJobId = searchParams.get('jobId') || 'all';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(paramJobId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Candidate Details Modal
  const [viewCandidateApp, setViewCandidateApp] = useState(null);

  // Status/Schedule Modal
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalInterviewDate, setModalInterviewDate] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobsAPI.getEmployerJobs(),
        applicationsAPI.getEmployerApplications({ jobId: selectedJobId }),
      ]);

      if (jobsRes.data?.success) setJobs(jobsRes.data.jobs || []);
      if (appsRes.data?.success) setApplications(appsRes.data.applications || []);
    } catch (err) {
      console.error('Failed to load candidate applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedJobId]);

  const handleOpenStatusModal = (app) => {
    setActiveModalApp(app);
    setModalStatus(app.status);
    setModalNotes(app.notes || '');
    setModalInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : '');
  };

  const handleSaveStatus = async () => {
    if (!activeModalApp) return;
    setUpdating(true);

    try {
      await applicationsAPI.updateStatus(activeModalApp._id, {
        status: modalStatus,
        notes: modalNotes,
        interviewDate: modalInterviewDate ? new Date(modalInterviewDate) : undefined,
      });

      setActiveModalApp(null);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Evaluation & Ranking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Applicants ranked transparently based on verified technical skill overlap, project relevance, and experience.
            </p>
          </div>

          {/* Job Filter Dropdown */}
          <div className="shrink-0 w-full md:w-72">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Job Listings ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate List Cards */}
        {loading ? (
          <TableSkeleton rows={4} />
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No applicants for this position</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              As candidates apply, their technical compatibility will be calculated automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, rankIdx) => {
              const statusConfig = getStatusBadge(app.status);
              const candidate = app.candidateId;
              const match = app.matchScore;

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Candidate Profile Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-slate-200">
                        {candidate?.name?.charAt(0) || 'C'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            #{rankIdx + 1}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {candidate?.name || 'Applicant'}
                          </h3>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.bg}`}>
                            {app.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          {candidate?.profile?.headline || 'Software Engineer'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                          <span>Applied for <strong className="text-slate-700">{app.jobId?.title}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {candidate?.profile?.location || 'India'}
                          </span>
                          <span>•</span>
                          <span>{formatDate(app.appliedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Compatibility, View Profile & Update Status */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-start">
                      {match && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                          <div className="text-xl font-bold text-slate-900">{match.overall}%</div>
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Match</div>
                        </div>
                      )}

                      <button
                        onClick={() => setViewCandidateApp(app)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Update Pipeline
                      </button>
                    </div>
                  </div>

                  {/* Skills Breakdown Tags */}
                  {match && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                      {match.matchedSkills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Matched:</span>
                          {match.matchedSkills.map((s, idx) => (
                            <span key={idx} className="tag-matched">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {match.missingSkills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gaps:</span>
                          {match.missingSkills.map((s, idx) => (
                            <span key={idx} className="tag-gap">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes / Interview date info if scheduled */}
                  {(app.notes || app.interviewDate) && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                      {app.interviewDate && (
                        <span className="flex items-center gap-1.5 font-medium text-blue-700">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Interview scheduled: {new Date(app.interviewDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </span>
                      )}
                      {app.notes && (
                        <span className="text-slate-600">Note: {app.notes}</span>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Modal 1: Full Candidate Profile View */}
        {viewCandidateApp && (
          <Modal
            isOpen={Boolean(viewCandidateApp)}
            onClose={() => setViewCandidateApp(null)}
            title={`Candidate Profile: ${viewCandidateApp.candidateId?.name}`}
          >
            <div className="space-y-5 text-xs">
              
              {/* Header Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{viewCandidateApp.candidateId?.name}</h4>
                  <p className="text-slate-600 font-medium">{viewCandidateApp.candidateId?.profile?.headline || 'Software Engineer'}</p>
                  <p className="text-slate-500 mt-1">
                    {viewCandidateApp.candidateId?.email} • {viewCandidateApp.candidateId?.profile?.phone || 'Contact on file'} • {viewCandidateApp.candidateId?.profile?.location || 'India'}
                  </p>
                </div>

                <div className="text-center p-2.5 bg-white rounded-lg border border-slate-200 shrink-0">
                  <div className="text-xl font-bold text-slate-900">{viewCandidateApp.matchScore?.overall || 80}%</div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase">Match Score</div>
                </div>
              </div>

              {/* Bio & Cover Note */}
              {viewCandidateApp.coverNote && (
                <div>
                  <h5 className="font-semibold text-slate-900 uppercase tracking-wider mb-1">Applicant Note</h5>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {viewCandidateApp.coverNote}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h5 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Technical Competencies</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(viewCandidateApp.candidateId?.profile?.skills || ['JavaScript', 'React', 'Node.js', 'MongoDB']).map((s, idx) => (
                    <span key={idx} className="tag-skill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              {viewCandidateApp.candidateId?.profile?.education?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Education</h5>
                  <div className="space-y-2">
                    {viewCandidateApp.candidateId.profile.education.map((edu, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-900">{edu.degree}</div>
                        <div className="text-slate-500 text-[11px]">{edu.institution} • {edu.graduationYear} (GPA: {edu.gpa || 'N/A'})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {viewCandidateApp.candidateId?.profile?.experience?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Experience & Internships</h5>
                  <div className="space-y-2">
                    {viewCandidateApp.candidateId.profile.experience.map((exp, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-900">{exp.title} - {exp.company}</div>
                        <p className="text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {viewCandidateApp.candidateId?.profile?.projects?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-900 uppercase tracking-wider mb-1.5">Portfolio Projects</h5>
                  <div className="space-y-2">
                    {viewCandidateApp.candidateId.profile.projects.map((proj, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-900">{proj.title}</div>
                        {proj.description && <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>}
                        {proj.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {proj.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Recruitment Notice */}
              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-[11px] text-blue-900">
                <strong>Fair Recruitment Assistance:</strong> Compatibility ratings evaluate technical qualifications, experience, and projects. Sensitive personal attributes are never used. Employers make all final hiring decisions.
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewCandidateApp;
                    setViewCandidateApp(null);
                    handleOpenStatusModal(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Update Hiring Status
                </button>
                <button
                  type="button"
                  onClick={() => setViewCandidateApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </Modal>
        )}


        {/* Modal 2: Updating Pipeline Status & Scheduling Interview */}
        {activeModalApp && (
          <Modal
            isOpen={Boolean(activeModalApp)}
            onClose={() => setActiveModalApp(null)}
            title={`Update Candidate: ${activeModalApp.candidateId?.name}`}
          >
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pipeline Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white"
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Schedule Interview Date</label>
                <input
                  type="date"
                  value={modalInterviewDate}
                  onChange={(e) => setModalInterviewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Hiring Notes</label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Notes for the hiring team regarding this candidate..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Pipeline Changes'}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default CandidateRankingPage;
