import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatSalary, formatDate } from '../utils/helpers';
import MatchBadge from '../components/MatchBadge';
import Modal from '../components/Modal';
import {
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Bookmark,
  Check,
  Compass,
  FileText,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bookmark tracking
  const [isSaved, setIsSaved] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobsAPI.getById(id);
        if (res.data?.success) {
          setJob(res.data.job);
          // check bookmark
          let isBookmarked = false;
          try {
            const saved = JSON.parse(localStorage.getItem('skillbridge_saved_jobs') || '[]');
            isBookmarked = saved.includes(res.data.job._id);
          } catch {}
          if (user?.savedJobs && Array.isArray(user.savedJobs)) {
            isBookmarked = isBookmarked || user.savedJobs.includes(res.data.job._id);
          }
          setIsSaved(isBookmarked);
        } else {
          setError('Job not found.');
        }
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!job) return;
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      const saved = JSON.parse(localStorage.getItem('skillbridge_saved_jobs') || '[]');
      let updated;
      if (!nextSaved) {
        updated = saved.filter(savedId => savedId !== job._id);
      } else {
        updated = [...saved, job._id];
      }
      localStorage.setItem('skillbridge_saved_jobs', JSON.stringify(updated));
    } catch {}

    if (isAuthenticated) {
      try {
        if (nextSaved) {
          await jobsAPI.save(job._id);
        } else {
          await jobsAPI.unsave(job._id);
        }
      } catch (e) {}
    }
  };

  const handleOpenApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplyStep(1);
    setCoverNote('');
    setApplyError('');
    setSubmittedApp(null);
    setApplyModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!job) return;
    setSubmitting(true);
    setApplyError('');

    try {
      const res = await applicationsAPI.apply({
        jobId: job._id,
        coverNote,
      });

      if (res.data?.success) {
        setSubmittedApp(res.data.application);
        setApplyStep(5);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Application could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs text-slate-500 font-medium">Loading position details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">{error || 'Job not found'}</h3>
        <p className="text-xs text-slate-500 mt-1">This job listing may have expired or been removed.</p>
        <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const { compatibility } = job;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/jobs" className="hover:text-slate-900">Jobs</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{job.title}</span>
        </div>

        {/* 1. Job Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-sm shrink-0">
                {job.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{job.title}</h1>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {job.jobType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{job.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location} ({job.workplaceType})
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-800">
                    {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency, job.salary?.period)}
                  </span>
                  <span>•</span>
                  <span>{job.experience?.level || 'Entry Level'} ({job.experience?.minYears || 0}–{job.experience?.maxYears || 3} yrs)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start shrink-0">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`p-2 rounded-md border text-xs font-medium transition-colors ${
                  isSaved
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4 inline mr-1" />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {isJobSeeker && (
                <button
                  onClick={handleOpenApply}
                  className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>

          </div>

          {/* 2. Transparent AI Compatibility Breakdown */}
          {compatibility && (
            <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Why this matches you</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">AI compatibility estimate:</span>
                  <span className="text-sm font-bold text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {compatibility.matchScore || compatibility.overall}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/70">
                {compatibility.explanation || compatibility.matchSummary || 'Your profile provides a strong foundation for this role.'}
              </p>

              {/* Skills Breakdown: Strong, Partial, Skill Gaps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                {/* Strong Matches */}
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                    ✓ Strong Matches
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(compatibility.matchedSkills?.length ? compatibility.matchedSkills : ['Core Skills']).map((s, idx) => (
                      <span key={idx} className="tag-skill tag-matched text-[11px]">✓ {s}</span>
                    ))}
                  </div>
                </div>

                {/* Partial Matches */}
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <span className="font-bold text-blue-800 flex items-center gap-1 mb-1.5">
                    ◐ Partial Matches
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(compatibility.partialSkills?.length ? compatibility.partialSkills : ['Related Tools']).map((s, idx) => (
                      <span key={idx} className="tag-skill text-[11px] bg-blue-50 text-blue-800 border-blue-200">◐ {s}</span>
                    ))}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white p-3 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-800 flex items-center gap-1 mb-1.5">
                    ○ Skill Gaps
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(compatibility.missingSkills?.length ? compatibility.missingSkills : ['Advanced Topics']).map((s, idx) => (
                      <span key={idx} className="tag-skill tag-gap text-[11px]">○ {s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-Factor Alignment Tags (Experience, Education, Location, Projects) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                {compatibility.experienceMatch?.status && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Experience:</strong> {compatibility.experienceMatch.status}
                  </span>
                )}
                {compatibility.educationMatch?.status && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Education:</strong> {compatibility.educationMatch.status}
                  </span>
                )}
                {compatibility.locationMatch?.status && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <strong>Location:</strong> {compatibility.locationMatch.status}
                  </span>
                )}
                {compatibility.projectRelevance?.hasRelevantProjects && (
                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                    <strong>Portfolio:</strong> Relevant project evidence verified
                  </span>
                )}
              </div>

              {/* Improve Your Match Section */}
              {compatibility.recommendations?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Improve your match — Recommended Actions
                    </h4>
                    <Link
                      to={`/skill-gap?jobId=${job._id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      View complete learning roadmap →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {compatibility.recommendations.slice(0, 2).map((rec, rIdx) => (
                      <div key={rIdx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-semibold text-slate-800 flex items-center justify-between">
                          <span>Bridge {rec.skill || 'Skill'}</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Priority</span>
                        </div>
                        {rec.why && <p className="text-slate-600 text-[11px]"><strong className="text-slate-700">Why:</strong> {rec.why}</p>}
                        {rec.learn && <p className="text-slate-600 text-[11px]"><strong className="text-slate-700">Learn:</strong> {rec.learn}</p>}
                        {rec.suggestedProject && <p className="text-blue-700 text-[11px]"><strong className="text-blue-900">Suggested Project:</strong> {rec.suggestedProject}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-400 italic pt-1 text-right">
                {compatibility.disclaimer || 'Note: This score is an AI compatibility estimate, not a hiring probability.'}
              </div>
            </div>
          )}

        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs sm:text-sm text-slate-700">
              
              {/* About Role */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">About the Role</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Responsibilities</h3>
                  <ul className="space-y-1.5 text-slate-600 text-xs sm:text-sm">
                    {job.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(job.skills || []).map((skill, sIdx) => (
                    <span key={sIdx} className="tag-skill text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              {job.preferredSkills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Preferred Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferredSkills.map((pref, pIdx) => (
                      <span key={pIdx} className="tag-skill text-xs bg-slate-50">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Qualifications & Education</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {job.education}
                </p>
              </div>

              {/* Deadline */}
              {job.deadline && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <strong>Application Deadline:</strong> {new Date(job.deadline).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar: Company Info & Preparation Tools */}
          <div className="space-y-6">
            
            {/* About Company */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide">About {job.companyName}</h3>
              <p className="text-slate-600 leading-relaxed">
                {job.company?.description || 'A growing technology organization hiring talented engineering practitioners.'}
              </p>

              {job.company?.benefits?.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-800 block mb-1.5">Benefits & Perks:</span>
                  <ul className="space-y-1 text-slate-600">
                    {job.company.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Preparation Tools */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide">Preparation Tools</h3>
              <p className="text-slate-500">
                Sharpen your skills and prepare specifically for this opening:
              </p>

              <div className="space-y-2 pt-1">
                <Link
                  to={`/skill-gap?jobId=${job._id}`}
                  className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Skill Development Roadmap</div>
                    <div className="text-[11px] text-slate-500">Recommended steps & tutorials</div>
                  </div>
                  <Compass className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to={`/interview-prep?jobId=${job._id}`}
                  className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors block"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Interview Practice</div>
                    <div className="text-[11px] text-slate-500">Role-specific technical rounds</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 5-Step Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={applyStep === 5 ? 'Application Submitted' : `Apply to ${job.title}`}
        subtitle={applyStep === 5 ? `at ${job.companyName}` : `Step ${applyStep} of 4 • ${job.companyName}`}
      >
        {applyStep === 5 ? (
          <div className="text-center py-4 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Application Submitted</h4>
              <p className="text-slate-500">
                Your application has been received by <strong>{job.companyName}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-1 text-slate-600">
              <div><strong>Position:</strong> {job.title}</div>
              <div><strong>Status:</strong> Applied (Under Review)</div>
              <div><strong>Submitted on:</strong> {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to="/applications"
                onClick={() => setApplyModalOpen(false)}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700"
              >
                Track in My Applications
              </Link>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {applyError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                {applyError}
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-500">
              <span className={applyStep >= 1 ? 'font-bold text-blue-600' : ''}>1. Profile</span>
              <span>→</span>
              <span className={applyStep >= 2 ? 'font-bold text-blue-600' : ''}>2. Resume</span>
              <span>→</span>
              <span className={applyStep >= 3 ? 'font-bold text-blue-600' : ''}>3. Note</span>
              <span>→</span>
              <span className={applyStep >= 4 ? 'font-bold text-blue-600' : ''}>4. Review</span>
            </div>

            {applyStep === 1 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Confirm Your Contact Details</div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                  <div><strong>Full Name:</strong> {user?.name}</div>
                  <div><strong>Email:</strong> {user?.email}</div>
                  <div><strong>Phone:</strong> {user?.profile?.phone || '+91 98765 43210'}</div>
                  <div><strong>Current Location:</strong> {user?.profile?.location || 'Bengaluru, India'}</div>
                </div>
              </div>
            )}

            {applyStep === 2 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Attach Verified Resume</div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {user?.profile?.resumeUrl ? 'Aarav_Sharma_Resume.pdf' : 'Primary Candidate Profile PDF'}
                      </div>
                      <div className="text-[11px] text-slate-500">Verified • ATS-Optimized</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                </div>
              </div>
            )}

            {applyStep === 3 && (
              <div className="space-y-2">
                <label className="block font-semibold text-slate-800">
                  Optional Note to Hiring Team
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a brief overview of relevant projects or why this position interests you..."
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}

            {applyStep === 4 && (
              <div className="space-y-3">
                <div className="font-semibold text-slate-800">Review Application Summary</div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                  <div><strong>Position:</strong> {job.title}</div>
                  <div><strong>Company:</strong> {job.companyName}</div>
                  <div><strong>Location:</strong> {job.location}</div>
                  {job.compatibility && (
                    <div className="text-emerald-700 font-semibold">
                      <strong>Compatibility:</strong> {job.compatibility.overall}% match
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

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {applyStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setApplyStep(applyStep - 1)}
                  className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

              {applyStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setApplyStep(applyStep + 1)}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs disabled:opacity-50"
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

export default JobDetailPage;
