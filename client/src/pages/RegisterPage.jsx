import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Building2, MapPin, Code, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(searchParams.get('role') === 'employer' ? 'employer' : 'jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');
  const [skills, setSkills] = useState('React, Node.js, JavaScript, Tailwind CSS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        location,
        ...(role === 'employer' ? { companyName } : { skills: skills.split(',').map(s => s.trim()).filter(Boolean) }),
      };

      const data = await register(payload);
      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration could not be completed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg text-slate-900">SkillBridge</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create your SkillBridge account</h2>
          <p className="text-xs text-slate-500">Sign up to discover opportunities or post openings.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-xs space-y-4">
          
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-md text-xs font-medium">
            <button
              type="button"
              onClick={() => setRole('jobseeker')}
              className={`py-1.5 px-3 rounded transition-colors ${
                role === 'jobseeker'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`py-1.5 px-3 rounded transition-colors ${
                role === 'employer'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Employer / Recruiter
            </button>
          </div>

          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label htmlFor="reg-name" className="block font-semibold text-slate-700 mb-1">
                {role === 'employer' ? 'Full Name / Recruiter Contact' : 'Full Name'}
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'employer' ? 'e.g. Priya Nambiar' : 'e.g. Aarav Sharma'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            {role === 'employer' ? (
              <div>
                <label htmlFor="reg-company" className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  id="reg-company"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TechNova Solutions"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="reg-skills" className="block font-semibold text-slate-700 mb-1">Primary Skills (Comma-separated)</label>
                <input
                  id="reg-skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python, SQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            )}

            <div>
              <label htmlFor="reg-location" className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                id="reg-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Hyderabad, Pune, Mumbai"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'employer' ? 'Employer' : 'Candidate'}`}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
