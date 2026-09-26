/**
 * SkillBridge AI — Smart Matching Engine
 * 
 * Deterministic, multi-factor compatibility evaluation service:
 * 1. Skill Matching (Strict Canonical Normalization, Required vs Preferred Weighting, Partial/Synonym Mapping)
 * 2. Experience Fit (Years, Role Level, Fresh Graduate friendliness)
 * 3. Education Alignment (Degree & Field normalization without artificial constraints)
 * 4. Project Relevance (Supporting practical evidence boost)
 * 5. Location & Workplace Preference Fit (Remote, Hub match, Mismatch without auto-rejecting)
 * 6. Role Relevance & Preference
 * 7. Transparent Natural Language Explanations & Actionable Skill Gap Roadmaps
 * 
 * NOTE: The result is strictly an "AI compatibility estimate", not a hiring probability or selection guarantee.
 */

// ----------------------------------------------------
// 1. CANONICAL TECHNOLOGY TAXONOMY & NORMALIZATION
// ----------------------------------------------------

/**
 * Maps technology names and variants to their canonical normalized keys.
 * Crucially preserves distinctions (e.g. Java != JavaScript, Python != PyTorch, React != React Native).
 */
const CANONICAL_MAP = {
  // JavaScript & Variants
  'javascript': 'javascript',
  'js': 'javascript',
  'ecmascript': 'javascript',
  'es6': 'javascript',
  'es2020': 'javascript',
  'vanilla js': 'javascript',
  'vanillajs': 'javascript',

  // TypeScript
  'typescript': 'typescript',
  'ts': 'typescript',
  'typed javascript': 'typescript',

  // React & Variants (Distinct from React Native!)
  'react': 'react',
  'react.js': 'react',
  'reactjs': 'react',
  'react js': 'react',

  // React Native (Mobile - distinct from React web)
  'react native': 'react native',
  'react-native': 'react native',
  'reactnative': 'react native',

  // Node.js
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'node js': 'nodejs',
  'node': 'nodejs',

  // Express
  'express': 'express',
  'express.js': 'express',
  'expressjs': 'express',
  'express js': 'express',

  // Databases
  'mongodb': 'mongodb',
  'mongo': 'mongodb',
  'mongoose': 'mongodb',
  'postgresql': 'postgresql',
  'postgres': 'postgresql',
  'psql': 'postgresql',
  'mysql': 'mysql',
  'my sql': 'mysql',
  'redis': 'redis',
  'sqlite': 'sqlite',

  // Next.js
  'next.js': 'nextjs',
  'nextjs': 'nextjs',
  'next js': 'nextjs',

  // Vue & Angular
  'vue': 'vue',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'angular': 'angular',
  'angularjs': 'angular',

  // HTML & CSS
  'html': 'html',
  'html5': 'html',
  'css': 'css',
  'css3': 'css',
  'tailwind': 'tailwindcss',
  'tailwind css': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
  'bootstrap': 'bootstrap',
  'sass': 'sass',
  'scss': 'sass',

  // State Management
  'redux': 'redux',
  'redux toolkit': 'redux',
  'rtk': 'redux',
  'zustand': 'zustand',

  // Version Control & DevOps
  'git': 'git',
  'github': 'git',
  'gitlab': 'git',
  'version control': 'git',
  'docker': 'docker',
  'docker compose': 'docker',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'ci/cd': 'cicd',
  'cicd': 'cicd',
  'github actions': 'cicd',

  // Cloud
  'aws': 'aws',
  'amazon web services': 'aws',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'azure': 'azure',
  'microsoft azure': 'azure',

  // APIs & Networking
  'rest': 'rest api',
  'rest api': 'rest api',
  'rest apis': 'rest api',
  'restful api': 'rest api',
  'restful apis': 'rest api',
  'graphql': 'graphql',
  'gql': 'graphql',

  // Testing
  'jest': 'jest',
  'vitest': 'vitest',
  'cypress': 'cypress',
  'playwright': 'playwright',
  'unit testing': 'testing',
  'automated testing': 'testing',
  'testing': 'testing',

  // Distinct programming languages
  'python': 'python',
  'python3': 'python',
  'java': 'java',
  'core java': 'java',
  'cpp': 'cpp',
  'c++': 'cpp',
  'c#': 'csharp',
  'csharp': 'csharp',
  'golang': 'go',
  'go': 'go',

  // AI & ML (PyTorch is distinct from Python!)
  'pytorch': 'pytorch',
  'torch': 'pytorch',
  'tensorflow': 'tensorflow',
  'keras': 'keras',
  'machine learning': 'machine learning',
  'ml': 'machine learning',
  'deep learning': 'deep learning',
  'nlp': 'nlp',
  'generative ai': 'generative ai',
  'genai': 'generative ai',
  'llm': 'llm',
  'scikit-learn': 'scikit-learn',
  'pandas': 'pandas',
  'numpy': 'numpy',
};

/**
 * Related category clusters for calculating partial / related competency overlap.
 * (e.g., if a candidate has MongoDB and the job prefers PostgreSQL, they have related database competency).
 */
const RELATED_CLUSTERS = {
  'frontend_frameworks': ['react', 'vue', 'angular', 'nextjs'],
  'backend_runtimes': ['nodejs', 'express', 'python', 'java', 'go', 'csharp'],
  'relational_databases': ['postgresql', 'mysql', 'sqlite'],
  'nosql_databases': ['mongodb', 'redis'],
  'styling': ['tailwindcss', 'bootstrap', 'sass', 'css'],
  'cloud_providers': ['aws', 'gcp', 'azure'],
  'containers_orchestration': ['docker', 'kubernetes'],
  'testing_tools': ['jest', 'vitest', 'cypress', 'playwright', 'testing'],
  'api_paradigms': ['rest api', 'graphql'],
  'ml_frameworks': ['pytorch', 'tensorflow', 'keras', 'scikit-learn'],
};

/**
 * Curated knowledge base for actionable skill gap learning plans.
 */
const SKILL_LEARNING_GUIDES = {
  'typescript': {
    why: 'Used extensively in production codebases for compile-time type safety and reliable component contracts.',
    learn: 'Types, interfaces, generics, union types, and TypeScript integration with React and Node.js.',
    suggestedProject: 'Refactor an existing JavaScript project to TypeScript or build a typed React dashboard.'
  },
  'docker': {
    why: 'Essential for creating consistent development environments and containerized cloud deployments.',
    learn: 'Dockerfile syntax, multi-stage builds, container lifecycle, networking, and docker-compose orchestration.',
    suggestedProject: 'Containerize a full-stack web application with frontend, API server, and MongoDB.'
  },
  'testing': {
    why: 'Automated tests ensure feature reliability and prevent regressions during continuous deployment.',
    learn: 'Unit testing, component rendering tests with React Testing Library, and API integration testing with Jest.',
    suggestedProject: 'Write unit and integration tests achieving 80%+ coverage for core business logic.'
  },
  'jest': {
    why: 'Industry standard JavaScript testing framework for fast unit and snapshot testing.',
    learn: 'Test runners, matchers, mocking functions/modules, and asynchronous test assertions.',
    suggestedProject: 'Build a comprehensive test suite for authentication and validation utility functions.'
  },
  'kubernetes': {
    why: 'Leading container orchestration platform for automated scaling and resilient production infrastructure.',
    learn: 'Pods, Deployments, Services, ConfigMaps, Ingress controllers, and Helm charts.',
    suggestedProject: 'Deploy a multi-service containerized application to a local Minikube cluster.'
  },
  'aws': {
    why: 'Major cloud service provider hosting scalable enterprise web applications.',
    learn: 'Core services including EC2 compute, S3 storage, IAM security policies, and RDS managed databases.',
    suggestedProject: 'Deploy a full-stack application using S3 for static assets and an EC2/ECS containerized backend.'
  },
  'nextjs': {
    why: 'Modern React framework enabling server-side rendering (SSR) and search engine optimization (SEO).',
    learn: 'App Router, React Server Components, Server Actions, Dynamic Routing, and Image Optimization.',
    suggestedProject: 'Build an SEO-optimized blog or e-commerce storefront with server-side rendered pages.'
  },
  'graphql': {
    why: 'Declarative API query language allowing clients to request exact fields, reducing over-fetching.',
    learn: 'GraphQL schemas, type definitions, resolvers, mutations, and Apollo Client integration.',
    suggestedProject: 'Build a GraphQL API for a content platform with nested author and comments relations.'
  },
  'redis': {
    why: 'High-speed in-memory key-value cache used for session storage, caching, and rate limiting.',
    learn: 'In-memory data structures, TTL expiration, cache-aside pattern, and pub/sub messaging.',
    suggestedProject: 'Implement a Redis caching layer for heavy database queries to reduce API latency.'
  },
  'postgresql': {
    why: 'Powerful open-source relational database with ACID transactions and advanced indexing.',
    learn: 'Relational data modeling, SQL queries, joins, indexes, foreign keys, and ORM usage (Prisma/TypeORM).',
    suggestedProject: 'Design a normalized e-commerce database schema with transactional order handling.'
  },
  'tailwindcss': {
    why: 'Utility-first CSS framework enabling rapid, consistent, and responsive UI construction.',
    learn: 'Utility class workflows, responsive breakpoints, flexbox/grid utilities, and dark mode configuration.',
    suggestedProject: 'Build a fully responsive multi-page marketing landing page with interactive components.'
  },
  'react native': {
    why: 'Cross-platform mobile framework using React paradigms for iOS and Android apps.',
    learn: 'Native components, Flexbox layouts, React Navigation, device APIs, and Expo toolchain.',
    suggestedProject: 'Build a cross-platform mobile task or fitness tracking application using Expo.'
  },
  'pytorch': {
    why: 'Leading deep learning framework for artificial intelligence and neural network research.',
    learn: 'Tensors, autograd, torch.nn layers, custom datasets, and training/validation loops.',
    suggestedProject: 'Train a convolutional neural network for image classification or fine-tune an NLP model.'
  }
};

/**
 * Clean and normalize a skill string
 */
function cleanSkillString(skill) {
  if (!skill || typeof skill !== 'string') return '';
  return skill
    .toLowerCase()
    .trim()
    .replace(/[._\-\/]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Convert any skill string to its canonical key if recognized
 */
function getCanonicalSkill(skill) {
  const cleaned = cleanSkillString(skill);
  if (!cleaned) return '';

  // Direct lookup
  if (CANONICAL_MAP[cleaned]) {
    return CANONICAL_MAP[cleaned];
  }

  // Check without spaces
  const noSpace = cleaned.replace(/\s+/g, '');
  if (CANONICAL_MAP[noSpace]) {
    return CANONICAL_MAP[noSpace];
  }

  return cleaned;
}

// ----------------------------------------------------
// 2. SKILL MATCHING ENGINE
// ----------------------------------------------------

/**
 * Evaluates Candidate Skills against Job Required & Preferred Skills
 */
function evaluateSkillMatch(candidateSkills = [], requiredSkills = [], preferredSkills = []) {
  const normCandidateSkills = (candidateSkills || [])
    .map(s => ({ original: s, canonical: getCanonicalSkill(s), cleaned: cleanSkillString(s) }))
    .filter(s => Boolean(s.cleaned));

  const candidateCanonicals = new Set(normCandidateSkills.map(s => s.canonical));
  const candidateCleaned = new Set(normCandidateSkills.map(s => s.cleaned));

  const matched = [];
  const partial = [];
  const missing = [];

  const matchedPreferred = [];
  const missingPreferred = [];

  // 1. Evaluate Required Skills
  for (const req of (requiredSkills || [])) {
    if (!req || typeof req !== 'string') continue;
    const reqCleaned = cleanSkillString(req);
    const reqCanonical = getCanonicalSkill(req);

    // Direct Exact Canonical Match
    if (candidateCanonicals.has(reqCanonical) || candidateCleaned.has(reqCleaned)) {
      matched.push(req);
      continue;
    }

    // Descriptive Match for generic suffixes (e.g. "REST" vs "REST APIs" or "GraphQL" vs "GraphQL API")
    // Explicitly guards against distinct canonical mismatches (React != React Native, Python != PyTorch, Java != JavaScript)
    const isDescriptiveMatch = normCandidateSkills.some(cs => {
      // Distinct canonical guard
      if (cs.canonical === 'react' && reqCanonical === 'react native') return false;
      if (cs.canonical === 'react native' && reqCanonical === 'react') return false;
      if (cs.canonical === 'java' && reqCanonical === 'javascript') return false;
      if (cs.canonical === 'javascript' && reqCanonical === 'java') return false;
      if (cs.canonical === 'python' && reqCanonical === 'pytorch') return false;
      if (cs.canonical === 'pytorch' && reqCanonical === 'python') return false;
      if (cs.canonical === 'cpp' && (reqCanonical === 'csharp' || reqCanonical === 'c')) return false;

      const genericWords = new Set(['developer', 'engineer', 'api', 'apis', 'framework', 'programming', 'language', 'tools', 'tooling']);
      const reqWords = reqCleaned.split(' ').filter(w => !genericWords.has(w));
      const csWords = cs.cleaned.split(' ').filter(w => !genericWords.has(w));

      return (
        reqWords.length > 0 &&
        csWords.length > 0 &&
        reqWords.join(' ') === csWords.join(' ')
      );
    });

    if (isDescriptiveMatch) {
      matched.push(req);
      continue;
    }


    // Related Category Match (Partial credit)
    let foundPartial = false;
    for (const cluster of Object.values(RELATED_CLUSTERS)) {
      if (cluster.includes(reqCanonical)) {
        const hasClusterSkill = normCandidateSkills.some(cs => cluster.includes(cs.canonical));
        if (hasClusterSkill) {
          partial.push(req);
          foundPartial = true;
          break;
        }
      }
    }

    if (!foundPartial) {
      missing.push(req);
    }
  }

  // 2. Evaluate Preferred Skills (Bonus, not heavily penalized)
  for (const pref of (preferredSkills || [])) {
    if (!pref || typeof pref !== 'string') continue;
    const prefCleaned = cleanSkillString(pref);
    const prefCanonical = getCanonicalSkill(pref);

    if (candidateCanonicals.has(prefCanonical) || candidateCleaned.has(prefCleaned)) {
      matchedPreferred.push(pref);
    } else {
      missingPreferred.push(pref);
    }
  }

  // 3. Compute Deterministic Skill Compatibility Score
  const totalRequired = requiredSkills.length;
  let requiredRatio = 1.0;
  if (totalRequired > 0) {
    requiredRatio = (matched.length * 1.0 + partial.length * 0.55) / totalRequired;
  }

  // Required skills make up baseline (up to 90 points)
  let skillScore = Math.round(requiredRatio * 90);

  // Preferred skills bonus (up to 10 bonus points)
  if (preferredSkills.length > 0) {
    const prefRatio = matchedPreferred.length / preferredSkills.length;
    skillScore += Math.round(prefRatio * 10);
  } else {
    // If no preferred skills specified, scale required ratio to 100
    skillScore = Math.round(requiredRatio * 100);
  }

  skillScore = Math.max(20, Math.min(100, skillScore));


  return {
    matched,
    partial,
    missing,
    matchedPreferred,
    missingPreferred,
    score: skillScore,
  };
}

// ----------------------------------------------------
// 3. EXPERIENCE MATCHING ENGINE
// ----------------------------------------------------

/**
 * Calculates candidate's total years of experience across profile entries
 */
function calculateCandidateExperienceYears(user) {
  const experiences = user?.profile?.experience || user?.experience || [];
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return 0;
  }

  let totalYears = 0;
  for (const exp of experiences) {
    if (typeof exp.years === 'number') {
      totalYears += exp.years;
    } else if (exp.duration) {
      const durationStr = String(exp.duration).toLowerCase();
      // Match patterns like "2 years", "1.5 yrs", "6 months"
      const yearMatch = durationStr.match(/(\d+(\.\d+)?)\s*(yr|year)/i);
      const monthMatch = durationStr.match(/(\d+)\s*(mo|month)/i);
      if (yearMatch) {
        totalYears += parseFloat(yearMatch[1]);
      } else if (monthMatch) {
        totalYears += parseInt(monthMatch[1], 10) / 12;
      } else {
        totalYears += 1.0; // Default estimate per experience entry
      }
    } else {
      totalYears += 1.0;
    }
  }

  return Math.round(totalYears * 10) / 10;
}

/**
 * Evaluates Candidate Experience against Job Requirement
 */
function evaluateExperienceMatch(candidateYears, jobExperience) {
  const minYears = jobExperience?.minYears !== undefined ? jobExperience.minYears : 0;
  const maxYears = jobExperience?.maxYears !== undefined ? jobExperience.maxYears : (minYears + 2);
  const expLevel = (jobExperience?.level || '').toLowerCase();

  const isFreshGradJob = minYears === 0 || expLevel.includes('entry') || expLevel.includes('intern') || expLevel.includes('graduate');
  const requiredRangeText = minYears === 0 && maxYears <= 2 
    ? '0–2 years (Entry Level / Fresh Graduate)'
    : `${minYears}–${maxYears} years`;

  // 1. Fresh Graduate / Zero-to-Entry Level Case
  if (isFreshGradJob && candidateYears <= 2) {
    return {
      status: 'Suitable',
      candidateYears,
      requiredYears: requiredRangeText,
      score: 95,
      explanation: 'Role is designed for early-career candidates and fresh graduates. Your background is well-suited.'
    };
  }

  // 2. Candidate meets or exceeds minimum requirement
  if (candidateYears >= minYears) {
    const exceeds = candidateYears > maxYears;
    return {
      status: exceeds ? 'Exceeds requirement' : 'Meets requirement',
      candidateYears,
      requiredYears: requiredRangeText,
      score: exceeds ? 98 : 92,
      explanation: `${candidateYears} year(s) of practical experience satisfies the requested ${requiredRangeText} threshold.`
    };
  }

  // 3. Candidate is close (within 1 year)
  if (candidateYears >= Math.max(0, minYears - 1)) {
    return {
      status: 'Close to requirement',
      candidateYears,
      requiredYears: requiredRangeText,
      score: 75,
      explanation: `Candidate has ${candidateYears} year(s) vs ${minYears}+ years requested. Hands-on projects and core skills demonstrate strong potential.`
    };
  }

  // 4. Candidate is below requirement (Do NOT auto-reject)
  return {
    status: 'Below requirement',
    candidateYears,
    requiredYears: requiredRangeText,
    score: 55,
    explanation: `Position prefers ${minYears}+ years of formal industry experience. Portfolio projects and certifications serve as supporting evidence.`
  };
}

// ----------------------------------------------------
// 4. EDUCATION MATCHING ENGINE
// ----------------------------------------------------

/**
 * Normalizes degree & field information and evaluates fit
 */
function evaluateEducationMatch(user, jobEducation) {
  const educationList = user?.profile?.education || user?.education || [];
  const reqEdu = (jobEducation || '').toLowerCase();

  // If job doesn't specify rigid education requirement
  if (!reqEdu || reqEdu.includes('any') || reqEdu.includes('open') || reqEdu.includes('equivalent')) {
    return {
      status: 'Matches',
      candidateDegree: educationList[0]?.degree || 'Graduate / Diploma',
      requiredEducation: jobEducation || 'Standard degree or equivalent experience',
      score: 90,
      explanation: 'Educational background aligns with the open qualification requirements.'
    };
  }

  if (educationList.length === 0) {
    return {
      status: 'Not specified in profile',
      candidateDegree: 'Not provided',
      requiredEducation: jobEducation,
      score: 70,
      explanation: 'Education details not explicitly listed in profile. Evaluated on skills and portfolio.'
    };
  }

  const primaryEdu = educationList[0];
  const degreeStr = (primaryEdu.degree || '').toLowerCase();
  const fieldStr = (primaryEdu.field || primaryEdu.degree || '').toLowerCase();

  const isTechDegree = 
    degreeStr.includes('b.tech') || 
    degreeStr.includes('b.e') || 
    degreeStr.includes('computer') || 
    degreeStr.includes('bca') || 
    degreeStr.includes('mca') || 
    degreeStr.includes('b.sc') || 
    degreeStr.includes('m.tech') ||
    degreeStr.includes('engineering') ||
    fieldStr.includes('computer') ||
    fieldStr.includes('information technology') ||
    fieldStr.includes('software');

  if (isTechDegree) {
    return {
      status: 'Matches',
      candidateDegree: `${primaryEdu.degree || 'B.Tech / B.E.'}${primaryEdu.institution ? ` (${primaryEdu.institution})` : ''}`,
      requiredEducation: jobEducation,
      score: 95,
      explanation: `${primaryEdu.degree || 'Degree in Computer Science / Engineering'} fulfills the educational criteria.`
    };
  }

  return {
    status: 'Partially matches',
    candidateDegree: primaryEdu.degree || 'Graduate',
    requiredEducation: jobEducation,
    score: 80,
    explanation: `${primaryEdu.degree || 'Degree'} demonstrates academic foundation. Practical projects validate technical skills.`
  };
}

// ----------------------------------------------------
// 5. PROJECT RELEVANCE ENGINE
// ----------------------------------------------------

/**
 * Checks candidate projects against job skills and title to provide supporting evidence
 */
function evaluateProjectRelevance(user, job) {
  const projects = user?.profile?.projects || user?.projects || [];
  if (!Array.isArray(projects) || projects.length === 0) {
    return {
      hasRelevantProjects: false,
      score: 75,
      relevantProjects: [],
      explanation: 'Add technical projects to your profile to showcase hands-on implementation evidence.'
    };
  }


  const jobSkills = (job?.skills || []).map(getCanonicalSkill);
  const jobTitleWords = cleanSkillString(job?.title || '').split(' ').filter(w => w.length > 2);

  const matchedProjects = [];

  for (const proj of projects) {
    const projTechs = (proj.technologies || []).map(getCanonicalSkill);
    const projTitle = cleanSkillString(proj.title || '');
    const projDesc = cleanSkillString(proj.description || '');

    const matchingTech = (proj.technologies || []).filter(t => jobSkills.includes(getCanonicalSkill(t)));
    const titleRelevance = jobTitleWords.some(w => projTitle.includes(w) || projDesc.includes(w));

    if (matchingTech.length > 0 || titleRelevance) {
      matchedProjects.push({
        title: proj.title || 'Portfolio Project',
        matchingTechnologies: matchingTech,
        description: proj.description || '',
      });
    }
  }

  if (matchedProjects.length > 0) {
    return {
      hasRelevantProjects: true,
      score: 95,
      relevantProjects: matchedProjects,
      explanation: `Relevant project experience demonstrated through ${matchedProjects.length} portfolio project(s) applying ${matchedProjects[0].matchingTechnologies.slice(0, 3).join(', ') || 'core technologies'}.`
    };
  }

  return {
    hasRelevantProjects: false,
    score: 75,
    relevantProjects: [],
    explanation: 'Candidate has published projects, though technologies differ from this specific stack.'
  };
}

// ----------------------------------------------------
// 6. LOCATION & WORKPLACE MATCHING
// ----------------------------------------------------

/**
 * Evaluates candidate location and work preference vs job location
 */
function evaluateLocationMatch(user, job) {
  const candidateLocation = cleanSkillString(user?.profile?.location || user?.location || '');
  const candidatePreferredLocs = (user?.profile?.preferredLocations || []).map(cleanSkillString);
  const candidateWorkPref = cleanSkillString(user?.profile?.workPreference || user?.profile?.workplacePreference || '');

  const jobLocation = cleanSkillString(job?.location || '');
  const jobWorkplace = (job?.workplaceType || 'Hybrid');

  // 1. Remote Job Match
  if (jobWorkplace.toLowerCase() === 'remote' || jobLocation.includes('remote')) {
    return {
      status: 'Strong match (Remote)',
      candidateLocation: user?.profile?.location || 'Remote open',
      jobLocation: 'Remote',
      score: 100,
      explanation: 'Remote role — fully accessible regardless of geographical location.'
    };
  }

  // 2. Candidate prefers Remote and job is Remote
  if (candidateWorkPref.includes('remote') && jobWorkplace.toLowerCase() === 'remote') {
    return {
      status: 'Strong match (Remote)',
      candidateLocation: user?.profile?.location || 'Remote',
      jobLocation: job.location,
      score: 100,
      explanation: 'Matches candidate remote work preference perfectly.'
    };
  }

  // 3. Location Match (City matches candidate city or preferred locations)
  const isCityMatch = 
    (candidateLocation && (jobLocation.includes(candidateLocation) || candidateLocation.includes(jobLocation))) ||
    candidatePreferredLocs.some(loc => loc && (jobLocation.includes(loc) || loc.includes(jobLocation)));

  if (isCityMatch) {
    return {
      status: 'Location preference match',
      candidateLocation: user?.profile?.location || 'Local',
      jobLocation: job.location,
      score: 95,
      explanation: `Job location (${job.location}) directly matches candidate location preferences.`
    };
  }

  // 4. Location Mismatch (Does NOT auto-reject)
  return {
    status: 'Location mismatch',
    candidateLocation: user?.profile?.location || 'Different city',
    jobLocation: job.location,
    score: 65,
    explanation: `Position is based in ${job.location} (${jobWorkplace}). Relocation or hybrid commute required.`
  };
}

// ----------------------------------------------------
// 7. ROLE RELEVANCE MATCHING
// ----------------------------------------------------

/**
 * Evaluates target role preferences vs job title
 */
function evaluateRoleMatch(user, job) {
  const preferredRoles = (user?.profile?.preferredJobRoles || user?.profile?.preferredRoles || []).map(cleanSkillString);
  const jobTitleCleaned = cleanSkillString(job?.title || '');

  if (preferredRoles.length === 0) {
    return {
      status: 'Open to role',
      explanation: `Candidate profile is open to technical roles including ${job.title}.`
    };
  }

  const isDirectRoleMatch = preferredRoles.some(r => r && (jobTitleCleaned.includes(r) || r.includes(jobTitleCleaned)));
  if (isDirectRoleMatch) {
    return {
      status: 'Matches target role',
      explanation: `Directly matches candidate preferred career role (${job.title}).`
    };
  }

  return {
    status: 'Related technical field',
    explanation: `Related to candidate target preferences (${preferredRoles.slice(0, 2).join(', ')}).`
  };
}

// ----------------------------------------------------
// 8. ACTIONABLE RECOMMENDATIONS & EXPLANATION BUILDER
// ----------------------------------------------------

/**
 * Builds structured, actionable learning recommendations for missing and partial skills
 */
function buildSkillGapRecommendations(missingSkills = [], partialSkills = []) {
  const recommendations = [];
  const skillsToAddress = [...missingSkills, ...partialSkills].slice(0, 4);

  for (const skill of skillsToAddress) {
    const canonical = getCanonicalSkill(skill);
    const guide = SKILL_LEARNING_GUIDES[canonical];

    if (guide) {
      recommendations.push({
        skill,
        why: guide.why,
        learn: guide.learn,
        suggestedProject: guide.suggestedProject
      });
    } else {
      recommendations.push({
        skill,
        why: `Core competency requested for this position.`,
        learn: `Official documentation, architecture patterns, and standard implementation practices for ${skill}.`,
        suggestedProject: `Build a proof-of-concept project integrating ${skill} into a full-stack workflow.`
      });
    }
  }

  return recommendations;
}

/**
 * Generates clear, human, explainable rationale for the compatibility score
 */
function buildNaturalLanguageExplanation(overallScore, matchedSkills, missingSkills, partialSkills, jobTitle) {
  const matchedStr = matchedSkills.slice(0, 3).join(', ');
  const missingStr = missingSkills.slice(0, 2).join(' and ');

  if (overallScore >= 85) {
    if (missingSkills.length === 0) {
      return `Your profile aligns exceptionally well with this role. You possess verified experience across all core technical requirements (${matchedStr}).`;
    }
    return `Your profile aligns well with this role because you have experience with ${matchedStr}. Your main skill gap to review is ${missingStr || 'supplementary tooling'}.`;
  }

  if (overallScore >= 70) {
    if (matchedSkills.length > 0) {
      return `Solid alignment. You match key foundational requirements (${matchedStr}), with a quick learning curve on ${missingStr || 'specialized tools'}.`;
    }
    return `Good baseline alignment with the position requirements. Bridging ${missingStr} will make your profile highly competitive.`;
  }

  if (overallScore >= 50) {
    return `Moderate compatibility fit. You have foundational skills, but this role places heavy emphasis on ${missingStr || 'additional stack requirements'}.`;
  }

  return `Growth opportunity. Prioritize building portfolio projects in ${missingSkills.slice(0, 3).join(', ') || 'the required technologies'} before applying.`;
}

// ----------------------------------------------------
// 9. MAIN COMPATIBILITY ENGINE ENTRY POINT
// ----------------------------------------------------

/**
 * Calculates Full Deterministic Compatibility Analysis between Candidate and Job
 * @param {Object} user - Authenticated user / candidate profile
 * @param {Object} job - Job document
 * @returns {Object} Structured compatibility estimate
 */
function calculateJobCompatibility(user, job) {
  // Graceful handling for missing candidate or job
  if (!user || !job) {
    return {
      matchScore: 50,
      overall: 50,
      matchedSkills: [],
      partialSkills: [],
      missingSkills: job?.skills || [],
      matchedPreferredSkills: [],
      missingPreferredSkills: job?.preferredSkills || [],
      experienceMatch: {
        status: 'Not specified',
        candidateYears: 0,
        requiredYears: '0–2 years',
        explanation: 'Profile details not provided.'
      },
      educationMatch: {
        status: 'Not specified',
        candidateDegree: 'Not provided',
        requiredEducation: job?.education || 'Standard qualifications',
        explanation: 'Sign in with a completed profile to view detailed education compatibility.'
      },
      locationMatch: {
        status: 'Open',
        candidateLocation: 'Not provided',
        jobLocation: job?.location || 'Location open',
        explanation: 'Location preference open.'
      },
      roleMatch: {
        status: 'Open',
        explanation: 'General technical role evaluation.'
      },
      projectRelevance: {
        hasRelevantProjects: false,
        score: 50,
        relevantProjects: [],
        explanation: 'Add portfolio projects to demonstrate practical capability.'
      },
      explanation: 'Basic evaluation due to missing candidate profile information.',
      matchSummary: 'Basic evaluation due to missing candidate profile information.',
      recommendations: [
        {
          skill: 'Profile Skills',
          why: 'Allows the matching engine to accurately estimate compatibility with open positions.',
          learn: 'Add technical skills, education, and past projects in your profile settings.',
          suggestedProject: 'Complete your profile and upload your resume for tailored analysis.'
        }
      ],
      disclaimer: 'Note: This score is an AI compatibility estimate, not a hiring probability.',
      isHighMatch: false,
    };
  }

  // Extract Candidate attributes (combining profile, technical skills, resume-derived skills)
  const candidateSkills = [
    ...(user.profile?.skills || []),
    ...(user.skills || []),
    ...(user.profile?.technicalSkills || []),
    ...(user.profile?.resumeAnalysis?.skills || [])
  ];
  // Deduplicate candidate skills
  const uniqueCandidateSkills = Array.from(new Set(candidateSkills.filter(Boolean)));

  const requiredSkills = Array.isArray(job.skills) ? job.skills : (job.skills ? [job.skills] : []);
  const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : (job.preferredSkills ? [job.preferredSkills] : []);

  // 1. Skill Matching
  const skillAnalysis = evaluateSkillMatch(uniqueCandidateSkills, requiredSkills, preferredSkills);

  // 2. Experience Matching
  const candidateYears = calculateCandidateExperienceYears(user);
  const experienceAnalysis = evaluateExperienceMatch(candidateYears, job.experience);

  // 3. Education Matching
  const educationAnalysis = evaluateEducationMatch(user, job.education);

  // 4. Project Relevance
  const projectAnalysis = evaluateProjectRelevance(user, job);

  // 5. Location & Workplace Matching
  const locationAnalysis = evaluateLocationMatch(user, job);

  // 6. Role Relevance Matching
  const roleAnalysis = evaluateRoleMatch(user, job);

  // ----------------------------------------------------
  // Deterministic Composite Score Formula:
  // - Skill Match: 50%
  // - Experience Fit: 20%
  // - Project Relevance: 10%
  // - Education Fit: 10%
  // - Location Fit: 10%
  // ----------------------------------------------------
  const compositeScore = Math.round(
    skillAnalysis.score * 0.50 +
    experienceAnalysis.score * 0.20 +
    projectAnalysis.score * 0.10 +
    educationAnalysis.score * 0.10 +
    locationAnalysis.score * 0.10
  );

  // Bounded within 25% and 98%
  const finalMatchScore = Math.max(25, Math.min(98, compositeScore));

  // Build Explanations & Recommendations
  const explanation = buildNaturalLanguageExplanation(
    finalMatchScore,
    skillAnalysis.matched,
    skillAnalysis.missing,
    skillAnalysis.partial,
    job.title
  );

  const recommendations = buildSkillGapRecommendations(
    skillAnalysis.missing,
    skillAnalysis.partial
  );

  return {
    matchScore: finalMatchScore,
    overall: finalMatchScore,
    matchedSkills: skillAnalysis.matched,
    partialSkills: skillAnalysis.partial,
    missingSkills: skillAnalysis.missing,
    matchedPreferredSkills: skillAnalysis.matchedPreferred,
    missingPreferredSkills: skillAnalysis.missingPreferred,
    experienceMatch: experienceAnalysis,
    educationMatch: educationAnalysis,
    locationMatch: locationAnalysis,
    roleMatch: roleAnalysis,
    projectRelevance: projectAnalysis,
    explanation,
    matchSummary: explanation,
    recommendations,
    disclaimer: 'Note: This score is an AI compatibility estimate, not a hiring probability.',
    isHighMatch: finalMatchScore >= 75,
  };
}

module.exports = {
  calculateSkillMatch: evaluateSkillMatch,
  calculateJobCompatibility,
  getCanonicalSkill,
  cleanSkillString,
  evaluateExperienceMatch,
  evaluateEducationMatch,
  evaluateProjectRelevance,
  evaluateLocationMatch,
};
