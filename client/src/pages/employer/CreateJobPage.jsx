import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, aiAPI } from '../../services/api';
import {
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // AI Prompt Form inputs
  const [aiTitle, setAiTitle] = useState('Full Stack Developer');
  const [aiIndustry, setAiIndustry] = useState('Enterprise Cloud Platforms');
  const [aiExpLevel, setAiExpLevel] = useState('Entry to Mid Level (1-3 yrs)');
  const [aiSkills, setAiSkills] = useState('React, Node.js, Express, MongoDB, Tailwind CSS');
  const [aiLocation, setAiLocation] = useState('Hyderabad, Telangana');
  const [generating, setGenerating] = useState(false);

  // Main Job Listing Form
  const [formData, setFormData] = useState({
    title: 'Full Stack Developer',
    description: 'We are looking for a skilled Full Stack Developer to build reliable, high-performance web applications using React, Node.js, and MongoDB.',
    responsibilities: [
      'Design, build, and deploy clean web interfaces with React and Tailwind CSS.',
      'Develop scalable RESTful APIs and backend services using Node.js and Express.',
      'Maintain database schemas, queries, and migrations with MongoDB.',
      'Participate in agile sprint planning, code reviews, and automated CI/CD deployments.'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'PostgreSQL'],
    experience: { minYears: 1, maxYears: 3, level: '1-3 years' },
    education: "Bachelor's Degree in Computer Science, Information Technology, or related discipline",
    location: 'Hyderabad, Telangana',
    workplaceType: 'Hybrid',
    salary: { min: 800000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
  });

  const [skillTagInput, setSkillTagInput] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const loadJobToEdit = async () => {
        try {
          const res = await jobsAPI.getById(id);
          if (res.data?.success && res.data.job) {
            const j = res.data.job;
            setFormData({
              title: j.title || '',
              description: j.description || '',
              responsibilities: j.responsibilities || [],
              skills: j.skills || [],
              preferredSkills: j.preferredSkills || [],
              experience: j.experience || { minYears: 1, maxYears: 3, level: '1-3 years' },
              education: j.education || '',
              location: j.location || '',
              workplaceType: j.workplaceType || 'Hybrid',
              salary: j.salary || { min: 800000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
              jobType: j.jobType || 'Full-time',
            });
            setAiTitle(j.title || '');
            setAiLocation(j.location || '');
          }
        } catch (err) {
          setError('Failed to load existing job details.');
        } finally {
          setLoadingInitial(false);
        }
      };
      loadJobToEdit();
    }
  }, [id, isEditing]);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setError('');

    try {
      const res = await aiAPI.generateJobDescription({
        title: aiTitle,
        industry: aiIndustry,
        experienceLevel: aiExpLevel,
        keySkills: aiSkills.split(',').map(s => s.trim()).filter(Boolean),
        location: aiLocation,
        workplaceType: formData.workplaceType,
      });

      if (res.data?.success && res.data.data) {
        const generated = res.data.data;
        setFormData({
          ...formData,
          title: generated.title || aiTitle,
          description: generated.description || formData.description,
          responsibilities: generated.responsibilities || formData.responsibilities,
          skills: generated.requiredSkills || formData.skills,
          preferredSkills: generated.preferredSkills || formData.preferredSkills,
          education: generated.qualifications || formData.education,
          location: aiLocation,
        });
      }
    } catch (err) {
      setError('Could not auto-generate description. You can fill out the form fields manually.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddResponsibility = () => {
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, ''],
    });
  };

  const handleUpdateResponsibility = (idx, val) => {
    const updated = [...formData.responsibilities];
    updated[idx] = val;
    setFormData({ ...formData, responsibilities: updated });
  };

  const handleRemoveResponsibility = (idx) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== idx),
    });
  };

  const handleAddSkill = () => {
    if (skillTagInput.trim() && !formData.skills.includes(skillTagInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillTagInput.trim()],
      });
      setSkillTagInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const handlePublishJob = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Job location is required.');
      return;
    }
    if (!formData.skills || formData.skills.length === 0) {
      setError('Please add at least one required technical skill.');
      return;
    }

    setPublishing(true);
    setError('');

    try {
      const res = isEditing
        ? await jobsAPI.update(id, formData)
        : await jobsAPI.create(formData);

      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/employer/jobs');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'publish'} job.`);
    } finally {
      setPublishing(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-700">Loading job details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Job Posting' : 'Create Job Posting'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isEditing
                ? 'Update role responsibilities, required technical skills, and compensation bands.'
                : 'Publish a new technical position with clear skill requirements and competitive compensation.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Job {isEditing ? 'updated' : 'created'} successfully! Redirecting to your active listings...</span>
          </div>
        )}

        {/* AI Assistant Quick Draft Generator */}
        {!isEditing && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Draft Description with AI Assistant
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Target Title</label>
                <input
                  type="text"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Domain / Industry</label>
                <input
                  type="text"
                  value={aiIndustry}
                  onChange={(e) => setAiIndustry(e.target.value)}
                  placeholder="e.g. Fintech, SaaS"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Primary Skills</label>
                <input
                  type="text"
                  value={aiSkills}
                  onChange={(e) => setAiSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Generating Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generate Job Draft</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Main Job Listing Form */}
        <form onSubmit={handlePublishJob} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white font-medium"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Hyderabad, Bengaluru, Pune"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Workplace Policy</label>
              <select
                value={formData.workplaceType}
                onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white font-medium"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Annual Salary (₹ INR)</label>
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, min: parseInt(e.target.value) || 0 }
                })}
                placeholder="800000"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Maximum Annual Salary (₹ INR)</label>
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => setFormData({
                  ...formData,
                  salary: { ...formData.salary, max: parseInt(e.target.value) || 0 }
                })}
                placeholder="1400000"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Role Overview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Overview / Summary</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">Key Responsibilities</label>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Required Technical Skills</label>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="tag-skill inline-flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillTagInput}
                onChange={(e) => setSkillTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type skill and press enter (e.g. React, Docker)"
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={publishing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {publishing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Publish Job Listing'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateJobPage;
