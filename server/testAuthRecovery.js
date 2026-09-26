const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_production';

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

async function runTests() {
  console.log('=== RUNNING AUTH & SESSION RECOVERY VERIFICATION SUITE ===\n');
  let passed = 0;
  let total = 0;

  // Test 1: Stale Token with Non-existent User ID (valid signature, user missing)
  total++;
  const fakeUserId = '65f000000000000000000999';
  const staleToken = jwt.sign({ id: fakeUserId }, JWT_SECRET, { expiresIn: '1h' });

  const staleRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${staleToken}`
    }
  });

  if (staleRes.status === 401 && staleRes.body?.code === 'USER_NOT_FOUND' && staleRes.body?.message === 'Your session has expired. Please sign in again.') {
    console.log('✔ Test 1 PASS: Stale/Deleted User Token correctly returns 401 USER_NOT_FOUND with safe message');
    passed++;
  } else {
    console.error('✘ Test 1 FAIL:', staleRes);
  }

  // Test 2: Missing Token
  total++;
  const missingTokenRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET'
  });

  if (missingTokenRes.status === 401 && missingTokenRes.body?.code === 'TOKEN_MISSING') {
    console.log('✔ Test 2 PASS: Missing Token returns 401 TOKEN_MISSING');
    passed++;
  } else {
    console.error('✘ Test 2 FAIL:', missingTokenRes);
  }

  // Test 3: Malformed / Invalid Token
  total++;
  const invalidTokenRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid.malformed.token'
    }
  });

  if (invalidTokenRes.status === 401 && invalidTokenRes.body?.code === 'TOKEN_INVALID') {
    console.log('✔ Test 3 PASS: Invalid Token returns 401 TOKEN_INVALID');
    passed++;
  } else {
    console.error('✘ Test 3 FAIL:', invalidTokenRes);
  }

  // Test 4: Demo Candidate Login (/api/auth/demo-login)
  total++;
  const demoLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/demo-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { role: 'jobseeker' });

  let candidateToken = null;
  if (demoLoginRes.status === 200 && demoLoginRes.body?.token && demoLoginRes.body?.user?.email === 'aarav@skillbridge.demo') {
    candidateToken = demoLoginRes.body.token;
    console.log('✔ Test 4 PASS: Demo Candidate Quick Login provisioned valid token and user');
    passed++;
  } else {
    console.error('✘ Test 4 FAIL:', demoLoginRes);
  }

  // Test 5: Verify Candidate Session with /api/auth/me
  total++;
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });

  if (meRes.status === 200 && meRes.body?.user?.email === 'aarav@skillbridge.demo' && !meRes.body?.user?.passwordHash) {
    console.log('✔ Test 5 PASS: Valid Session verification succeeded via /api/auth/me (passwordHash cleanly stripped)');
    passed++;
  } else {
    console.error('✘ Test 5 FAIL:', meRes);
  }

  // Test 6: Resume Intelligence with Valid Candidate Token (/api/resume/my)
  total++;
  const resumeIntelRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/my',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });

  if (resumeIntelRes.status === 200 && resumeIntelRes.body?.success) {
    console.log('✔ Test 6 PASS: Protected Resume endpoint successfully fetched candidate resume intelligence');
    passed++;
  } else {
    console.error('✘ Test 6 FAIL:', resumeIntelRes);
  }

  // Test 7: Demo Recruiter Login (/api/auth/demo-login)
  total++;
  const recruiterLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/demo-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { role: 'employer' });

  if (recruiterLoginRes.status === 200 && recruiterLoginRes.body?.token && recruiterLoginRes.body?.user?.email === 'recruiter@technova.demo') {
    console.log('✔ Test 7 PASS: Demo Recruiter Quick Login provisioned valid token and user');
    passed++;
  } else {
    console.error('✘ Test 7 FAIL:', recruiterLoginRes);
  }

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${passed} / ${total} tests passed.`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Error running auth tests:', err);
  process.exit(1);
});
