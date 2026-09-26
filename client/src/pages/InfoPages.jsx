import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, FileText, CheckCircle2, ArrowRight, Building, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            About SkillBridge
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Connecting technical skills with verified opportunities.
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            SkillBridge AI is a next-generation employment intelligence platform designed to bridge the gap between skilled developers and engineering teams. Instead of relying purely on superficial keyword matching, SkillBridge evaluates core competencies, framework clusters, practical project experience, and skill readiness.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="text-xl font-bold text-blue-600">Explainable AI</div>
              <p className="text-xs text-slate-500">Every match score includes clear breakdowns of matched, partial, and missing skills.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="text-xl font-bold text-blue-600">Skill Development</div>
              <p className="text-xs text-slate-500">Actionable roadmaps to close requirement gaps before your next interview.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="text-xl font-bold text-blue-600">Ethical Hiring</div>
              <p className="text-xs text-slate-500">Transparent recruiter evaluation tools focused on candidate technical capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact SkillBridge Support</h1>
            <p className="text-xs text-slate-500 mt-1">Have questions or feedback? Reach out to our engineering and support team.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">Message Received</h3>
              <p className="text-xs text-emerald-700">Thank you for reaching out. A team member will respond within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-800 underline"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="How can we assist you?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter details of your request..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-blue-600">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Privacy Policy</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SkillBridge Privacy Commitment</h1>
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            At SkillBridge, we treat your career data, resumes, and personal information with utmost security and confidentiality.
          </p>
          <h3 className="text-sm font-bold text-slate-900">1. Data We Collect</h3>
          <p>
            We collect information provided directly by users during registration, profile setup, resume uploads, and job applications (such as name, contact details, work experience, education, and technical skills).
          </p>
          <h3 className="text-sm font-bold text-slate-900">2. How AI Analyzes Your Data</h3>
          <p>
            Candidate resumes and skill profiles are processed strictly to calculate compatibility with job requirements and generate personalized learning roadmaps. We never sell your personal data to third parties.
          </p>
          <h3 className="text-sm font-bold text-slate-900">3. Application Confidentiality</h3>
          <p>
            Your application history and interview preparations remain private to you and the specific employers you choose to apply with.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-blue-600">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Terms of Service</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Terms of Use</h1>
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Welcome to SkillBridge. By accessing or using our platform, you agree to comply with and be bound by the following terms.
          </p>
          <h3 className="text-sm font-bold text-slate-900">1. Account Responsibility</h3>
          <p>
            Users are responsible for maintaining the confidentiality of their login credentials and providing accurate career and company information.
          </p>
          <h3 className="text-sm font-bold text-slate-900">2. Appropriate Platform Use</h3>
          <p>
            Employers must post genuine employment opportunities. Job seekers agree to submit genuine profile details and resumes.
          </p>
          <h3 className="text-sm font-bold text-slate-900">3. AI Recommendations Disclaimer</h3>
          <p>
            AI compatibility scores, interview question generation, and career insights are predictive advisory tools to assist decision-making, not guarantees of employment.
          </p>
        </div>
      </div>
    </div>
  );
};
