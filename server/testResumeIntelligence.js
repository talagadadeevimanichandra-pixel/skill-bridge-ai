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

async function runTests() {
  console.log('====================================================');
  console.log('🚀 TESTING RESUME INTELLIGENCE SYSTEM');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate candidate
    const loginRes = await makeRequest('POST', '/api/auth/demo-login', { role: 'jobseeker' });
    assert(loginRes.status === 200 && loginRes.body.token, 'Candidate login succeeded');
    const token = loginRes.body.token;

    // 2. Test Strong Technical Resume
    const strongResumeText = `
Candidate: Rahul Verma
Email: rahul.verma@example.com
Phone: +91 98765 43210
Target Role: Full Stack Developer
GitHub: github.com/rahulverma
LinkedIn: linkedin.com/in/rahulverma

Professional Summary:
Full Stack Developer with 2+ years of experience building modern React and Node.js applications. Strong in MongoDB, Docker, and REST APIs.

Technical Skills:
JavaScript, TypeScript, React, Node.js, Express, MongoDB, Docker, AWS, Git, Tailwind CSS, SQL, Jest

Projects:
- Cloud Analytics Engine: Engineered a React and Node.js real-time analytics dashboard with MongoDB, improving query latency by 35% with Redis caching. github.com/rahulverma/cloud-engine
- Microservice Auth Hub: Built Dockerized OAuth2 authentication service in Node.js and PostgreSQL with 90% unit test coverage using Jest.

Experience:
- Full Stack Developer at TechNova Solutions (2023 - Present): Developed high-throughput REST APIs in Node.js and Express, designed responsive frontend components in React, reducing page load by 25%.

Education:
- B.Tech in Computer Science, 2023, GPA: 8.9 / 10.0

Achievements & Certifications:
- AWS Certified Developer Associate
- Smart India Hackathon Finalist
`;

    const strongRes = await makeRequest('POST', '/api/resume/analyze', {
      resumeText: strongResumeText,
      targetRole: 'Full Stack Developer',
      fileName: 'rahul_verma_resume.pdf',
    }, token);

    assert(strongRes.status === 200 && strongRes.body.success, 'POST /api/resume/analyze parses strong resume');
    const strongIntel = strongRes.body.resume.intelligence;
    console.log(`   Strong Resume Score: ${strongIntel.overallScore}/100, Label: "${strongIntel.scoreLabel}"`);
    assert(strongIntel.overallScore >= 80, 'Strong technical resume achieves >= 80 score');
    assert(strongIntel.scoreLabel === 'Strong', 'Strong label assigned');
    assert(strongIntel.scoreBreakdown.skills.weight === 20, 'Skills weight is transparently 20%');
    assert(strongIntel.scoreBreakdown.experience.weight === 20, 'Experience weight is transparently 20%');
    assert(strongIntel.scoreBreakdown.projects.weight === 15, 'Projects weight is transparently 15%');
    assert(strongIntel.atsCompatibilityChecks.length >= 8, 'ATS-style compatibility checks generated');
    assert(strongIntel.skillEvidence.some(s => s.evidenceStrength === 'Strong'), 'Skill evidence identifies strong implementation proof');

    // 3. Test Student Resume (Projects & Education, No Formal Experience)
    const studentResumeText = `
Candidate: Ananya Sen
Email: ananya.sen@example.com
Phone: +91 91234 56789
Education: B.Tech in Computer Science, VIT, 2025, GPA: 8.5 / 10.0
Skills: Python, React, JavaScript, HTML5, CSS3, Git, SQL
Projects:
- Campus Event Tracker: React web app to register for university hackathons with SQLite database.
- AI Image Classifier: Python and PyTorch basic neural network classifier.
`;

    const studentRes = await makeRequest('POST', '/api/resume/analyze', {
      resumeText: studentResumeText,
      targetRole: 'Frontend Developer',
      fileName: 'ananya_student_resume.pdf',
    }, token);

    assert(studentRes.status === 200 && studentRes.body.success, 'Student resume analyzed accurately');
    const studentIntel = studentRes.body.resume.intelligence;
    console.log(`   Student Resume Score: ${studentIntel.overallScore}/100, Label: "${studentIntel.scoreLabel}"`);
    assert(studentIntel.sectionOrderAdvice.profileType.includes('Student') || studentIntel.sectionOrderAdvice.profileType.includes('Graduate'), 'Student profile type detected');
    assert(studentIntel.areasToImprove.length > 0, 'Actionable areas to improve provided with examples');

    // 4. Test Resume Versioning & Before/After Comparison
    const updatedResume = studentResumeText + '\nExperience: Web Intern at Startup (May 2024 - Jul 2024)\nGitHub: github.com/ananya\nCertifications: AWS Cloud Practitioner';
    const updatedRes = await makeRequest('POST', '/api/resume/analyze', {
      resumeText: updatedResume,
      targetRole: 'Frontend Developer',
      fileName: 'ananya_student_resume_v2.pdf',
    }, token);

    assert(updatedRes.status === 200 && updatedRes.body.resume.currentVersion >= 2, 'Resume version incremented to v2');
    const comparison = updatedRes.body.resume.intelligence.comparisonAgainstPrevious;
    assert(comparison && comparison.previousScore !== undefined, 'Before/After comparison generated');
    console.log(`   Before/After: Prev ${comparison.previousScore} -> New ${comparison.newScore} (${comparison.scoreDifference >= 0 ? '+' : ''}${comparison.scoreDifference} pts)`);

    // 5. Test Job-Specific Resume Comparison
    const jobsListRes = await makeRequest('GET', '/api/jobs?limit=1');
    const sampleJob = jobsListRes.body.jobs[0];

    const compareJobRes = await makeRequest('POST', '/api/resume/compare-job', {
      jobId: sampleJob._id,
    }, token);

    assert(compareJobRes.status === 200 && compareJobRes.body.success, 'POST /api/resume/compare-job succeeded');
    assert(typeof compareJobRes.body.compatibilityScore === 'number', 'Job compatibility estimate returned');
    assert(Array.isArray(compareJobRes.body.matchedRequirements), 'Matched requirements list returned');
    console.log(`   Job Match Score against "${sampleJob.title}": ${compareJobRes.body.compatibilityScore}%`);

    // 6. Test GET /api/resume/my
    const getMyRes = await makeRequest('GET', '/api/resume/my', null, token);
    assert(getMyRes.status === 200 && getMyRes.body.hasResume, 'GET /api/resume/my returns current resume intelligence');
    assert(getMyRes.body.resume.versions.length >= 1, 'Version history persists in record');

    // 7. Test Delete Resume
    const delRes = await makeRequest('DELETE', '/api/resume/my', null, token);
    assert(delRes.status === 200 && delRes.body.success, 'DELETE /api/resume/my removes resume');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`🎯 RESUME TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');
}

runTests();
