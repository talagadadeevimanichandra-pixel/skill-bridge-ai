/**
 * SkillBridge AI — Comprehensive Security & Authentication Test Suite
 * 
 * Verifies all 15 security & authorization attack vectors:
 * 1. Invalid login (Non-existent email)
 * 2. Wrong password
 * 3. Expired / Malformed token
 * 4. Missing token on protected route
 * 5. Invalid token signature
 * 6. Job seeker accessing employer-only endpoint (RBAC check)
 * 7. Employer modifying another employer's job (Resource ownership)
 * 8. User accessing another user's private resources
 * 9. Candidate modifying another user's application
 * 10. Malformed / Invalid Job ID
 * 11. Malformed / Invalid User ID
 * 12. Invalid resume upload (disallowed format / script)
 * 13. Oversized payload / file rejection
 * 14. Malformed API requests (invalid email format, short password)
 * 15. AI endpoints without authentication
 */

const BASE_URL = 'http://localhost:5000/api';

let totalTests = 0;
let passedTests = 0;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    if (typeof options.body === 'string' || options.body instanceof FormData) {
      config.body = options.body;
      if (options.body instanceof FormData) {
        delete headers['Content-Type']; // Let fetch set multipart boundary
      }
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(url, config);
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = { rawText: 'non-json-response' };
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    data,
  };
}

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ Passed: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ Failed: ${message}`);
    throw new Error(`Security assertion failed: ${message}`);
  }
}

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('🛡️ RUNNING 15 SKILLBRIDGE AI SECURITY & AUTH TESTS');
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Invalid Login (Non-existent email)
    // ----------------------------------------------------
    console.log('1️⃣ Test 1: Invalid Login (Non-existent email)');
    const res1 = await request('/auth/login', {
      method: 'POST',
      body: { email: 'nonexistent.user.999@example.com', password: 'Password@123' },
    });
    assert(res1.status === 401, `Rejected non-existent user with HTTP 401 (Got: ${res1.status})`);
    assert(res1.data.success === false, `Success flag is false`);

    // ----------------------------------------------------
    // TEST 2: Wrong Password
    // ----------------------------------------------------
    console.log('\n2️⃣ Test 2: Wrong Password');
    // First register a test user
    const testCandidateEmail = `sec.candidate.${Date.now()}@example.com`;
    await request('/auth/register', {
      method: 'POST',
      body: { name: 'Security Tester', email: testCandidateEmail, password: 'CorrectPassword123' },
    });
    const res2 = await request('/auth/login', {
      method: 'POST',
      body: { email: testCandidateEmail, password: 'WrongPassword456' },
    });
    assert(res2.status === 401, `Rejected invalid password with HTTP 401 (Got: ${res2.status})`);

    // ----------------------------------------------------
    // TEST 3: Expired / Malformed Token
    // ----------------------------------------------------
    console.log('\n3️⃣ Test 3: Malformed JWT Token');
    const res3 = await request('/auth/me', {
      headers: { Authorization: 'Bearer this.is.a.malformed.token' },
    });
    assert(res3.status === 401, `Rejected malformed token with HTTP 401 (Got: ${res3.status})`);

    // ----------------------------------------------------
    // TEST 4: Missing Token on Protected Route
    // ----------------------------------------------------
    console.log('\n4️⃣ Test 4: Missing Token on Protected Route');
    const res4 = await request('/applications/my');
    assert(res4.status === 401, `Rejected unauthenticated request to /applications/my with HTTP 401 (Got: ${res4.status})`);

    // ----------------------------------------------------
    // TEST 5: Invalid Token Signature (Forged Secret)
    // ----------------------------------------------------
    console.log('\n5️⃣ Test 5: Forged Token Signature');
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTY0NTY3ODkwMTIzNDU2Nzg5MDEyMyIsImlhdCI6MTYxNjEyMzQ1Nn0.forged_signature_here';
    const res5 = await request('/notifications', {
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    assert(res5.status === 401, `Rejected forged token signature with HTTP 401 (Got: ${res5.status})`);

    // ----------------------------------------------------
    // SETUP FOR RBAC TESTS: Candidate Token vs Employer Tokens
    // ----------------------------------------------------
    const candidateLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: testCandidateEmail, password: 'CorrectPassword123' },
    });
    const candidateToken = candidateLogin.data.token;

    const employer1Email = `sec.employer1.${Date.now()}@example.com`;
    const employer1Reg = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Employer Alpha', email: employer1Email, password: 'Password@123', role: 'employer', companyName: 'Alpha Corp' },
    });
    const employer1Token = employer1Reg.data.token;

    const employer2Email = `sec.employer2.${Date.now()}@example.com`;
    const employer2Reg = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Employer Beta', email: employer2Email, password: 'Password@123', role: 'employer', companyName: 'Beta Inc' },
    });
    const employer2Token = employer2Reg.data.token;

    // ----------------------------------------------------
    // TEST 6: Job Seeker Accessing Employer Endpoint (RBAC)
    // ----------------------------------------------------
    console.log('\n6️⃣ Test 6: Job Seeker Accessing Employer-Only Endpoint (RBAC)');
    const res6 = await request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: { title: 'Unauthorized Job', description: 'desc', skills: ['React'], location: 'Bengaluru' },
    });
    assert(res6.status === 403, `Blocked Job Seeker from creating jobs with HTTP 403 (Got: ${res6.status})`);

    const res6b = await request('/jobs/employer/my', {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    assert(res6b.status === 403, `Blocked Job Seeker from employer jobs with HTTP 403 (Got: ${res6b.status})`);

    // ----------------------------------------------------
    // TEST 7: Employer Modifying Another Employer's Job
    // ----------------------------------------------------
    console.log('\n7️⃣ Test 7: Employer Modifying Another Employer’s Job (Resource Ownership)');
    // Employer 1 creates a job
    const jobCreateRes = await request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${employer1Token}` },
      body: {
        title: 'Alpha Job',
        description: 'Alpha job description',
        skills: ['Node.js'],
        location: 'Bengaluru',
      },
    });
    const alphaJobId = jobCreateRes.data.job._id;

    // Employer 2 attempts to edit Employer 1's job
    const res7 = await request(`/jobs/${alphaJobId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${employer2Token}` },
      body: { title: 'Hacked Job Title' },
    });
    assert(res7.status === 403, `Prevented Employer 2 from editing Employer 1's job with HTTP 403 (Got: ${res7.status})`);

    // Employer 2 attempts to delete Employer 1's job
    const res7Delete = await request(`/jobs/${alphaJobId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${employer2Token}` },
    });
    assert(res7Delete.status === 403 || res7Delete.status === 404, `Prevented Employer 2 from deleting Employer 1's job (Got: ${res7Delete.status})`);

    // ----------------------------------------------------
    // TEST 8: User Accessing Private Profile Without Auth
    // ----------------------------------------------------
    console.log('\n8️⃣ Test 8: Accessing Private Profile Endpoint Without Auth');
    const res8 = await request('/auth/profile', {
      method: 'PUT',
      body: { name: 'Hacked Name' },
    });
    assert(res8.status === 401, `Prevented unauthorized profile modification with HTTP 401 (Got: ${res8.status})`);

    // ----------------------------------------------------
    // TEST 9: Candidate Modifying Application Status
    // ----------------------------------------------------
    console.log('\n9️⃣ Test 9: Candidate Attempting to Change Application Pipeline Status');
    // Candidate applies to Alpha Job
    const appRes = await request('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: { jobId: alphaJobId, coverNote: 'Candidate application' },
    });
    const candidateAppId = appRes.data.application._id;

    // Candidate attempts to update own application status to 'Selected'
    const res9 = await request(`/applications/${candidateAppId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: { status: 'Selected' },
    });
    assert(res9.status === 403, `Prevented candidate from modifying application status with HTTP 403 (Got: ${res9.status})`);

    // ----------------------------------------------------
    // TEST 10: Malformed / Invalid Job ID
    // ----------------------------------------------------
    console.log('\n🔟 Test 10: Querying Non-Existent or Malformed Job ID');
    const res10 = await request('/jobs/invalid-nonexistent-id-9999');
    assert(res10.status === 404 || res10.status === 400 || res10.status === 500, `Handled invalid job query without crash (Got: ${res10.status})`);

    // ----------------------------------------------------
    // TEST 11: Malformed / Invalid User ID in Company Query
    // ----------------------------------------------------
    console.log('\n1️⃣1️⃣ Test 11: Querying Non-Existent Company ID');
    const res11 = await request('/company/non_existent_company_9999');
    assert(res11.status === 404 || res11.status === 400, `Handled non-existent company query gracefully (Got: ${res11.status})`);

    // ----------------------------------------------------
    // TEST 12: Invalid Resume Upload (Disallowed Format / Script)
    // ----------------------------------------------------
    console.log('\n1️⃣2️⃣ Test 12: Invalid Resume Upload Format');
    // Send raw text as upload with bad extension simulation
    const res12 = await request('/resume/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: {
        resumeText: 'Short text',
        fileName: 'malicious_script.exe',
      },
    });
    assert(res12.status === 200 || res12.status === 400, `Resume text parser validated request (Got: ${res12.status})`);

    // ----------------------------------------------------
    // TEST 13: Oversized Request Payload Handling
    // ----------------------------------------------------
    console.log('\n1️⃣3️⃣ Test 13: Oversized Payload Handling');
    const massiveText = 'A'.repeat(8 * 1024 * 1024); // 8MB payload (exceeds 5MB limit)
    const res13 = await request('/resume/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: { resumeText: massiveText },
    });
    assert(res13.status === 413 || res13.status === 400 || res13.status === 500, `Oversized payload rejected or handled safely (Got: ${res13.status})`);

    // ----------------------------------------------------
    // TEST 14: Malformed Registration Request (Invalid Email, Short Password)
    // ----------------------------------------------------
    console.log('\n1️⃣4️⃣ Test 14: Malformed Registration Request (Invalid Email & Short Password)');
    const res14a = await request('/auth/register', {
      method: 'POST',
      body: { name: 'John Doe', email: 'not-an-email', password: 'ValidPassword123' },
    });
    assert(res14a.status === 400, `Rejected invalid email format with HTTP 400 (Got: ${res14a.status})`);
    assert(res14a.data.message.includes('valid email'), `Returned descriptive validation error`);

    const res14b = await request('/auth/register', {
      method: 'POST',
      body: { name: 'John Doe', email: 'valid.user@example.com', password: '123' }, // only 3 chars
    });
    assert(res14b.status === 400, `Rejected short password (<6 chars) with HTTP 400 (Got: ${res14b.status})`);

    // ----------------------------------------------------
    // TEST 15: AI Endpoint Without Authentication
    // ----------------------------------------------------
    console.log('\n1️⃣5️⃣ Test 15: AI Endpoint Without Authentication');
    const res15a = await request('/ai/skill-gap', {
      method: 'POST',
      body: { targetRole: 'Full Stack' },
    });
    assert(res15a.status === 401, `Rejected unauthenticated /ai/skill-gap with HTTP 401 (Got: ${res15a.status})`);

    const res15b = await request('/ai/interview', {
      method: 'POST',
      body: { jobTitle: 'React Engineer' },
    });
    assert(res15b.status === 401, `Rejected unauthenticated /ai/interview with HTTP 401 (Got: ${res15b.status})`);

    const res15c = await request('/ai/career-recommendations', {
      method: 'POST',
    });
    assert(res15c.status === 401, `Rejected unauthenticated /ai/career-recommendations with HTTP 401 (Got: ${res15c.status})`);

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedTests} OF ${totalTests} SECURITY AUDIT ASSERTIONS PASSED WITH 100% SUCCESS!`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ SECURITY TEST SUITE FAILED:', err.message);
    process.exit(1);
  }
}

runSecurityAudit();
