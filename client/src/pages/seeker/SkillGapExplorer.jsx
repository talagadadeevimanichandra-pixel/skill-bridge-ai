import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { skillsAPI, jobsAPI, aiAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SkillGapCard from '../../components/SkillGapCard';
import Modal from '../../components/Modal';
import {
  Code,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  Palette,
  Smartphone,
  CheckCircle2,
  Briefcase,
  Megaphone,
  Users,
  Award,
  Search,
  Filter,
  Sparkles,
  Layers,
  BookOpen,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  GraduationCap,
  Target,
  Compass,
  BookmarkCheck,
  X,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', name: 'All Skills', icon: Layers, color: 'text-slate-700 bg-slate-100 border-slate-200' },
  { id: 'Software Development', name: 'Software Development', icon: Code, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'AI & Machine Learning', name: 'AI & Machine Learning', icon: Brain, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'Data & Analytics', name: 'Data & Analytics', icon: Database, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'Cloud & DevOps', name: 'Cloud & DevOps', icon: Cloud, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { id: 'Cybersecurity', name: 'Cybersecurity', icon: ShieldCheck, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'UI/UX & Design', name: 'UI/UX & Design', icon: Palette, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { id: 'Mobile Development', name: 'Mobile Development', icon: Smartphone, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { id: 'Software Testing', name: 'Software Testing', icon: CheckCircle2, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { id: 'Business & Management', name: 'Business & Management', icon: Briefcase, color: 'text-slate-800 bg-slate-100 border-slate-300' },
  { id: 'Marketing & Sales', name: 'Marketing & Sales', icon: Megaphone, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { id: 'Professional Skills', name: 'Professional Skills', icon: Users, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  { id: 'Career & Job Skills', name: 'Career & Job Skills', icon: Award, color: 'text-emerald-800 bg-emerald-50 border-emerald-300' },
];

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
};

const STATUS_BADGES = {
  Strong: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Developing: 'bg-blue-100 text-blue-800 border-blue-300',
  Learning: 'bg-amber-100 text-amber-800 border-amber-300',
};

const SkillGapExplorer = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'library';
  const paramJobId = searchParams.get('jobId') || '';
  const paramSkill = searchParams.get('skill') || '';

  // Tab State
  const [activeTab, setActiveTab] = useState(currentTab);

  // Skill Library State
  const [skills, setSkills] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [libraryLoading, setLibraryLoading] = useState(true);

  // Skill Detail Modal State
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillDetailLoading, setSkillDetailLoading] = useState(false);
  const [skillRelatedJobs, setSkillRelatedJobs] = useState([]);

  // My Tracked Skills State
  const [trackedSkills, setTrackedSkills] = useState([]);
  const [updatingSkill, setUpdatingSkill] = useState(null);

  // Roadmap State (Preserved)
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(paramJobId);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customSkill, setCustomSkill] = useState(paramSkill);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Categories & Skills
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await skillsAPI.getCategories();
        if (res.data?.success) {
          setCategoriesData(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch skill categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Skills when filters change
  useEffect(() => {
    const fetchSkills = async () => {
      setLibraryLoading(true);
      try {
        const params = {
          limit: 150,
        };
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
        if (debouncedQuery.trim()) params.search = debouncedQuery.trim();

        const res = await skillsAPI.getAll(params);
        if (res.data?.success) {
          setSkills(res.data.skills || []);
        }
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      } finally {
        setLibraryLoading(false);
      }
    };
    fetchSkills();
  }, [selectedCategory, selectedDifficulty, debouncedQuery]);

  // Load User Tracked Skills
  useEffect(() => {
    const fetchTrackedSkills = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await skillsAPI.getMySkills();
        if (res.data?.success) {
          setTrackedSkills(res.data.trackedSkills || []);
        }
      } catch (err) {
        console.error('Failed to fetch tracked skills:', err);
      }
    };
    fetchTrackedSkills();
  }, [isAuthenticated]);

  // Load Jobs for Roadmap Selector
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobsAPI.getAll({ limit: 50 });
        if (res.data?.success) {
          setJobs(res.data.jobs || []);
          if (paramJobId) {
            const found = res.data.jobs.find(j => j._id === paramJobId);
            if (found) setTargetRole(found.title);
          }
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    loadJobs();
  }, [paramJobId]);

  // Generate Roadmap
  const generateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const res = await aiAPI.getSkillGap({
        jobId: selectedJobId || undefined,
        targetRole: targetRole,
        missingSkills: customSkill ? [customSkill] : undefined,
      });

      if (res.data?.success) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.error('Failed to generate skill gap roadmap:', err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'roadmap') {
      generateRoadmap();
    }
  }, [activeTab, selectedJobId, targetRole]);

  // Open Skill Detail Modal
  const handleOpenSkill = async (skill) => {
    setSelectedSkill(skill);
    setSkillDetailLoading(true);
    try {
      const res = await skillsAPI.getById(skill._id || skill.name);
      if (res.data?.success) {
        setSelectedSkill(res.data.skill);
        setSkillRelatedJobs(res.data.relatedJobs || []);
      }
    } catch (err) {
      console.error('Failed to load skill details:', err);
    } finally {
      setSkillDetailLoading(false);
    }
  };

  // Update Tracked Skill Status
  const handleUpdateStatus = async (skillName, status) => {
    if (!isAuthenticated) return;
    setUpdatingSkill(skillName);
    try {
      const res = await skillsAPI.updateMySkill({ name: skillName, status });
      if (res.data?.success) {
        setTrackedSkills(res.data.trackedSkills || []);
      }
    } catch (err) {
      console.error('Failed to update skill status:', err);
    } finally {
      setUpdatingSkill(null);
    }
  };

  // Remove Tracked Skill
  const handleRemoveTrackedSkill = async (skillName) => {
    if (!isAuthenticated) return;
    try {
      const res = await skillsAPI.removeMySkill(skillName);
      if (res.data?.success) {
        setTrackedSkills(res.data.trackedSkills || []);
      }
    } catch (err) {
      console.error('Failed to remove tracked skill:', err);
    }
  };

  // Map of tracked skill statuses for quick lookup
  const trackedMap = useMemo(() => {
    const map = new Map();
    trackedSkills.forEach(s => {
      map.set(s.name.toLowerCase(), s.status);
    });
    return map;
  }, [trackedSkills]);

  // Tracked counts summary
  const trackedCounts = useMemo(() => {
    return {
      strong: trackedSkills.filter(s => s.status === 'Strong').length,
      developing: trackedSkills.filter(s => s.status === 'Developing').length,
      learning: trackedSkills.filter(s => s.status === 'Learning').length,
      total: trackedSkills.length,
    };
  }, [trackedSkills]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('tab', tab);
      return p;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Development Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Skill Development & Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Explore 12 career domains, discover industry-standard competencies, inspect syllabus topics, and build your personalized skill profile.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto shrink-0">
            <button
              onClick={() => switchTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Skill Library ({skills.length})</span>
            </button>

            <button
              onClick={() => switchTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>Target Role Gap</span>
            </button>

            <button
              onClick={() => switchTab('my-skills')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'my-skills'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Skills ({trackedCounts.total})</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: SKILL LIBRARY & EXPLORER */}
        {/* ================================================================ */}
        {activeTab === 'library' && (
          <div className="space-y-6">

            {/* Category Filter Pills (12 Domains) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>Browse by Domain ({CATEGORIES.length - 1} Specializations)</span>
                </span>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Reset Category
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const count = cat.id === 'All' 
                    ? null 
                    : categoriesData.find(c => c.category === cat.id)?.count || null;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-102'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span>{cat.name}</span>
                      {count !== null && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search & Difficulty Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, tools, roles, or topics (e.g. React, Docker, SQL)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            {libraryLoading ? (
              <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-semibold text-slate-600">Loading structured skill library...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">No skills found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No skills matched your search criteria. Try clearing search filters or picking another category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {skills.map((skill) => {
                  const currentStatus = trackedMap.get(skill.name.toLowerCase());
                  const diffColor = DIFFICULTY_COLORS[skill.difficulty] || DIFFICULTY_COLORS.Intermediate;

                  return (
                    <div
                      key={skill._id || skill.name}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        {/* Header: Name, Category, Difficulty */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {skill.name}
                              </h3>
                              {currentStatus && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${STATUS_BADGES[currentStatus]}`}>
                                  {currentStatus}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                              <span>{skill.category}</span>
                              {skill.subcategory && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-600">{skill.subcategory}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${diffColor}`}>
                            {skill.difficulty}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {skill.description}
                        </p>

                        {/* Common Roles Tags */}
                        {skill.commonRoles && skill.commonRoles.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Common Roles:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {skill.commonRoles.slice(0, 3).map((role, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Skills Pills */}
                        {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Related:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {skill.relatedSkills.slice(0, 4).map((rel, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSearchQuery(rel)}
                                  className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium transition-colors"
                                >
                                  +{rel}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Status Dropdown/Pill */}
                        {isAuthenticated ? (
                          <select
                            value={currentStatus || ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateStatus(skill.name, e.target.value);
                              } else {
                                handleRemoveTrackedSkill(skill.name);
                              }
                            }}
                            disabled={updatingSkill === skill.name}
                            className={`text-xs font-semibold py-1.5 px-2.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              currentStatus
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <option value="" className="bg-white text-slate-700">+ Track Skill</option>
                            <option value="Learning" className="bg-white text-amber-700 font-bold">🟡 Learning</option>
                            <option value="Developing" className="bg-white text-blue-700 font-bold">🔵 Developing</option>
                            <option value="Strong" className="bg-white text-emerald-700 font-bold">🟢 Strong</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Log in to track
                          </span>
                        )}

                        {/* View Details Button */}
                        <button
                          onClick={() => handleOpenSkill(skill)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Explore Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: ROLE SKILL GAP & ROADMAP */}
        {/* ================================================================ */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">

            {/* Target Position Configuration Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Target Position Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Specific Job Posting</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      const found = jobs.find(j => j._id === e.target.value);
                      if (found) setTargetRole(found.title);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose from open positions --</option>
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title} @ {j.companyName} ({j.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">General Engineering Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      setSelectedJobId('');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full Stack Developer">Full Stack Developer (React / Node.js)</option>
                    <option value="Frontend Developer">Frontend Developer (React / TypeScript)</option>
                    <option value="Backend Developer">Backend Developer (Node.js / Express / MongoDB)</option>
                    <option value="AI/ML Intern">AI/ML Intern (Python / PyTorch)</option>
                    <option value="Cloud Intern">Cloud & DevOps Intern (AWS / Docker)</option>
                    <option value="Data Analyst">Data Analyst (SQL / Python / PowerBI)</option>
                    <option value="Cybersecurity Intern">Cybersecurity Intern (Network Security / SOC)</option>
                    <option value="UI/UX Designer">UI/UX Designer (Figma / Design Systems)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Roadmap Display */}
            {roadmapLoading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-semibold text-slate-700">Synthesizing personalized learning plan...</p>
              </div>
            ) : roadmap ? (
              <div className="space-y-6">
                
                {/* Overview Banner */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Target Role: {roadmap.targetJobTitle}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Targeted Skill Roadmap
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                        {roadmap.actionPlanSummary}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-center shrink-0">
                      <div className="flex items-center justify-center gap-1.5 text-xl font-bold text-emerald-400">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <span>{roadmap.estimatedTimeToCloseGap || '2-4 weeks'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                        Estimated Timeframe
                      </div>
                    </div>

                  </div>
                </div>

                {/* List of Skill Gap Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span>Missing Competencies & Learning Modules ({roadmap.missingSkillsBreakdown?.length || 0})</span>
                    </h3>
                  </div>

                  {(roadmap.missingSkillsBreakdown || []).map((item, idx) => (
                    <SkillGapCard key={idx} breakdownItem={item} index={idx} />
                  ))}
                </div>

              </div>
            ) : null}

          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: MY TRACKED SKILLS */}
        {/* ================================================================ */}
        {activeTab === 'my-skills' && (
          <div className="space-y-6">

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tracked</span>
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{trackedCounts.total}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across your career portfolio</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Strong</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-2xl font-bold text-emerald-600 mt-2">{trackedCounts.strong}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Ready for technical interviews</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Developing</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">{trackedCounts.developing}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Actively building projects</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </div>
                <div className="text-2xl font-bold text-amber-600 mt-2">{trackedCounts.learning}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Current learning roadmap</div>
              </div>
            </div>

            {/* Tracked List */}
            {trackedSkills.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No tracked skills yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Browse the Skill Library tab to tag your current proficiency levels (Strong, Developing, Learning) to track your career readiness.
                </p>
                <button
                  onClick={() => switchTab('library')}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Explore Skill Library
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
                <div className="p-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Your Tracked Competencies</h3>
                  <button
                    onClick={() => switchTab('library')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Skills</span>
                  </button>
                </div>

                {trackedSkills.map((ts, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {ts.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{ts.name}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Added {ts.addedAt ? new Date(ts.addedAt).toLocaleDateString() : 'recently'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <select
                        value={ts.status}
                        onChange={(e) => handleUpdateStatus(ts.name, e.target.value)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_BADGES[ts.status]}`}
                      >
                        <option value="Learning">🟡 Learning</option>
                        <option value="Developing">🔵 Developing</option>
                        <option value="Strong">🟢 Strong</option>
                      </select>

                      <button
                        onClick={() => handleRemoveTrackedSkill(ts.name)}
                        aria-label="Remove skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ================================================================ */}
        {/* SKILL DETAIL MODAL */}
        {/* ================================================================ */}
        <Modal
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
          title={selectedSkill?.name || 'Skill Details'}
          subtitle={`${selectedSkill?.category || ''} • ${selectedSkill?.subcategory || ''}`}
          maxWidth="max-w-3xl"
        >
          {selectedSkill && (
            <div className="space-y-6">

              {/* Badges & Tracking Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[selectedSkill.difficulty] || DIFFICULTY_COLORS.Intermediate}`}>
                    {selectedSkill.difficulty} Level
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedSkill.category}
                  </span>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">My Status:</span>
                    <select
                      value={trackedMap.get(selectedSkill.name.toLowerCase()) || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleUpdateStatus(selectedSkill.name, e.target.value);
                        } else {
                          handleRemoveTrackedSkill(selectedSkill.name);
                        }
                      }}
                      className="text-xs font-bold py-1 px-3 rounded-lg border bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Not Tracked</option>
                      <option value="Learning">🟡 Learning</option>
                      <option value="Developing">🔵 Developing</option>
                      <option value="Strong">🟢 Strong</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overview</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Learning Topics & Syllabus */}
              {selectedSkill.learningTopics && selectedSkill.learningTopics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Core Learning Syllabus & Competencies</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedSkill.learningTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs font-medium text-slate-800">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Practical Projects */}
              {selectedSkill.practiceProjects && selectedSkill.practiceProjects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Portfolio Projects</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedSkill.practiceProjects.map((proj, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs font-medium text-slate-800">
                        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Career Roles */}
              {selectedSkill.commonRoles && selectedSkill.commonRoles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                    <span>Common Roles Requiring this Skill</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.commonRoles.map((role, idx) => (
                      <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Skills */}
              {selectedSkill.relatedSkills && selectedSkill.relatedSkills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Related Skills in Ecosystem
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.relatedSkills.map((rel, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSkill(null);
                          setSearchQuery(rel);
                          switchTab('library');
                        }}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Jobs Requiring this Skill */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Jobs Hiring For {selectedSkill.name}</span>
                  </h4>
                  <Link
                    to={`/jobs?search=${encodeURIComponent(selectedSkill.name)}`}
                    onClick={() => setSelectedSkill(null)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All in Jobs Market →
                  </Link>
                </div>

                {skillDetailLoading ? (
                  <div className="p-4 text-center text-xs text-slate-500">Checking open postings...</div>
                ) : skillRelatedJobs.length === 0 ? (
                  <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                    No active job listings directly matching at this moment. Explore related roles or search jobs.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skillRelatedJobs.map((job) => (
                      <Link
                        key={job._id}
                        to={`/jobs/${job._id}`}
                        onClick={() => setSelectedSkill(null)}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all block group"
                      >
                        <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {job.companyName} • {job.location} ({job.workplaceType})
                        </div>
                        {job.salary && (
                          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                            {job.salary}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default SkillGapExplorer;
