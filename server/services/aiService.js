const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * SkillBridge AI Core Service
 * Handles Gemini 1.5 API orchestration with timeout protection,
 * schema validation, and grounded domain fallbacks for recruiting in India.
 */

const GEMINI_TIMEOUT_MS = 12000; // 12-second timeout for AI calls

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.warn('[AI Service] Gemini initialization notice:', error.message);
    return null;
  }
};

/**
 * Execute Gemini call with timeout protection
 */
async function callGeminiWithTimeout(model, prompt) {
  const aiPromise = model.generateContent(prompt);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('AI request timed out')), GEMINI_TIMEOUT_MS)
  );

  const result = await Promise.race([aiPromise, timeoutPromise]);
  return result.response.text();
}

/**
 * Clean markdown fences and parse JSON safely
 */
function cleanAndParseJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerErr) {
        throw new Error(`Failed to parse AI JSON response: ${e.message}`);
      }
    }
    throw e;
  }
}

const { runDeterministicAnalysis } = require('./resumeIntelligenceService');

// ----------------------------------------------------
// 1. RESUME ANALYSIS & EXTRACTION
// ----------------------------------------------------
async function analyzeResume(resumeText, fileName = 'resume.pdf', targetRole = 'Full Stack Developer', previousAnalysis = null) {
  // First generate deterministic baseline
  const baseResult = runDeterministicAnalysis(resumeText, targetRole, fileName, previousAnalysis);

  const model = getGeminiModel();
  if (model && resumeText && resumeText.length > 30) {
    try {
      const prompt = `You are a career intelligence AI evaluating a resume for the target role: "${targetRole}".
Analyze the following resume text and provide qualitative refinements.
Do NOT invent experience, certifications, metrics, or companies not in the text.
Return ONLY valid JSON matching this schema:
{
  "summaryDraft": "2-3 sentence tailored professional summary",
  "specificStrengths": ["3 grounded observations directly from the text"],
  "specificWeaknesses": ["2 grounded actionable areas for improvement"],
  "tailoredAdvice": "1 sentence practical recommendation for ${targetRole}"
}

Resume Text:
"""
${resumeText.slice(0, 10000)}
"""`;

      const text = await callGeminiWithTimeout(model, prompt);
      const geminiData = cleanAndParseJSON(text);

      if (geminiData.summaryDraft) {
        baseResult.intelligence.summaryAnalysis.suggestedDraft = geminiData.summaryDraft;
        baseResult.aiAnalysis.summary = geminiData.summaryDraft;
      }
      if (geminiData.specificStrengths && geminiData.specificStrengths.length > 0) {
        baseResult.intelligence.strengths = geminiData.specificStrengths;
        baseResult.aiAnalysis.strengths = geminiData.specificStrengths;
      }
      if (geminiData.specificWeaknesses && geminiData.specificWeaknesses.length > 0) {
        baseResult.intelligence.weaknesses = geminiData.specificWeaknesses;
      }
    } catch (err) {
      console.warn('[AI Service] Gemini enhancement skipped, using grounded deterministic analysis:', err.message);
    }
  }

  return baseResult;
}

// ----------------------------------------------------
// 2. JOB REQUIREMENT EXTRACTION & DESCRIPTION DRAFTER
// ----------------------------------------------------
async function generateJobDescription({
  title = 'Full Stack Developer',
  industry = 'Enterprise Software',
  experienceLevel = 'Entry to Mid Level',
  keySkills = ['React', 'Node.js', 'MongoDB'],
  workplaceType = 'Hybrid',
  location = 'Hyderabad, India',
}) {
  const model = getGeminiModel();
  if (model) {
    try {
      const prompt = `You are a technical recruiter in India. Generate a realistic, professional Job Description in strict JSON format:
Title: ${title}
Industry: ${industry}
Experience: ${experienceLevel}
Skills: ${Array.isArray(keySkills) ? keySkills.join(', ') : keySkills}
Location: ${location}

Output Schema:
{
  "title": "${title}",
  "description": "Clear overview of the role and team mission...",
  "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4"],
  "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "preferredSkills": ["Preferred 1", "Preferred 2"],
  "qualifications": "Educational and experience expectations"
}`;

      const text = await callGeminiWithTimeout(model, prompt);
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn('[AI Service] Job description generator fallback:', err.message);
    }
  }

  const skillsArray = Array.isArray(keySkills) ? keySkills : (keySkills || '').split(',').map(s => s.trim()).filter(Boolean);
  const coreList = skillsArray.length > 0 ? skillsArray : ['React', 'Node.js', 'TypeScript', 'MongoDB'];

  return {
    title: title.includes('Developer') || title.includes('Engineer') ? title : `${title} Developer`,
    description: `We are looking for a ${title} to join our engineering team in ${location}. In this role, you will build and maintain reliable web applications, collaborate with cross-functional team members, and deliver clean, well-tested code.`,
    responsibilities: [
      `Design and build web application features using ${coreList.slice(0, 2).join(' and ')}.`,
      'Collaborate with designers and backend engineers to deliver functional user interfaces.',
      'Write modular, readable code following standard development practices.',
      'Participate in sprint reviews, code reviews, and automated CI/CD deployments.'
    ],
    requiredSkills: coreList.concat(['Git', 'REST APIs']),
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Jest'],
    qualifications: "Bachelor's degree in Computer Science, Information Technology, or equivalent practical experience."
  };
}

// ----------------------------------------------------
// 3. SKILL GAP ANALYSIS & ROADMAP GENERATOR
// ----------------------------------------------------
async function generateSkillGapRoadmap({ currentSkills = [], targetJobTitle = 'Full Stack Developer', missingSkills = [], requiredSkills = [] }) {
  const model = getGeminiModel();
  const missingList = missingSkills.length > 0 ? missingSkills : ['TypeScript', 'Docker', 'Jest'];

  if (model) {
    try {
      const prompt = `You are a senior engineering mentor. Analyze the candidate's skill gap for target role "${targetJobTitle}".
Candidate current skills: ${currentSkills.join(', ')}
Target skills to strengthen: ${missingList.join(', ')}

Return ONLY valid JSON:
{
  "targetJobTitle": "${targetJobTitle}",
  "estimatedTimeToCloseGap": "3–4 weeks",
  "currentSkills": ${JSON.stringify(currentSkills)},
  "missingSkills": ${JSON.stringify(missingList)},
  "prioritySkills": [
    {"skill": "${missingList[0] || 'TypeScript'}", "priority": "High", "impact": "Critical for large scale applications"}
  ],
  "missingSkillsBreakdown": [
    {
      "skill": "Skill Name",
      "importance": "High",
      "whyItMatters": "Clear reason why this skill is valued in this role",
      "learningPath": {
        "step1": "Core concepts (4-6 hours)",
        "step2": "Practical exercises (6-8 hours)",
        "step3": "Portfolio integration (8 hours)"
      },
      "recommendedResources": [
        {"title": "Resource Name", "type": "Documentation", "url": "https://...", "isFree": true}
      ],
      "practiceProject": {
        "title": "Project Title",
        "description": "Concise prompt for a portfolio feature",
        "deliverable": "GitHub repository with README"
      }
    }
  ],
  "actionPlanSummary": "Practical summary of steps to bridge the gap."
}`;

      const text = await callGeminiWithTimeout(model, prompt);
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn('[AI Service] Skill gap fallback triggered:', err.message);
    }
  }

  const breakdown = missingList.map((skill, index) => {
    let resources = [
      { title: `Official ${skill} Documentation`, type: 'Documentation', url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation')}`, isFree: true },
      { title: `${skill} Practical Guide & Tutorial`, type: 'Guide', url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' guide')}`, isFree: true }
    ];

    let project = {
      title: `${skill} Integration Project`,
      description: `Build a small application demonstrating core usage of ${skill} with clean structure and clear README instructions.`,
      deliverable: 'GitHub Repository with code and setup guide'
    };

    if (skill.toLowerCase().includes('typescript')) {
      resources = [
        { title: 'TypeScript Handbook for Developers', type: 'Official Guide', url: 'https://www.typescriptlang.org/docs/', isFree: true },
        { title: 'React with TypeScript CheatSheet', type: 'Reference', url: 'https://react-typescript-cheatsheet.netlify.app/', isFree: true }
      ];
      project = {
        title: 'Type-Safe Task Management API',
        description: 'Create a Node.js REST API with strict TypeScript typing, request validation, and clean interfaces.',
        deliverable: 'TypeScript GitHub repository'
      };
    } else if (skill.toLowerCase().includes('docker')) {
      resources = [
        { title: 'Docker Getting Started Guide', type: 'Documentation', url: 'https://docs.docker.com/get-started/', isFree: true }
      ];
      project = {
        title: 'Containerized Web App Stack',
        description: 'Write a Dockerfile and docker-compose.yml file to run a frontend, API, and database locally.',
        deliverable: 'Dockerfile & Compose configuration'
      };
    }

    return {
      skill,
      importance: index === 0 ? 'High' : 'Medium',
      whyItMatters: `${skill} is frequently requested for ${targetJobTitle} roles to ensure code maintainability and standard workflow alignment.`,
      learningPath: {
        step1: `Understand ${skill} core concepts and syntax (4–6 hours)`,
        step2: `Build an isolated proof of concept (6–8 hours)`,
        step3: `Integrate into your main portfolio application (8 hours)`
      },
      recommendedResources: resources,
      practiceProject: project
    };
  });

  const prioritySkills = missingList.map((s, idx) => ({
    skill: s,
    priority: idx === 0 ? 'High' : 'Medium',
    impact: `Frequently required in ${targetJobTitle} job postings`
  }));

  return {
    targetJobTitle,
    estimatedTimeToCloseGap: '3–4 weeks',
    currentSkills,
    missingSkills: missingList,
    prioritySkills,
    missingSkillsBreakdown: breakdown,
    actionPlanSummary: `By strengthening ${missingList.slice(0, 3).join(', ')}, you will meet the core requirements for ${targetJobTitle} roles.`
  };
}

// ----------------------------------------------------
// 4. CAREER RECOMMENDATIONS GENERATOR
// ----------------------------------------------------
async function getCareerRecommendations({ userProfile = {} }) {
  const model = getGeminiModel();
  const skills = userProfile.profile?.skills || userProfile.skills || ['JavaScript', 'React', 'Node.js', 'MongoDB'];
  const experience = userProfile.profile?.experience || userProfile.experience || [];
  const preferences = userProfile.profile?.preferredJobRoles || ['Full Stack Developer', 'Software Engineer'];

  if (model) {
    try {
      const prompt = `You are a career counselor for the Indian tech industry.
Candidate skills: ${skills.join(', ')}
Candidate target preferences: ${preferences.join(', ')}

Generate 3 personalized career recommendations in strict JSON format:
{
  "recommendations": [
    {
      "roleTitle": "Full Stack Developer",
      "matchPercentage": 88,
      "whyRelevant": "Detailed explanation connecting their exact skills to role demands...",
      "keySkillsNeeded": ["React", "Node.js", "TypeScript"],
      "growthOutlook": "High demand across Bengaluru, Hyderabad, and Pune hubs",
      "recommendedNextSteps": ["Master TypeScript generics", "Build a production-grade full-stack project"]
    }
  ]
}`;

      const text = await callGeminiWithTimeout(model, prompt);
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn('[AI Service] Career recommendations fallback:', err.message);
    }
  }

  return {
    recommendations: [
      {
        roleTitle: 'Full Stack Web Developer (MERN)',
        matchPercentage: 88,
        whyRelevant: `Your core proficiency in ${skills.slice(0, 3).join(', ')} directly aligns with MERN stack requirements across SaaS and tech startups.`,
        keySkillsNeeded: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
        growthOutlook: 'Strong hiring demand across Bengaluru, Hyderabad, and Pune tech hubs with salaries typically ₹6–14 LPA.',
        recommendedNextSteps: [
          'Add TypeScript to your React & Node.js codebases',
          'Deploy full-stack projects on cloud platforms with CI/CD'
        ]
      },
      {
        roleTitle: 'Frontend Engineer (React)',
        matchPercentage: 84,
        whyRelevant: 'Strong grasp of component hierarchy, state management, responsive styling, and modern JavaScript.',
        keySkillsNeeded: ['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'Redux / Zustand', 'Jest'],
        growthOutlook: 'High volume of positions across product firms in Hyderabad and Bengaluru.',
        recommendedNextSteps: [
          'Practice writing component unit tests with React Testing Library',
          'Optimize web bundle sizes and Core Web Vitals performance'
        ]
      },
      {
        roleTitle: 'Backend API Developer (Node.js)',
        matchPercentage: 78,
        whyRelevant: 'Capable of designing RESTful endpoints, database schemas, and microservice business logic.',
        keySkillsNeeded: ['Node.js', 'Express', 'MongoDB / PostgreSQL', 'Docker', 'Redis'],
        growthOutlook: 'Steady demand for backend engineers building high-throughput microservices.',
        recommendedNextSteps: [
          'Implement Redis caching and database indexing optimizations',
          'Learn basic Docker containerization for local development'
        ]
      }
    ]
  };
}

// ----------------------------------------------------
// 5. INTERVIEW PREPARATION GENERATOR
// ----------------------------------------------------
async function generateInterviewQuestions({ jobTitle = 'Software Engineer', skills = ['JavaScript', 'React'], experienceLevel = 'Entry Level', companyName = 'TechNova Solutions' }) {
  const model = getGeminiModel();

  if (model) {
    try {
      const prompt = `You are a technical interviewer for "${jobTitle}" at ${companyName}.
Generate 5 realistic interview preparation questions covering Technical, Behavioral, HR, and System Design with suggested answers.
Return ONLY valid JSON array:
[
  {
    "id": "q1",
    "category": "Technical",
    "difficulty": "Intermediate",
    "question": "Question text...",
    "suggestedAnswer": "Clear, professional answer covering key concepts...",
    "keyConcepts": ["Concept 1", "Concept 2"],
    "followUpQuestions": ["Follow up 1?", "Follow up 2?"]
  }
]`;

      const text = await callGeminiWithTimeout(model, prompt);
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn('[AI Service] Interview generator fallback:', err.message);
    }
  }

  return [
    {
      id: 'q1',
      category: 'Technical',
      difficulty: 'Intermediate',
      question: `How does component state management work in React, and when would you choose Context API over local state or external libraries?`,
      suggestedAnswer: `State in React holds dynamic data that determines component rendering. For local UI state, useState or useReducer is preferred. When data needs to be accessed by many deeply nested components (such as auth status or theme), React Context avoids prop drilling. Custom hooks allow encapsulating stateful logic and reusing it cleanly across components.`,
      keyConcepts: ['State Management', 'Prop Drilling', 'Context API', 'Custom Hooks'],
      followUpQuestions: [
        'How do you prevent unnecessary re-renders when using Context?',
        'When is useReducer more suitable than useState?'
      ]
    },
    {
      id: 'q2',
      category: 'Technical',
      difficulty: 'Intermediate',
      question: `How does the Node.js event loop handle asynchronous I/O operations without blocking the main execution thread?`,
      suggestedAnswer: `Node.js uses libuv to handle I/O asynchronously. When an async operation like a database query or network request is made, Node delegates the task to background system threads. When the operation completes, its callback is placed on an event queue. The event loop processes microtasks (promises) and macrotasks (timers, I/O callbacks) in order without blocking the main thread.`,
      keyConcepts: ['Event Loop', 'Non-blocking I/O', 'Libuv', 'Task Queues'],
      followUpQuestions: [
        'What is the difference between process.nextTick and setImmediate?',
        'How do you handle CPU-intensive tasks in Node.js?'
      ]
    },
    {
      id: 'q3',
      category: 'Behavioral',
      difficulty: 'Intermediate',
      question: `Tell me about a technical bug or challenging requirement you worked on during a project. How did you resolve it?`,
      suggestedAnswer: `Use the STAR method: describe the Situation, Task, Action taken, and Result achieved. Mention the debugging steps you followed (logging, inspecting network requests, isolating variables) and what you learned to avoid similar issues in the future.`,
      keyConcepts: ['STAR Method', 'Root Cause Analysis', 'Troubleshooting'],
      followUpQuestions: [
        'How did you verify that the fix did not introduce regressions?',
        'What would you do differently if you faced a similar issue again?'
      ]
    },
    {
      id: 'q4',
      category: 'System Design',
      difficulty: 'Intermediate',
      question: `How would you structure a RESTful API for an employment platform with candidates, jobs, and applications?`,
      suggestedAnswer: `Structure endpoints around resources using standard HTTP verbs: GET /jobs, POST /jobs, POST /applications, GET /applications/my. Use JWT tokens for authentication, validate request payloads, ensure appropriate database indexing on foreign keys (like jobId and candidateId), and use pagination for list endpoints.`,
      keyConcepts: ['REST Architecture', 'Resource Design', 'JWT Authentication', 'Database Indexing'],
      followUpQuestions: [
        'How would you prevent a candidate from submitting duplicate applications?',
        'How would you handle rate limiting on public search endpoints?'
      ]
    },
    {
      id: 'q5',
      category: 'HR',
      difficulty: 'Beginner',
      question: `Why are you interested in joining ${companyName} as a ${jobTitle}?`,
      suggestedAnswer: `Connect your current technical background and project experience with the company's domain. Mention your goal to write clean code, learn from senior team members, and contribute meaningfully to the product.`,
      keyConcepts: ['Role Fit', 'Career Goals', 'Team Collaboration'],
      followUpQuestions: [
        'What work environment allows you to do your best work?',
        'How do you approach learning new tools or libraries?'
      ]
    }
  ];
}

// ----------------------------------------------------
// 6. INTERVIEW ANSWER EVALUATOR
// ----------------------------------------------------
async function evaluateInterviewAnswer({ question, answer, jobTitle = 'Software Engineer' }) {
  const model = getGeminiModel();
  if (model && answer && answer.trim().length > 10) {
    try {
      const prompt = `You are a technical interviewer evaluating an answer for "${jobTitle}".
Question: "${question}"
Candidate Answer: "${answer}"

Return ONLY valid JSON:
{
  "score": 80,
  "strengths": ["Clear explanation of core concepts", "Direct answer to the prompt"],
  "weaknesses": ["Could mention trade-offs", "Could give a concrete code example"],
  "feedback": "Constructive evaluation summary...",
  "suggestedRefinement": "A concise, structured version of how to answer this question effectively."
}`;

      const text = await callGeminiWithTimeout(model, prompt);
      return cleanAndParseJSON(text);
    } catch (err) {
      console.warn('[AI Service] Answer evaluator fallback:', err.message);
    }
  }

  const wordCount = (answer || '').trim().split(/\s+/).length;
  let score = 75;
  if (wordCount > 40) score = 85;
  else if (wordCount < 15) score = 65;

  return {
    score,
    strengths: [
      'Directly addresses the primary question topic',
      'Demonstrates understanding of standard development concepts'
    ],
    weaknesses: [
      'Could include a brief real-world example or trade-off',
      'Could touch on performance or error-handling considerations'
    ],
    feedback: 'Good baseline response that covers the main requirements. You can make it stronger by briefly outlining why you chose a particular approach or mentioning edge cases.',
    suggestedRefinement: 'Structure your answer with: 1) A clear definition, 2) A practical use case, and 3) A trade-off or alternative you considered.'
  };
}

// ----------------------------------------------------
// 7. CONTEXTUAL CAREER ASSISTANT CHAT
// ----------------------------------------------------
async function careerAssistantChat({ message, history = [], userProfile = {}, jobContext = null }) {
  const model = getGeminiModel();
  const userName = userProfile?.name || 'Candidate';
  const userSkills = (userProfile?.profile?.skills || userProfile?.skills || []).join(', ') || 'React, Node.js, JavaScript, MongoDB';

  if (model) {
    try {
      const systemInstruction = `You are a professional career advisor at SkillBridge AI in India.
Candidate: ${userName}
Current skills: ${userSkills}
${jobContext ? `Context Job: ${jobContext.title} at ${jobContext.companyName}` : ''}

Provide helpful, grounded, actionable advice. Use clear bullet points and simple markdown formatting. Keep the tone human, direct, and constructive. Avoid exaggerated claims.`;

      const prompt = `${systemInstruction}\n\nUser Question: ${message}`;
      const text = await callGeminiWithTimeout(model, prompt);
      return text;
    } catch (err) {
      console.warn('[AI Service] Career assistant fallback:', err.message);
    }
  }

  const lower = message.toLowerCase();

  if (lower.includes('resume') || lower.includes('cv') || lower.includes('ats')) {
    return `### Suggestions for optimizing your resume:

Based on your current stack (**${userSkills}**), here are 3 practical recommendations:

1. **Focus on specific impact in bullet points**:
   - Instead of *"Built backend APIs"*, write: *"Implemented 8 REST endpoints in Node.js and Express to handle authentication and profile data."*
2. **Organize skills cleanly**:
   - Group into **Languages** (JavaScript, Python), **Frontend** (React, Tailwind CSS), **Backend** (Node.js, Express), and **Databases & Tools** (MongoDB, Git).
3. **Include accessible links**:
   - Provide working GitHub repository links and live URLs for all featured projects.`;
  }

  if (lower.includes('project') || lower.includes('build')) {
    return `### Recommended project ideas for your profile:

For roles requiring **${userSkills}**:

1. **Job Application & Interview Tracker**:
   - **Stack**: React, Node.js, Express, MongoDB.
   - **Key Features**: CRUD operations, filtering by status, authentication with JWT, and responsive UI.
2. **Real-time Task & Notes Board**:
   - **Stack**: React, Node.js, Socket.io / polling, Tailwind CSS.
   - **Key Features**: Drag-and-drop status columns, optimistic updates, and clean component structure.
3. **API Monitoring Tool**:
   - **Stack**: Node.js, Express, Chart.js, SQLite or MongoDB.
   - **Key Features**: Periodic endpoint health checks, response latency tracking, and status alerts.`;
  }

  if (lower.includes('skill') || lower.includes('learn')) {
    return `### Recommended skills to prioritize next:

Looking at current software engineering job postings in India:

1. **TypeScript (Priority: High)**:
   - Adding TypeScript to React and Node.js projects ensures type safety and matches mid-level hiring requirements.
2. **Automated Unit Testing (Priority: Medium)**:
   - Learn **Jest** or **Vitest** for testing components and API route logic.
3. **Docker Basics (Priority: Medium)**:
   - Practice writing a \`Dockerfile\` and running your app in a local container.`;
  }

  return `Hello **${userName}**. I'm here to help with your career questions and job search.

Here are some topics we can explore:
- **Resume Reviews**: Ask *"How can I improve my project bullet points?"*
- **Skill Roadmaps**: Ask *"What should I learn after React and Node.js?"*
- **Interview Preparation**: Ask *"What technical questions should I expect for a Full Stack role?"*
- **Portfolio Projects**: Ask *"What full stack projects are good to build?"*

What would you like to discuss?`;
}

module.exports = {
  analyzeResume,
  generateJobDescription,
  generateSkillGapRoadmap,
  getCareerRecommendations,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  careerAssistantChat,
};
