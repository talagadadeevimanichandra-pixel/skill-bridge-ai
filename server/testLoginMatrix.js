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

async function runLoginMatrix() {
  console.log('====================================================');
  console.log('🔐 RUNNING FULL LOGIN & AUTHENTICATION MATRIX TEST');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  // A. Valid candidate account login
  total++;
  const candLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'aarav@skillbridge.demo', password: 'password123' });

  let candToken = candLogin.body?.token;
  if (
    candLogin.status === 200 &&
    candLogin.body?.success === true &&
    candToken &&
    candLogin.body?.user?.email === 'aarav@skillbridge.demo' &&
    candLogin.body?.user?.role === 'jobseeker' &&
    !candLogin.body?.user?.password &&
    !candLogin.body?.user?.passwordHash
  ) {
    console.log('✔ [PASS] A. Valid candidate account (aarav@skillbridge.demo / password123) -> 200 + Clean User + JWT');
    passed++;
  } else {
    console.error('✘ [FAIL] A. Valid candidate account:', candLogin);
  }

  // B. Valid employer account login
  total++;
  const empLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'recruiter@technova.demo', password: 'password123' });

  let empToken = empLogin.body?.token;
  if (
    empLogin.status === 200 &&
    empLogin.body?.success === true &&
    empToken &&
    empLogin.body?.user?.email === 'recruiter@technova.demo' &&
    empLogin.body?.user?.role === 'employer' &&
    !empLogin.body?.user?.password &&
    !empLogin.body?.user?.passwordHash
  ) {
    console.log('✔ [PASS] B. Valid employer account (recruiter@technova.demo / password123) -> 200 + Clean User + JWT');
    passed++;
  } else {
    console.error('✘ [FAIL] B. Valid employer account:', empLogin);
  }

  // C. Wrong password
  total++;
  const wrongPass = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'aarav@skillbridge.demo', password: 'wrongpassword' });

  if (wrongPass.status === 401 && wrongPass.body?.message === 'Email or password is incorrect.') {
    console.log('✔ [PASS] C. Wrong password -> 401 "Email or password is incorrect."');
    passed++;
  } else {
    console.error('✘ [FAIL] C. Wrong password:', wrongPass);
  }

  // D. Unknown email
  total++;
  const unknownEmail = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'nonexistent.user999@skillbridge.demo', password: 'password123' });

  if (unknownEmail.status === 401 && unknownEmail.body?.message === 'Email or password is incorrect.') {
    console.log('✔ [PASS] D. Unknown email -> 401 "Email or password is incorrect." (Does not reveal user non-existence)');
    passed++;
  } else {
    console.error('✘ [FAIL] D. Unknown email:', unknownEmail);
  }

  // E. Empty email
  total++;
  const emptyEmail = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: '', password: 'password123' });

  if (emptyEmail.status === 401 && emptyEmail.body?.message === 'Email or password is incorrect.') {
    console.log('✔ [PASS] E. Empty email -> 401 "Email or password is incorrect."');
    passed++;
  } else {
    console.error('✘ [FAIL] E. Empty email:', emptyEmail);
  }

  // F. Empty password
  total++;
  const emptyPass = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'aarav@skillbridge.demo', password: '' });

  if (emptyPass.status === 401 && emptyPass.body?.message === 'Email or password is incorrect.') {
    console.log('✔ [PASS] F. Empty password -> 401 "Email or password is incorrect."');
    passed++;
  } else {
    console.error('✘ [FAIL] F. Empty password:', emptyPass);
  }

  // G. Malformed email
  total++;
  const malformedEmail = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'not-an-email', password: 'password123' });

  if (malformedEmail.status === 401 && malformedEmail.body?.message === 'Email or password is incorrect.') {
    console.log('✔ [PASS] G. Malformed email -> 401 "Email or password is incorrect."');
    passed++;
  } else {
    console.error('✘ [FAIL] G. Malformed email:', malformedEmail);
  }

  // H. Protected route test with candidate token (Resume Intelligence)
  total++;
  const resumeRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/my',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candToken}` }
  });

  if (resumeRes.status === 200 && resumeRes.body?.success) {
    console.log('✔ [PASS] H. Protected route access (/api/resume/my) with valid candidate token -> 200');
    passed++;
  } else {
    console.error('✘ [FAIL] H. Protected route access:', resumeRes);
  }

  // I. User Session Verification (/api/auth/me)
  total++;
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candToken}` }
  });

  if (meRes.status === 200 && meRes.body?.user?.email === 'aarav@skillbridge.demo' && !meRes.body?.user?.passwordHash) {
    console.log('✔ [PASS] I. Session verification (/api/auth/me) -> 200 + safe user profile');
    passed++;
  } else {
    console.error('✘ [FAIL] I. Session verification:', meRes);
  }

  // J. Re-login test (simulating logout and login again)
  total++;
  const reloginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'aarav@skillbridge.demo', password: 'password123' });

  if (reloginRes.status === 200 && reloginRes.body?.token) {
    console.log('✔ [PASS] J. Re-login test after session teardown -> 200 + fresh JWT');
    passed++;
  } else {
    console.error('✘ [FAIL] J. Re-login test:', reloginRes);
  }

  console.log('\n====================================================');
  console.log(`🎯 LOGIN MATRIX RESULT: ${passed} / ${total} PASSED`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runLoginMatrix().catch(err => {
  console.error('Login matrix failed:', err);
  process.exit(1);
});
