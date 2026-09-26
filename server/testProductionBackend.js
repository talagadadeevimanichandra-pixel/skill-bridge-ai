const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runProductionTests() {
  console.log('====================================================');
  console.log('🚀 PRODUCTION BACKEND READINESS VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  // 1. Health Endpoint (GET /api/health)
  total++;
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });

  if (healthRes.status === 200 && healthRes.body?.status === 'ok') {
    console.log('✔ [PASS] 1. GET /api/health -> 200 OK, safe metadata returned');
    passed++;
  } else {
    console.error('✘ [FAIL] 1. GET /api/health:', healthRes);
  }

  // 2. Register Candidate
  total++;
  const testEmail = `test.candidate.${Date.now()}@example.com`;
  const registerRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Test Candidate',
    email: testEmail,
    password: 'password123',
    role: 'jobseeker',
    skills: ['React', 'Node.js', 'MongoDB']
  });

  let userToken = registerRes.body?.token;
  if (registerRes.status === 201 && userToken && registerRes.body?.user?.email === testEmail) {
    console.log('✔ [PASS] 2. POST /api/auth/register -> 201 Created + Token & User Object');
    passed++;
  } else {
    console.error('✘ [FAIL] 2. POST /api/auth/register:', registerRes);
  }

  // 3. Login Candidate
  total++;
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: 'password123'
  });

  if (loginRes.status === 200 && loginRes.body?.token && loginRes.body?.user?.email === testEmail) {
    userToken = loginRes.body.token;
    console.log('✔ [PASS] 3. POST /api/auth/login -> 200 OK + Fresh JWT');
    passed++;
  } else {
    console.error('✘ [FAIL] 3. POST /api/auth/login:', loginRes);
  }

  // 4. Protected API Route (GET /api/auth/me)
  total++;
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });

  if (meRes.status === 200 && meRes.body?.user?.email === testEmail && !meRes.body?.user?.passwordHash) {
    console.log('✔ [PASS] 4. GET /api/auth/me -> 200 OK, JWT verified, passwordHash redacted');
    passed++;
  } else {
    console.error('✘ [FAIL] 4. GET /api/auth/me:', meRes);
  }

  // 5. Jobs Endpoint (GET /api/jobs)
  total++;
  const jobsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET'
  });

  const jobList = jobsRes.body?.jobs || jobsRes.body?.data;
  if (jobsRes.status === 200 && Array.isArray(jobList) && jobList.length > 0) {
    console.log(`✔ [PASS] 5. GET /api/jobs -> 200 OK (${jobList.length} jobs retrieved)`);
    passed++;
  } else {
    console.error('✘ [FAIL] 5. GET /api/jobs:', jobsRes);
  }

  // 6. Applications Endpoint (GET /api/applications/my)
  total++;
  const appsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications/my',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });

  const appList = appsRes.body?.applications || appsRes.body?.data;
  if (appsRes.status === 200 && Array.isArray(appList)) {
    console.log(`✔ [PASS] 6. GET /api/applications/my -> 200 OK (${appList.length} applications found)`);
    passed++;
  } else {
    console.error('✘ [FAIL] 6. GET /api/applications/my:', appsRes);
  }

  // 7. Resume Intelligence Endpoint (GET /api/resume/my)
  total++;
  const resumeRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/my',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });

  if (resumeRes.status === 200 && resumeRes.body?.success) {
    console.log('✔ [PASS] 7. GET /api/resume/my -> 200 OK');
    passed++;
  } else {
    console.error('✘ [FAIL] 7. GET /api/resume/my:', resumeRes);
  }

  // 8. Skill Library Endpoint (GET /api/skills)
  total++;
  const skillsRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/skills',
    method: 'GET'
  });

  const skillList = skillsRes.body?.skills || skillsRes.body?.data;
  if (skillsRes.status === 200 && Array.isArray(skillList) && skillList.length > 0) {
    console.log(`✔ [PASS] 8. GET /api/skills -> 200 OK (${skillsRes.body?.totalCount || skillList.length} total skills in library)`);
    passed++;
  } else {
    console.error('✘ [FAIL] 8. GET /api/skills:', skillsRes);
  }

  console.log('\n====================================================');
  console.log(`🎯 PRODUCTION BACKEND TEST SUMMARY: ${passed} / ${total} PASSED`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runProductionTests().catch(err => {
  console.error('Production tests failed:', err);
  process.exit(1);
});
