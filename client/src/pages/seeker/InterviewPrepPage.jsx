import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiAPI, jobsAPI } from '../../services/api';
import {
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Send,
  RefreshCw,
  BookOpen,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Award,
} from 'lucide-react';

const InterviewPrepPage = () => {
  const [searchParams] = useSearchParams();
  const paramJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(paramJobId);
  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [companyName, setCompanyName] = useState('TechNova Solutions');

  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load jobs for dropdown
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobsAPI.getAll();
        if (res.data?.success) {
          setJobs(res.data.jobs || []);
          if (paramJobId) {
            const found = res.data.jobs.find(j => j._id === paramJobId);
            if (found) {
              setJobTitle(found.title);
              setCompanyName(found.companyName);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    loadJobs();
  }, [paramJobId]);

  const loadQuestions = async () => {
    setLoading(true);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const res = await aiAPI.generateInterviewQuestions({
        jobId: selectedJobId || undefined,
        jobTitle,
        companyName,
      });

      if (res.data?.success) {
        setQuestions(res.data.questions || []);
        setSelectedQuestionIdx(0);
      }
    } catch (err) {
      console.error('Failed to generate interview pack:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedJobId, jobTitle]);

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const currentQ = questions[selectedQuestionIdx];
      const res = await aiAPI.evaluateAnswer({
        question: currentQ.question,
        answer: userAnswer,
        jobTitle,
      });

      if (res.data?.success) {
        setEvaluation(res.data.evaluation);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQuestion = questions[selectedQuestionIdx];

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Technical': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'System Design': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Behavioral': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Interview Preparation & Simulation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Practice technical and behavioral interview questions tailored to specific roles and get constructive evaluation feedback.
            </p>
          </div>
        </div>

        {/* Role Selector Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Job Opening</label>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  const found = jobs.find(j => j._id === e.target.value);
                  if (found) {
                    setJobTitle(found.title);
                    setCompanyName(found.companyName);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose specific opening --</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} @ {j.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">General Role Track</label>
              <select
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  setSelectedJobId('');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="AI/ML Intern">AI/ML Intern</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simulator Grid */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-700">Generating role-specific interview questions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Questions List */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                Interview Questions ({questions.length})
              </h3>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedQuestionIdx(idx);
                      setEvaluation(null);
                      setUserAnswer('');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      selectedQuestionIdx === idx
                        ? 'bg-blue-50/70 border-blue-300 shadow-xs font-medium text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadge(q.category)}`}>
                          {q.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Question {idx + 1}
                        </span>
                      </div>
                      <p className="line-clamp-2 leading-relaxed font-medium">
                        {q.question}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 2 Columns: Active Question & Answer Playground */}
            <div className="lg:col-span-2 space-y-6">
              {currentQuestion && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                  
                  {/* Question Header */}
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(currentQuestion.category)}`}>
                        {currentQuestion.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Difficulty: <strong className="text-slate-700">{currentQuestion.difficulty || 'Intermediate'}</strong>
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentQuestion.question}
                    </h2>

                    {currentQuestion.context && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {currentQuestion.context}
                      </p>
                    )}
                  </div>

                  {/* Answer Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Your Response
                    </label>
                    <textarea
                      rows={5}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your response explaining your solution, reasoning, or experience..."
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserAnswer(currentQuestion.idealAnswer || 'In React, state represents data that changes over time within a component. We manage it using useState or useReducer for local state, and Context API or Redux for global state.');
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      Fill sample response
                    </button>

                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={evaluating || !userAnswer.trim()}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit for Review</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Evaluation Result Display */}
                  {evaluation && (
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Evaluation Score
                          </h4>
                        </div>
                        <div className="text-sm font-bold text-slate-900 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
                          {evaluation.score || 85} / 100
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed">
                        {evaluation.feedback}
                      </div>

                      {evaluation.strengths?.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Strengths:</span>
                          </div>
                          <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                            {evaluation.strengths.map((s, sIdx) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluation.improvements?.length > 0 && (
                        <div className="space-y-1 text-xs">
                          <div className="font-semibold text-blue-800 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Areas to Refine:</span>
                          </div>
                          <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                            {evaluation.improvements.map((imp, iIdx) => (
                              <li key={iIdx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default InterviewPrepPage;
