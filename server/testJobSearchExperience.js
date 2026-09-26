const BASE_URL = 'http://localhost:5000/api';

const logPass = (title, detail = '') => {
  console.log(`  ✅ ${title} ${detail ? `(${detail})` : ''}`);
};

const logFail = (title, error) => {
  console.error(`  ❌ ${title}:`, error);
  process.exit(1);
};

async function api(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const config = {
    method: options.method || 'GET',
    headers,
  };
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { status: res.status, data };
}

async function runJobSearchVerification() {
  console.log('\n====================================================');
  console.log('🧪 TESTING JOBS PAGE & SEARCH EXPERIENCE (24 JOBS)');
  console.log('====================================================\n');

  // 1. Initial Load (No filters)
  console.log('1️⃣ Test Initial Load: All Jobs');
  const allRes = await api('/jobs');
  if (allRes.data.jobs.length >= 20) {
    logPass(`Initial fetch returned all ${allRes.data.jobs.length} realistic fictional jobs (Total: ${allRes.data.total})`);
  } else {
    logFail('Initial fetch jobs count is less than 20', allRes.data.jobs.length);
  }

  // 2. Search "React"
  console.log('\n2️⃣ Test Search: "React"');
  const reactRes = await api('/jobs?search=React');
  if (reactRes.data.jobs.length > 0 && reactRes.data.jobs.every(j => 
    j.title.toLowerCase().includes('react') ||
    (j.skills || []).some(s => s.toLowerCase().includes('react')) ||
    (j.preferredSkills || []).some(s => s.toLowerCase().includes('react')) ||
    j.description.toLowerCase().includes('react')
  )) {
    logPass(`Search "React" correctly returned ${reactRes.data.jobs.length} relevant jobs across title/skills/description`);
  } else {
    logFail('Search "React" returned invalid jobs', reactRes.data.jobs.length);
  }

  // 3. Search "Hyderabad"
  console.log('\n3️⃣ Test Search: "Hyderabad"');
  const hydSearchRes = await api('/jobs?search=Hyderabad');
  if (hydSearchRes.data.jobs.length > 0 && hydSearchRes.data.jobs.every(j => j.location.toLowerCase().includes('hyderabad'))) {
    logPass(`Search "Hyderabad" returned ${hydSearchRes.data.jobs.length} Hyderabad jobs`);
  } else {
    logFail('Search "Hyderabad" returned incorrect results', hydSearchRes.data.jobs.length);
  }

  // 4. Location Filter: "Hyderabad"
  console.log('\n4️⃣ Test Location Filter: "Hyderabad"');
  const hydLocRes = await api('/jobs?location=Hyderabad');
  if (hydLocRes.data.jobs.length > 0 && hydLocRes.data.jobs.every(j => j.location.toLowerCase().includes('hyderabad'))) {
    logPass(`Location filter "Hyderabad" returned ${hydLocRes.data.jobs.length} jobs`);
  } else {
    logFail('Location filter "Hyderabad" failed', hydLocRes.data.jobs.length);
  }

  // 5. Search "TechNova"
  console.log('\n5️⃣ Test Company Search: "TechNova"');
  const techNovaRes = await api('/jobs?search=TechNova');
  if (techNovaRes.data.jobs.length > 0 && techNovaRes.data.jobs.every(j => j.companyName.toLowerCase().includes('technova'))) {
    logPass(`Search "TechNova" returned ${techNovaRes.data.jobs.length} TechNova Solutions jobs`);
  } else {
    logFail('Company search failed', techNovaRes.data.jobs.length);
  }

  // 6. Role Filter: "Full Stack Developer"
  console.log('\n6️⃣ Test Role Filter: "Full Stack Developer"');
  const fullStackRes = await api('/jobs?role=Full Stack');
  if (fullStackRes.data.jobs.length > 0 && fullStackRes.data.jobs.every(j => j.title.toLowerCase().includes('full stack'))) {
    logPass(`Role filter "Full Stack" returned ${fullStackRes.data.jobs.length} jobs`);
  } else {
    logFail('Role filter failed', fullStackRes.data.jobs.length);
  }

  // 7. Combined Multiple Filters
  console.log('\n7️⃣ Test Combined Multiple Filters (Hyderabad + Full Stack)');
  const combinedRes = await api('/jobs?location=Hyderabad&role=Full Stack');
  if (combinedRes.data.jobs.length > 0 && combinedRes.data.jobs.every(j => j.location.toLowerCase().includes('hyderabad') && j.title.toLowerCase().includes('full stack'))) {
    logPass(`Combined filters (Hyderabad + Full Stack) returned ${combinedRes.data.jobs.length} matching job(s)`);
  } else {
    logFail('Combined filters failed', combinedRes.data.jobs.length);
  }

  // 8. Zero Results Check ("Amazon")
  console.log('\n8️⃣ Test Zero Results Search ("Amazon")');
  const zeroRes = await api('/jobs?search=Amazon');
  if (zeroRes.data.jobs.length === 0) {
    logPass('Search "Amazon" correctly returned 0 results for non-existent fictional company');
  } else {
    logFail('Expected 0 results for Amazon search', zeroRes.data.jobs.length);
  }

  // 9. Sorting Verification
  console.log('\n9️⃣ Test Sorting (Salary High to Low & Low to High)');
  const sortSalaryHighRes = await api('/jobs?sortBy=salary_high');
  const firstHigh = sortSalaryHighRes.data.jobs[0].salary?.max || 0;
  const lastHigh = sortSalaryHighRes.data.jobs[sortSalaryHighRes.data.jobs.length - 1].salary?.max || 0;
  if (firstHigh >= lastHigh) {
    logPass(`Salary High to Low sorted correctly: Top ₹${firstHigh} >= Bottom ₹${lastHigh}`);
  } else {
    logFail('Salary High to Low sort failed', `${firstHigh} vs ${lastHigh}`);
  }

  const sortSalaryLowRes = await api('/jobs?sortBy=salary_low');
  const firstLow = sortSalaryLowRes.data.jobs[0].salary?.min || 0;
  const lastLow = sortSalaryLowRes.data.jobs[sortSalaryLowRes.data.jobs.length - 1].salary?.min || 0;
  if (firstLow <= lastLow) {
    logPass(`Salary Low to High sorted correctly: Top ₹${firstLow} <= Bottom ₹${lastLow}`);
  } else {
    logFail('Salary Low to High sort failed', `${firstLow} vs ${lastLow}`);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL 9 JOB SEARCH & FILTER BEHAVIOR TESTS PASSED!');
  console.log('====================================================\n');
}

runJobSearchVerification().catch(err => {
  console.error('Job search verification failed:', err);
  process.exit(1);
});
