import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Route Loading Spinner
const RouteLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" aria-hidden="true" />
      <span className="text-xs font-medium text-slate-500">Loading SkillBridge...</span>
    </div>
  </div>
);

// Critical public pages (Eager load)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy-loaded pages
const JobSearchPage = lazy(() => import('./pages/JobSearchPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const AboutPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.TermsPage })));

// Job Seeker Pages (Lazy)
const SeekerDashboard = lazy(() => import('./pages/seeker/SeekerDashboard'));
const SeekerProfile = lazy(() => import('./pages/seeker/SeekerProfile'));
const ResumeAnalysisPage = lazy(() => import('./pages/seeker/ResumeAnalysisPage'));
const SkillGapExplorer = lazy(() => import('./pages/seeker/SkillGapExplorer'));
const InterviewPrepPage = lazy(() => import('./pages/seeker/InterviewPrepPage'));
const CareerAssistantPage = lazy(() => import('./pages/seeker/CareerAssistantPage'));
const MyApplicationsPage = lazy(() => import('./pages/seeker/MyApplicationsPage'));

// Employer Pages (Lazy)
const EmployerDashboard = lazy(() => import('./pages/employer/EmployerDashboard'));
const CreateJobPage = lazy(() => import('./pages/employer/CreateJobPage'));
const ManageJobsPage = lazy(() => import('./pages/employer/ManageJobsPage'));
const CandidateRankingPage = lazy(() => import('./pages/employer/CandidateRankingPage'));
const CompanyProfilePage = lazy(() => import('./pages/employer/CompanyProfilePage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Suspense fallback={<RouteLoader />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobSearchPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Job Seeker Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-analyzer"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <ResumeAnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-gap"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SkillGapExplorer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-prep"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <InterviewPrepPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/career-assistant"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <CareerAssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Employer Protected Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/create-job"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CreateJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <ManageJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/edit-job/:id"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CreateJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/candidates"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CandidateRankingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/company"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CompanyProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
