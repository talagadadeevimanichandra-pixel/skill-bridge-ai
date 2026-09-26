import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs" aria-hidden="true">
                S
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">SkillBridge</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Connecting skills with opportunities. AI-powered matching and career intelligence for developers and hiring teams.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-slate-600 hover:text-slate-900 transition-colors">Jobs</Link></li>
              <li><Link to="/skill-gap" className="text-slate-600 hover:text-slate-900 transition-colors">Career Resources</Link></li>
              <li><Link to="/register?role=employer" className="text-slate-600 hover:text-slate-900 transition-colors">For Employers</Link></li>
              <li><Link to="/resume-analyzer" className="text-slate-600 hover:text-slate-900 transition-colors">Resume Insights</Link></li>
              <li><Link to="/interview-prep" className="text-slate-600 hover:text-slate-900 transition-colors">Interview Preparation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Active Hubs */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Active Tech Hubs</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Bengaluru</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Hyderabad</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Pune</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Chennai</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Delhi NCR</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Mumbai</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Remote</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
            <span aria-hidden="true">•</span>
            <span className="text-slate-400">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
