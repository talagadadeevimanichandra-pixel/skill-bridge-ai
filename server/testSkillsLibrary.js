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
  console.log('🚀 TESTING SKILL LIBRARY & DEVELOPMENT MODULE');
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
    // 1. Check Categories
    const catRes = await makeRequest('GET', '/api/skills/categories');
    assert(catRes.status === 200 && catRes.body.success, 'GET /api/skills/categories responds successfully');
    const categories = catRes.body.categories || [];
    console.log(`   Found ${categories.length} categories:`, categories.map(c => c.category).join(', '));
    assert(categories.length >= 12, 'All 12 core career domains are present');

    // 2. Check All Skills
    const allSkillsRes = await makeRequest('GET', '/api/skills?limit=150');
    assert(allSkillsRes.status === 200 && allSkillsRes.body.success, 'GET /api/skills responds successfully');
    const skills = allSkillsRes.body.skills || [];
    console.log(`   Total Skills returned: ${skills.length}`);
    assert(skills.length >= 80, 'Skill library has rich structured dataset (>80 skills)');

    // 3. Check Category Filtering
    const swDevRes = await makeRequest('GET', '/api/skills?category=Software Development');
    assert(
      swDevRes.status === 200 && swDevRes.body.skills.every(s => s.category === 'Software Development'),
      'Filter by category (Software Development) works accurately'
    );

    const aiRes = await makeRequest('GET', '/api/skills?category=AI %26 Machine Learning');
    assert(
      aiRes.status === 200 && aiRes.body.skills.length > 0,
      'Filter by category (AI & Machine Learning) works accurately'
    );

    // 4. Check Difficulty Filtering
    const diffRes = await makeRequest('GET', '/api/skills?difficulty=Advanced');
    assert(
      diffRes.status === 200 && diffRes.body.skills.every(s => s.difficulty === 'Advanced'),
      'Filter by difficulty (Advanced) works accurately'
    );

    // 5. Check Search Query
    const searchRes = await makeRequest('GET', '/api/skills?search=React');
    assert(
      searchRes.status === 200 && searchRes.body.skills.some(s => s.name.toLowerCase().includes('react')),
      'Search query for "React" finds relevant skills'
    );

    // 6. Check Single Skill Details & Live Jobs Lookup
    const singleSkill = skills.find(s => s.name === 'React') || skills[0];
    const detailRes = await makeRequest('GET', `/api/skills/${encodeURIComponent(singleSkill.name)}`);
    assert(detailRes.status === 200 && detailRes.body.success, `GET /api/skills/${singleSkill.name} returns detail`);
    assert(Array.isArray(detailRes.body.relatedJobs), 'Detail includes relatedJobs array');
    console.log(`   Skill "${singleSkill.name}" has ${detailRes.body.relatedJobs.length} live matching jobs.`);

    // 7. Login as Candidate to test Skill Tracking
    const loginRes = await makeRequest('POST', '/api/auth/demo-login', { role: 'jobseeker' });
    assert(loginRes.status === 200 && loginRes.body.token, 'Candidate demo login succeeded');
    const token = loginRes.body.token;

    // 8. Track a Skill as "Learning"
    const trackRes = await makeRequest('POST', '/api/skills/my', { name: 'Kubernetes', status: 'Learning' }, token);
    assert(trackRes.status === 200 && trackRes.body.success, 'POST /api/skills/my sets skill to "Learning"');

    // 9. Update Tracked Skill to "Strong"
    const updateRes = await makeRequest('POST', '/api/skills/my', { name: 'Kubernetes', status: 'Strong' }, token);
    assert(
      updateRes.status === 200 && updateRes.body.trackedSkills.some(s => s.name === 'Kubernetes' && s.status === 'Strong'),
      'POST /api/skills/my updates skill to "Strong"'
    );

    // 10. Get My Tracked Skills
    const mySkillsRes = await makeRequest('GET', '/api/skills/my', null, token);
    assert(
      mySkillsRes.status === 200 && mySkillsRes.body.trackedSkills.some(s => s.name === 'Kubernetes'),
      'GET /api/skills/my returns user tracked skills'
    );

    // 11. Delete Tracked Skill
    const deleteRes = await makeRequest('DELETE', '/api/skills/my/Kubernetes', null, token);
    assert(
      deleteRes.status === 200 && !deleteRes.body.trackedSkills.some(s => s.name === 'Kubernetes'),
      'DELETE /api/skills/my/Kubernetes successfully removes tracked skill'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`🎯 SKILLS TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');
}

runTests();
