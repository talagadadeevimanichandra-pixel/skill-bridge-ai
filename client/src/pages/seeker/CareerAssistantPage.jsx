import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiAPI, jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Send,
  User,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  FileText,
  Code,
  Briefcase,
  Compass,
} from 'lucide-react';

const CareerAssistantPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const paramJobId = searchParams.get('jobId') || '';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello **${user?.name?.split(' ')[0] || 'there'}**! 👋 I'm your **Career Assistant**.\n\nI can help you review your technical skills, prepare for upcoming interviews, discuss project ideas, and tailor your resume for open engineering positions.\n\nFeel free to ask a question or select from the common topics below.`,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(paramJobId);
  const [jobs, setJobs] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobsAPI.getAll();
        if (res.data?.success) setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    loadJobs();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customText = null) => {
    const text = customText || inputMessage;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const res = await aiAPI.careerAssistant({
        message: text,
        history: newMessages.slice(-6),
        jobId: selectedJobId || undefined,
      });

      if (res.data?.success) {
        setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'I encountered a brief connection error. Please try asking again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Role Alignment', text: 'Based on my skills in React, Node.js, and MongoDB, what engineering roles am I best suited for?' },
    { label: 'Portfolio Projects', text: 'What full stack portfolio projects would stand out to hiring managers?' },
    { label: 'Resume Improvements', text: 'How should I structure bullet points to highlight impact and metrics on my resume?' },
    { label: 'Next Skills', text: 'What high-priority skills should I learn next after mastering React and Node.js?' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Career Advisory Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Personalized guidance on skill development, resume optimization, and interview preparation.
            </p>
          </div>

          {/* Job Context Selector */}
          <div className="shrink-0 w-full sm:w-64">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Active Job Context
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No specific job context</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title} @ {j.companyName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Workspace Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
          
          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white shadow-2xs rounded-br-none font-medium'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 text-xs font-bold uppercase shadow-2xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                  Analyzing and preparing recommendations...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text)}
                className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 shrink-0 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your resume, skill gaps, projects, or interview prep..."
                disabled={loading}
                aria-label="Ask Career Assistant a question"
                className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                aria-label="Send message"
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CareerAssistantPage;
