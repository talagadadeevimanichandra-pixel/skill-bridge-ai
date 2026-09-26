import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI, jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Briefcase,
  FolderGit2,
  RefreshCw,
  Zap,
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Key,
  Award,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  History,
  UserCheck,
  BarChart3,
  BookOpen,
} from 'lucide-react';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'AI/ML Intern',
  'AI/ML Engineer',
  'Data Analyst',
  'Cloud & DevOps Engineer',
  'Cloud Intern',
  'Cybersecurity Intern',
  'UI/UX Designer',
  'QA Engineer',
];

const SCORE_LABELS = {
  Strong: { label: 'Strong', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
  Developing: { label: 'Developing', badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
  'Needs Improvement': { label: 'Needs Improvement', badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30' },
};

const SEVERITY_BADGES = {
  Critical: 'bg-rose-100 text-rose-800 border-rose-200',
  'High Priority': 'bg-rose-50 text-rose-700 border-rose-200',
  'Medium Priority': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low Priority': 'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_ICONS = {
  Present: { icon: CheckCircle2, color: 'text-emerald-600', text: 'Present' },
  'Needs Improvement': { icon: AlertTriangle, color: 'text-amber-600', text: 'Needs Improvement' },
  Missing: { icon: X, color: 'text-slate-400', text: 'Missing' },
};

const ResumeAnalysisPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sub-tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Job comparison state
  const [openJobs, setOpenJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobComparisonResult, setJobComparisonResult] = useState(null);
  const [comparingJob, setComparingJob] = useState(false);

  // Editable summary state
  const [customSummary, setCustomSummary] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Load existing resume
  const fetchMyResume = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getMyResume();
      if (res.data?.success && res.data.resume) {
        setResumeData(res.data.resume);
        if (res.data.resume.targetRole) {
          setTargetRole(res.data.resume.targetRole);
        }
        if (res.data.resume.intelligence?.summaryAnalysis?.suggestedDraft) {
          setCustomSummary(res.data.resume.intelligence.summaryAnalysis.suggestedDraft);
        }
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load jobs for job-matcher tab
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobsAPI.getAll({ limit: 40 });
        if (res.data?.success) {
          setOpenJobs(res.data.jobs || []);
          if (res.data.jobs?.length > 0) {
            setSelectedJobId(res.data.jobs[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load jobs for resume comparison:', err);
      }
    };
    loadJobs();
    fetchMyResume();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e?.preventDefault();
    if (!file) {
      setError('Please select a PDF or DOC document to analyze.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const res = await resumeAPI.analyze(formData);
      if (res.data?.success) {
        setResumeData(res.data.resume);
        setSuccessMsg('Resume analyzed successfully with transparent Resume Intelligence!');
        if (res.data.resume.intelligence?.summaryAnalysis?.suggestedDraft) {
          setCustomSummary(res.data.resume.intelligence.summaryAnalysis.suggestedDraft);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError(err.response?.data?.message || 'We couldn’t complete the analysis right now. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadDemoResume = async () => {
    setAnalyzing(true);
    setError('');
    setSuccessMsg('');
    try {
      const formData = new FormData();
      formData.append('targetRole', targetRole);
      const res = await resumeAPI.analyze(formData);
      if (res.data?.success) {
        setResumeData(res.data.resume);
        setSuccessMsg('Sample candidate resume evaluated successfully!');
        if (res.data.resume.intelligence?.summaryAnalysis?.suggestedDraft) {
          setCustomSummary(res.data.resume.intelligence.summaryAnalysis.suggestedDraft);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError(err.response?.data?.message || 'We couldn’t complete the analysis right now. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCompareAgainstJob = async () => {
    if (!selectedJobId) return;
    setComparingJob(true);
    try {
      const res = await resumeAPI.compareJob({ jobId: selectedJobId });
      if (res.data?.success) {
        setJobComparisonResult(res.data);
      }
    } catch (err) {
      console.error('Job comparison error:', err);
    } finally {
      setComparingJob(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove this resume analysis?')) return;
    try {
      await resumeAPI.deleteResume();
      setResumeData(null);
      setFile(null);
      setSuccessMsg('Resume analysis removed.');
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  const handleCopySummary = () => {
    if (customSummary) {
      navigator.clipboard.writeText(customSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const intelligence = resumeData?.intelligence || {};
  const scoreBreakdown = intelligence.scoreBreakdown || {};
  const scoreLabel = intelligence.scoreLabel || 'Developing';
  const overallScore = intelligence.overallScore || resumeData?.aiAnalysis?.overallScore || 75;
  const comparison = intelligence.comparisonAgainstPrevious;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resume Intelligence & ATS Assessment</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Resume Intelligence Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Comprehensive, evidence-based resume assessment with transparent scoring, ATS compatibility checks, and actionable improvements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemoResume}
              disabled={analyzing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample Resume</span>
            </button>

            {resumeData && (
              <button
                type="button"
                onClick={handleDeleteResume}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                title="Delete Resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Upload & Target Role Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Selected Target Role</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation checks and keyword relevance adjust dynamically based on your target specialization.
              </p>
            </div>

            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 text-center space-y-3 transition-colors bg-slate-50/50">
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
            <div>
              <div className="text-xs font-semibold text-slate-800">
                {file ? file.name : 'Upload PDF or DOCX Resume (Max 10MB)'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Evaluates section structure, keyword alignment, project evidence, and ATS readability.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <label className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer transition-colors border border-slate-200 shadow-xs">
                <span>Browse File</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                onClick={handleUploadAndAnalyze}
                disabled={analyzing || !file}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze for {targetRole}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RESUME INTELLIGENCE ANALYSIS DISPLAY */}
        {/* ================================================================ */}
        {resumeData && (
          <div className="space-y-6">

            {/* Top Score Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-slate-300">
                      {resumeData.fileName || 'Resume Document'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Version {resumeData.currentVersion || 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${SCORE_LABELS[scoreLabel]?.badge || SCORE_LABELS.Developing.badge}`}>
                      {scoreLabel}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {resumeData.extractedData?.name || user?.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {intelligence.scoreNotice || 'Based on the information detected in your resume and your selected career target.'}
                  </p>
                </div>

                {/* Score Dial / Display */}
                <div className="flex items-center gap-6 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shrink-0">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                      {overallScore} <span className="text-base text-slate-400 font-normal">/ 100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                      Overall Profile Score
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-700"></div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                      {resumeData.extractedData?.skills?.length || 0}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                      Verified Skills
                    </div>
                  </div>
                </div>

              </div>

              {/* Resume Health Pills */}
              {intelligence.resumeHealth && (
                <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px] self-center mr-1">Resume Health:</span>
                  {Object.entries(intelligence.resumeHealth).map(([key, val]) => (
                    <span
                      key={key}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium"
                    >
                      <strong className="capitalize text-white">{key}:</strong> {val}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Before / After Comparison Card (if present) */}
            {comparison && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Version Improvement Detected
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800">
                    Previous Score: <strong>{comparison.previousScore}/100</strong> → New Score: <strong>{comparison.newScore}/100</strong> ({comparison.scoreDifference >= 0 ? `+${comparison.scoreDifference}` : comparison.scoreDifference} pts)
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(comparison.improvementsDetected || []).map((imp, idx) => (
                      <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-800 font-medium">
                        ✓ {imp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Weightage & Score Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Transparent Profile Weightage (100% Total)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculated from identifiable evidence checks across 8 dimensions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  { key: 'skills', label: 'Skills', weight: '20%', ...scoreBreakdown.skills },
                  { key: 'experience', label: 'Experience', weight: '20%', ...scoreBreakdown.experience },
                  { key: 'projects', label: 'Projects', weight: '15%', ...scoreBreakdown.projects },
                  { key: 'structure', label: 'Structure & Completeness', weight: '10%', ...scoreBreakdown.structure },
                  { key: 'education', label: 'Education', weight: '10%', ...scoreBreakdown.education },
                  { key: 'achievements', label: 'Achievements', weight: '10%', ...scoreBreakdown.achievements },
                  { key: 'jobRelevance', label: 'Job Relevance', weight: '10%', ...scoreBreakdown.jobRelevance },
                  { key: 'readability', label: 'Readability & Formatting', weight: '5%', ...scoreBreakdown.readability },
                ].map((item) => {
                  const score = item.score || 70;
                  return (
                    <div key={item.key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {item.label} <span className="text-[10px] text-slate-500 font-normal">({item.weight})</span>
                        </span>
                        <span className="font-extrabold text-slate-800">{score}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      {item.explanation && (
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview & Fixes', icon: Layers },
                { id: 'ats', label: 'ATS-Style Checks', icon: ShieldCheck },
                { id: 'skills', label: 'Skills & Evidence', icon: BrainCircuit },
                { id: 'projects', label: 'Projects & Experience', icon: FolderGit2 },
                { id: 'jobmatch', label: 'Job-Specific Match', icon: Target },
                { id: 'summary', label: 'Summary & Presence', icon: BookOpen },
                { id: 'history', label: 'Version History', icon: History },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ================================================================ */}
            {/* SUB-TAB 1: OVERVIEW & FIXES */}
            {/* ================================================================ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* Section Completeness */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resume Completeness Checklist</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(intelligence.completenessSections || []).map((sec, idx) => {
                      const cfg = STATUS_ICONS[sec.status] || STATUS_ICONS.Missing;
                      const Icon = cfg.icon;
                      return (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
                          <div>
                            <div className="font-bold text-slate-900">{sec.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{sec.details}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>What is Working Well</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {(intelligence.strengths || []).map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <span className="leading-relaxed">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>What Needs Attention</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {(intelligence.weaknesses || []).map((weak, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/50 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                          <span className="leading-relaxed">{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actionable Areas to Improve with Examples */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Actionable Areas to Improve</span>
                  </h3>

                  <div className="space-y-4">
                    {(intelligence.areasToImprove || []).map((area, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{area.issue}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${SEVERITY_BADGES[area.severity] || SEVERITY_BADGES['Medium Priority']}`}>
                            {area.severity}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 leading-relaxed">
                          <strong>Why it matters:</strong> {area.whyItMatters}
                        </div>

                        <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <div className="font-bold text-blue-700">How to fix it:</div>
                          <p className="text-slate-700">{area.howToFix}</p>
                          {area.example && (
                            <div className="pt-1.5 mt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                              <span className="font-semibold text-slate-800">Example:</span> {area.example}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Action Plan */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Your Next 5 Improvements (Priority Action Plan)</span>
                  </h3>

                  <div className="space-y-3">
                    {(intelligence.priorityActionPlan || []).map((act) => (
                      <div key={act.rank} className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {act.rank}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">{act.title}</h4>
                          <p className="text-xs text-slate-300">{act.action}</p>
                          <p className="text-[11px] text-slate-400 italic">Reason: {act.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 2: ATS-STYLE COMPATIBILITY CHECKS */}
            {/* ================================================================ */}
            {activeTab === 'ats' && (
              <div className="space-y-6">

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>ATS-Style Compatibility Checks</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Evaluates standard machine-readable resume characteristics. No tool can guarantee hiring or 100% parser uniformity.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(intelligence.atsCompatibilityChecks || []).map((chk, idx) => (
                      <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">{chk.checkName}</div>
                          <p className="text-slate-600 text-[11px]">{chk.note}</p>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                          chk.passed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {chk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Order Advice */}
                {intelligence.sectionOrderAdvice && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Section Order Recommendation ({intelligence.sectionOrderAdvice.profileType})
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {intelligence.sectionOrderAdvice.recommendation}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 3: SKILLS & EVIDENCE MATRIX */}
            {/* ================================================================ */}
            {activeTab === 'skills' && (
              <div className="space-y-6">

                {/* Categorized Skills */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-blue-600" />
                    <span>Extracted & Categorized Competencies</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(resumeData.extractedData?.categorizedSkills || {}).map(([cat, skList]) => (
                      <div key={cat} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider capitalize">
                          {cat} ({skList?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(skList || []).map((s, idx) => (
                            <span key={idx} className="text-[10px] bg-white text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Evidence Matrix */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>Skill Evidence Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verifies whether skills are simply listed or demonstrated through projects and workplace experience.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold">
                          <th className="py-2.5 px-3">Skill</th>
                          <th className="py-2.5 px-3 text-center">In Skills List</th>
                          <th className="py-2.5 px-3 text-center">In Projects</th>
                          <th className="py-2.5 px-3 text-center">In Experience</th>
                          <th className="py-2.5 px-3 text-center">Evidence Strength</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(intelligence.skillEvidence || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{item.skill}</td>
                            <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="py-2.5 px-3 text-center">
                              {item.inProjects ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {item.inExperience ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                item.evidenceStrength === 'Strong'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : item.evidenceStrength === 'Moderate'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {item.evidenceStrength}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 4: PROJECTS & EXPERIENCE */}
            {/* ================================================================ */}
            {activeTab === 'projects' && (
              <div className="space-y-6">

                {/* Projects Analysis */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                    <span>Project Quality & Impact Analysis</span>
                  </h3>

                  <div className="space-y-4">
                    {(intelligence.projectAnalysis || []).map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {proj.strength}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                          <div>
                            <strong>Problem Solved:</strong> {proj.problemSolvedPresent ? '✓ Clarified' : '⚠ Not detected'}
                          </div>
                          <div>
                            <strong>Measurable Impact:</strong> {proj.impactPresent ? '✓ Included' : '⚠ Consider adding metrics'}
                          </div>
                        </div>

                        {proj.suggestions?.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                            <span className="font-semibold text-slate-900 text-[11px]">Suggestions:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                              {proj.suggestions.map((sug, sIdx) => (
                                <li key={sIdx}>{sug}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Analysis */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-700" />
                    <span>Work Experience & Internship Analysis</span>
                  </h3>

                  {(intelligence.experienceAnalysis || []).length === 0 ? (
                    <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                      Formal work experience was not detected. Projects are currently being evaluated as primary capability evidence.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(intelligence.experienceAnalysis || []).map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{exp.title} @ {exp.company}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              exp.hasMeasurableOutcome ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {exp.hasMeasurableOutcome ? 'Metrics Detected' : 'No Metrics Detected'}
                            </span>
                          </div>

                          {exp.suggestions?.length > 0 && (
                            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 pt-1">
                              {exp.suggestions.map((sug, sIdx) => (
                                <li key={sIdx}>{sug}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 5: KEYWORD & JOB-SPECIFIC MATCH */}
            {/* ================================================================ */}
            {activeTab === 'jobmatch' && (
              <div className="space-y-6">

                {/* Target Role Keyword Analysis */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span>Target Role Keyword Analysis ({targetRole})</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {intelligence.keywordAnalysis?.note}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        Detected Keywords ({intelligence.keywordAnalysis?.detectedKeywords?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(intelligence.keywordAnalysis?.detectedKeywords || []).map((kw, idx) => (
                          <span key={idx} className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-2">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Missing Relevant Keywords ({intelligence.keywordAnalysis?.missingKeywords?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(intelligence.keywordAnalysis?.missingKeywords || []).map((kw, idx) => (
                          <span key={idx} className="text-xs bg-white text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 font-semibold">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyze Against Specific Job */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span>Analyze Against a Specific Open Job</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select any live SkillBridge job posting to evaluate requirement-by-requirement compatibility.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {openJobs.map((j) => (
                        <option key={j._id} value={j._id}>
                          {j.title} @ {j.companyName} ({j.location})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleCompareAgainstJob}
                      disabled={comparingJob}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      {comparingJob ? 'Comparing...' : 'Compare Resume vs Job'}
                    </button>
                  </div>

                  {jobComparisonResult && (
                    <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div>
                          <div className="text-xs font-bold text-purple-900">
                            {jobComparisonResult.job.title} @ {jobComparisonResult.job.companyName}
                          </div>
                          <div className="text-[11px] text-purple-700 mt-0.5">
                            {jobComparisonResult.job.location} ({jobComparisonResult.job.workplaceType})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-purple-700">
                            {jobComparisonResult.compatibilityScore}%
                          </div>
                          <div className="text-[10px] text-purple-600 font-bold uppercase">Match Estimate</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-900">Matched Requirements</h5>
                          <div className="space-y-1.5">
                            {jobComparisonResult.matchedRequirements.map((m, idx) => (
                              <div key={idx} className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>{m.skill}</strong>
                                  <div className="text-[10px] text-emerald-700">{m.evidence}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-900">Missing / Unverified Requirements</h5>
                          <div className="space-y-1.5">
                            {jobComparisonResult.missingRequirements.map((m, idx) => (
                              <div key={idx} className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>{m.skill}</strong>
                                  <div className="text-[10px] text-amber-700">{m.suggestion}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 6: SUMMARY & PRESENCE */}
            {/* ================================================================ */}
            {activeTab === 'summary' && (
              <div className="space-y-6">

                {/* Professional Summary Drafter */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Professional Summary Generator & Editor</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tailored for {targetRole}. You can customize and copy this directly into your resume.
                      </p>
                    </div>

                    <button
                      onClick={handleCopySummary}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={customSummary}
                    onChange={(e) => setCustomSummary(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                {/* Contact Presence */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Contact & Professional Presence Status</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {Object.entries(intelligence.contactPresence || {}).map(([key, item]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-800 capitalize">{key}</span>
                          {item.value && <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{item.value}</div>}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.present ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {item.status || (item.present ? 'Present' : 'Missing')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================ */}
            {/* SUB-TAB 7: VERSION HISTORY */}
            {/* ================================================================ */}
            {activeTab === 'history' && (
              <div className="space-y-6">

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Resume Analysis History & Iterations</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track your profile readiness evolution across different resume revisions and target roles.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>Version {resumeData.currentVersion || 1} (Current)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {resumeData.fileName} • Analyzed for {targetRole} on {new Date(resumeData.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900">{overallScore}/100</div>
                        <div className="text-[10px] text-slate-400 font-medium">{scoreLabel}</div>
                      </div>
                    </div>

                    {(resumeData.versions || []).map((ver, idx) => (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-slate-800">
                            Version {ver.versionNumber || (idx + 1)}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {ver.fileName} • Analyzed for {ver.targetRole} on {new Date(ver.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-700">{ver.overallScore}/100</div>
                          <div className="text-[10px] text-slate-400">{ver.scoreLabel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
