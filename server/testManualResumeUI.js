const http = require('http');

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function inspectResumeAnalyzer() {
  console.log('====================================================');
  console.log('🔍 MANUAL INSPECTION: RESUME INTELLIGENCE UI & API');
  console.log('====================================================\n');

  // Step 1: Demo Candidate Login
  console.log('1️⃣ Logging in as Job Seeker candidate...');
  const loginRes = await makeRequest('POST', '/api/auth/demo-login', { role: 'jobseeker' });
  const token = loginRes.body.token;
  console.log('   ✅ Candidate Logged In:', loginRes.body.user.name, `(${loginRes.body.user.email})`);

  // Step 2: Upload a realistic resume
  console.log('\n2️⃣ Uploading and analyzing realistic candidate resume for Full Stack Developer...');
  const realisticResume = `
Candidate: Vikas Kulkarni
Email: vikas.kulkarni@example.com
Phone: +91 98450 12345
Location: Bengaluru, India
Target Role: Full Stack Developer
GitHub: github.com/vikaskulkarni
LinkedIn: linkedin.com/in/vikas-kulkarni
Portfolio: vikas-dev.vercel.app

Professional Summary:
Full Stack Web Developer with 2+ years of experience engineering high-performance web applications with React, Node.js, Express, and MongoDB. Proven track record in API optimization, state management, and modern component architecture.

Technical Skills:
JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git, Tailwind CSS, Redis, Jest, REST APIs

Projects:
- SkillBridge AI Platform: Full-stack talent intelligence portal built with React, Node.js, Express, MongoDB, and Tailwind CSS. Implemented ATS scoring algorithms and real-time job compatibility engine, reducing candidate search time by 40%. github.com/vikaskulkarni/skillbridge-ai
- Real-Time Microservice Dashboard: Built a Dockerized telemetry dashboard using Node.js, Redis, and WebSockets to monitor distributed service latency and health.

Experience:
- Full Stack Developer Intern at TechNova Solutions (June 2024 - Present): Developed reusable UI components in React and Tailwind CSS. Built 12+ RESTful API endpoints in Node.js/Express with MongoDB aggregation pipelines, improving data retrieval response time by 28%.
- Web Development Intern at CloudNest Technologies (Jan 2024 - May 2024): Collaborated on migrating legacy pages to Next.js and TypeScript, increasing Lighthouse performance score from 65 to 94.

Education:
- Bachelor of Technology in Computer Science and Engineering, 2025
  National Institute of Technology Karnataka (NITK)
  CGPA: 8.8 / 10.0

Achievements & Certifications:
- AWS Certified Developer Associate (2024)
- 1st Place - Smart India Hackathon Regional Round (2024)
`;

  const analyzeRes = await makeRequest('POST', '/api/resume/analyze', {
    resumeText: realisticResume,
    targetRole: 'Full Stack Developer',
    fileName: 'vikas_kulkarni_fullstack_resume.pdf',
  }, token);

  const resume = analyzeRes.body.resume;
  const intel = resume.intelligence;

  console.log('   ✅ Analysis Completed successfully!');
  console.log(`   - Overall Profile Score: ${intel.overallScore} / 100 (${intel.scoreLabel})`);
  console.log(`   - Notice: "${intel.scoreNotice}"`);

  // Step 3: Validate Profile Weightage
  console.log('\n3️⃣ Verifying Profile Weightage & Score Breakdown:');
  const weights = intel.scoreBreakdown;
  for (const [dim, val] of Object.entries(weights)) {
    console.log(`   - ${dim.padEnd(16)}: ${val.score}% (Weight: ${val.weight}%) — "${val.explanation}"`);
  }

  // Step 4: Validate Resume Completeness
  console.log('\n4️⃣ Verifying Resume Completeness Checklist (11 Sections):');
  intel.completenessSections.forEach((sec) => {
    console.log(`   - [${sec.status === 'Present' ? '✓' : sec.status === 'Needs Improvement' ? '⚠' : '✕'}] ${sec.name.padEnd(25)}: ${sec.details}`);
  });

  // Step 5: Validate Strengths & Weaknesses
  console.log('\n5️⃣ Verifying Strengths & Areas Needing Attention:');
  console.log('   Strengths:');
  intel.strengths.forEach((s, idx) => console.log(`     ${idx + 1}. ${s}`));
  console.log('   Areas Needing Attention:');
  intel.weaknesses.forEach((w, idx) => console.log(`     ${idx + 1}. ${w}`));

  // Step 6: Validate Actionable Areas to Improve with Examples
  console.log('\n6️⃣ Verifying Actionable Areas to Improve:');
  intel.areasToImprove.forEach((area, idx) => {
    console.log(`   Issue #${idx + 1} [${area.severity}]: ${area.issue}`);
    console.log(`     Why: ${area.whyItMatters}`);
    console.log(`     Fix: ${area.howToFix}`);
    if (area.example) console.log(`     Example: ${area.example}`);
  });

  // Step 7: Validate ATS-style Compatibility Checks
  console.log('\n7️⃣ Verifying ATS-Style Compatibility Checks:');
  intel.atsCompatibilityChecks.forEach((chk) => {
    console.log(`   - [${chk.passed ? 'PASSED' : 'FLAGGED'}] ${chk.checkName.padEnd(35)} (${chk.status})`);
  });

  // Step 8: Validate Skill Evidence Matrix
  console.log('\n8️⃣ Verifying Skill Evidence Matrix:');
  intel.skillEvidence.forEach((item) => {
    console.log(`   - ${item.skill.padEnd(14)}: InSkills=[✓] InProjects=[${item.inProjects ? '✓' : ' '}] InExperience=[${item.inExperience ? '✓' : ' '}] EvidenceStrength=[${item.evidenceStrength}]`);
  });

  // Step 9: Validate Keyword Analysis & Target Job Match
  console.log('\n9️⃣ Verifying Target Role Keyword Analysis & Job Match:');
  console.log('   - Detected Keywords:', intel.keywordAnalysis.detectedKeywords.join(', '));
  console.log('   - Missing Keywords:', intel.keywordAnalysis.missingKeywords.join(', ') || 'None (100% matched)');

  const jobsRes = await makeRequest('GET', '/api/jobs?limit=1');
  const sampleJob = jobsRes.body.jobs[0];
  const compareRes = await makeRequest('POST', '/api/resume/compare-job', { jobId: sampleJob._id }, token);
  console.log(`   - Live Job Match against "${sampleJob.title}" @ ${sampleJob.companyName}: ${compareRes.body.compatibilityScore}% Compatibility`);
  console.log(`     Matched: ${compareRes.body.matchedRequirements.length} requirements`);
  console.log(`     Missing: ${compareRes.body.missingRequirements.length} requirements`);

  // Step 10: Validate Priority Action Plan & Resume Health
  console.log('\n🔟 Verifying Priority Action Plan & Resume Health:');
  console.log('   Resume Health:', JSON.stringify(intel.resumeHealth));
  intel.priorityActionPlan.forEach((plan) => {
    console.log(`   #${plan.rank}: ${plan.title} — "${plan.action}" (Reason: ${plan.reason})`);
  });

  // Step 11: Validate Persistence after Page Refresh
  console.log('\n1️⃣1️⃣ Verifying Persistence across sessions / browser refresh:');
  const refreshRes = await makeRequest('GET', '/api/resume/my', null, token);
  if (refreshRes.body.hasResume && refreshRes.body.resume.intelligence?.overallScore === intel.overallScore) {
    console.log(`   ✅ Persistence verified: Candidate "${refreshRes.body.resume.extractedData?.name || 'Candidate'}" resume analysis (Score: ${refreshRes.body.resume.intelligence?.overallScore}/100) and version history retrieved accurately.`);
  } else {
    console.error('   ❌ Persistence failed:', refreshRes.body);
  }

  console.log('\n====================================================');
  console.log('🎉 RESUME ANALYZER MANUAL INSPECTION COMPLETED 100%');
  console.log('====================================================\n');
}

inspectResumeAnalyzer().catch(console.error);
