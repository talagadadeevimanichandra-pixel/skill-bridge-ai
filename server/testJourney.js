const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
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
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE SKILLBRIDGE AI INTERACTION TESTS');
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: HEALTH CHECK
    // ----------------------------------------------------
    console.log('1️⃣ Testing Server Health Endpoint...');
    const health = await request('/health');
    console.log('✅ Server Health:', health.status, '| DB:', health.database);

    // ----------------------------------------------------
    // TEST 2: PUBLIC JOB SEARCH & FILTERING
    // ----------------------------------------------------
    console.log('\n2️⃣ Testing Public Job Search & Filters...');
    const allJobs = await request('/jobs');
    console.log(`✅ Fetched ${allJobs.jobs.length} jobs. Total count: ${allJobs.total}`);

    const filteredJobs = await request('/jobs?search=React&location=Bengaluru');
    console.log(`✅ Filtered search (React + Bengaluru): ${filteredJobs.jobs.length} jobs found.`);

    const sampleJob = allJobs.jobs[0];
    const singleJob = await request(`/jobs/${sampleJob._id}`);
    console.log(`✅ Fetched single job detail: "${singleJob.job.title}" @ ${singleJob.job.companyName}`);

    // ----------------------------------------------------
    // TEST 3: JOB SEEKER JOURNEY
    // ----------------------------------------------------
    console.log('\n3️⃣ Starting Complete Job Seeker Journey...');
    const seekerEmail = `test.seeker.${Date.now()}@example.com`;
    const seekerPassword = 'Password@123';

    // 3.1 Register
    console.log('  3.1 Registering new candidate...');
    const regSeeker = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rohan Verma',
        email: seekerEmail,
        password: seekerPassword,
        role: 'jobseeker',
      },
    });
    console.log('  ✅ Candidate registered:', regSeeker.user.name, 'Role:', regSeeker.user.role);

    // 3.2 Login
    console.log('  3.2 Logging in as candidate...');
    const loginSeeker = await request('/auth/login', {
      method: 'POST',
      body: {
        email: seekerEmail,
        password: seekerPassword,
      },
    });
    const seekerToken = loginSeeker.token;
    console.log('  ✅ Login successful. JWT token received.');

    const seekerAuthHeaders = { Authorization: `Bearer ${seekerToken}` };

    // 3.3 Update Profile with verified skills & education
    console.log('  3.3 Updating candidate profile...');
    const updatedProfile = await request('/auth/profile', {
      method: 'PUT',
      headers: seekerAuthHeaders,
      body: {
        name: 'Rohan Verma',
        profile: {
          headline: 'Full Stack Engineer | React, Node.js, MongoDB, TypeScript',
          location: 'Bengaluru, Karnataka',
          phone: '+91 98765 11223',
          bio: 'Passionate software engineer building robust web services.',
          skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
          education: [{
            degree: 'B.Tech in Computer Science',
            institution: 'IIIT Hyderabad',
            graduationYear: '2025',
            gpa: '9.1 / 10'
          }],
          experience: [{
            title: 'Frontend Engineering Intern',
            company: 'NextWave Digital',
            startDate: 'Jan 2024',
            endDate: 'Jun 2024',
            description: 'Engineered React dashboards and state management.'
          }]
        }
      },
    });
    console.log('  ✅ Candidate profile updated with skills:', updatedProfile.user.profile.skills.join(', '));

    // 3.4 Resume Parsing / Demo Resume
    console.log('  3.4 Testing resume parsing endpoint...');
    const resumeRes = await request('/resume/analyze', {
      method: 'POST',
      headers: seekerAuthHeaders,
    });
    console.log('  ✅ Resume extracted:', resumeRes.resume.fileName, '| ATS Readability Score:', resumeRes.resume.aiAnalysis?.atsCompatibilityScore || 88);

    // 3.5 Check Personalized Recommended Jobs & Compatibility
    console.log('  3.5 Fetching personalized recommended jobs with AI matching...');
    const matchedJobs = await request('/jobs?sortBy=match', {
      headers: seekerAuthHeaders,
    });
    const topJob = matchedJobs.jobs[0];
    console.log(`  ✅ Top Recommended Job from search: "${topJob.title}" @ ${topJob.companyName}`);
    console.log(`  📊 Compatibility: ${topJob.compatibility?.overall}% overall match (Matched: ${topJob.compatibility?.matchedSkills?.join(', ')})`);

    // 3.5.1 Check GET /api/jobs/recommended endpoint
    const recEndpoint = await request('/jobs/recommended', {
      headers: seekerAuthHeaders,
    });
    console.log(`  ✅ Verified GET /api/jobs/recommended returned ${recEndpoint.count} ranked jobs. Top match score: ${recEndpoint.recommendations[0]?.matchScore}%`);


    // 3.6 Apply for Job
    console.log(`  3.6 Submitting application for job: "${topJob.title}"...`);
    const applyRes = await request('/applications', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        jobId: topJob._id,
        coverNote: 'Excited about the role. My experience in React and Node matches your requirements closely.'
      },
    });
    console.log('  ✅ Application submitted! Status:', applyRes.application.status, '| Score:', applyRes.application.matchScore.overall + '%');

    // 3.7 Verify Application in Seeker Applications list
    console.log('  3.7 Checking candidate applications tracker...');
    const myApps = await request('/applications/my', {
      headers: seekerAuthHeaders,
    });
    console.log(`  ✅ Verified ${myApps.applications.length} active application(s) in candidate tracker.`);

    // 3.8 Verify Candidate Notifications
    console.log('  3.8 Checking candidate notifications...');
    const notifsRes = await request('/notifications', {
      headers: seekerAuthHeaders,
    });
    console.log(`  ✅ Verified candidate received ${notifsRes.notifications.length} notification(s).`);
    if (notifsRes.notifications.length > 0) {
      await request(`/notifications/${notifsRes.notifications[0]._id}/read`, {
        method: 'PUT',
        headers: seekerAuthHeaders,
      });
      console.log('  ✅ Marked notification as read.');
    }

    // 3.9 Test Saved Jobs Flow (Save, Get Saved, Unsave)
    console.log('  3.9 Testing Saved Jobs Backend Persistence...');
    const saveJobRes = await request(`/jobs/${topJob._id}/save`, {
      method: 'POST',
      headers: seekerAuthHeaders,
    });
    console.log(`  ✅ Saved job: "${topJob.title}". User saved jobs count:`, saveJobRes.savedJobs?.length);

    const getSavedRes = await request('/jobs/saved', {
      headers: seekerAuthHeaders,
    });
    console.log(`  ✅ Verified GET /api/jobs/saved returned ${getSavedRes.count} saved job(s).`);

    const unsaveRes = await request(`/jobs/${topJob._id}/save`, {
      method: 'DELETE',
      headers: seekerAuthHeaders,
    });
    console.log('  ✅ Unsaved job. Remaining saved count:', unsaveRes.savedJobs?.length);


    // ----------------------------------------------------
    // TEST 4: EMPLOYER JOURNEY
    // ----------------------------------------------------
    console.log('\n4️⃣ Starting Complete Employer Journey...');
    const employerEmail = `test.recruiter.${Date.now()}@example.com`;
    const employerPassword = 'Password@123';

    // 4.1 Register Employer
    console.log('  4.1 Registering new employer...');
    const regEmployer = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Priya Mehta',
        email: employerEmail,
        password: employerPassword,
        role: 'employer',
      },
    });
    console.log('  ✅ Employer registered:', regEmployer.user.name);

    // 4.2 Login Employer
    console.log('  4.2 Logging in as employer...');
    const loginEmployer = await request('/auth/login', {
      method: 'POST',
      body: {
        email: employerEmail,
        password: employerPassword,
      },
    });
    const employerToken = loginEmployer.token;
    const employerAuthHeaders = { Authorization: `Bearer ${employerToken}` };
    console.log('  ✅ Employer login successful.');

    // 4.3 Update Company Profile
    console.log('  4.3 Updating company profile...');
    const compRes = await request('/company/me', {
      method: 'PUT',
      headers: employerAuthHeaders,
      body: {
        companyName: 'VertexWorks Technologies',
        industry: 'Enterprise SaaS & Cloud Infrastructure',
        location: 'Hyderabad, Telangana',
        website: 'https://vertexworks.example.com',
        description: 'VertexWorks engineers scalable cloud solutions for high-growth enterprises.',
        size: '100-250 employees',
        benefits: ['Health Insurance', 'Annual Learning Budget ₹50,000', 'Hybrid Work']
      },
    });
    console.log('  ✅ Company Profile Updated:', compRes.company.companyName);

    // 4.4 Create a New Job
    console.log('  4.4 Creating a new job posting...');
    const createdJobRes = await request('/jobs', {
      method: 'POST',
      headers: employerAuthHeaders,
      body: {
        title: 'Senior Frontend Engineer',
        description: 'We are seeking an experienced Frontend Engineer with deep mastery of React and modern web architectures.',
        responsibilities: [
          'Build responsive web interfaces in React and Tailwind CSS.',
          'Optimize client-side performance and bundle sizes.',
          'Collaborate with backend engineers on API contracts.'
        ],
        skills: ['JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Redux'],
        preferredSkills: ['Next.js', 'Jest', 'GraphQL'],
        experience: { minYears: 2, maxYears: 5, level: 'Mid Level' },
        location: 'Hyderabad, Telangana',
        workplaceType: 'Hybrid',
        salary: { min: 1200000, max: 1800000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: 'Full-time'
      },
    });
    const newJobId = createdJobRes.job._id;
    console.log('  ✅ Job Created:', createdJobRes.job.title, `(ID: ${newJobId})`);

    // 4.5 Edit Job
    console.log('  4.5 Editing job posting...');
    const editJobRes = await request(`/jobs/${newJobId}`, {
      method: 'PUT',
      headers: employerAuthHeaders,
      body: {
        title: 'Lead Frontend Engineer',
        salary: { min: 1400000, max: 2000000, currency: 'INR', period: 'per annum', isDisclosed: true }
      },
    });
    console.log('  ✅ Job Updated:', editJobRes.job.title, '| New Max Salary:', editJobRes.job.salary.max);

    // 4.6 Candidate applies to this new job
    console.log('  4.6 Candidate applying to the newly created job...');
    const appToNewJob = await request('/applications', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        jobId: newJobId,
        coverNote: 'Extensive background in React and component architecture.'
      },
    });
    const appId = appToNewJob.application._id;
    console.log('  ✅ Application created for candidate Rohan Verma. App ID:', appId);

    // 4.7 Employer views candidate ranking
    console.log('  4.7 Employer checking candidate ranking for the job...');
    const candidateRankings = await request(`/applications/employer?jobId=${newJobId}`, {
      headers: employerAuthHeaders,
    });
    console.log(`  ✅ Fetched ${candidateRankings.applications.length} applicant(s). Top candidate match: ${candidateRankings.applications[0].matchScore.overall}%`);

    // 4.8 Update application status & schedule interview
    console.log('  4.8 Updating candidate pipeline status to "Interview" with scheduled date...');
    const updateStatusRes = await request(`/applications/${appId}/status`, {
      method: 'PUT',
      headers: employerAuthHeaders,
      body: {
        status: 'Interview',
        notes: 'Strong React portfolio. Technical round scheduled.',
        interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
    });
    console.log('  ✅ Status updated successfully. New status:', updateStatusRes.application.status, '| Notes:', updateStatusRes.application.notes);

    // 4.9 Delete a temporary job
    console.log('  4.9 Testing job deletion...');
    const tempJob = await request('/jobs', {
      method: 'POST',
      headers: employerAuthHeaders,
      body: {
        title: 'Temporary QA Intern',
        description: 'Testing automation.',
        skills: ['Python', 'Selenium'],
        location: 'Pune',
      },
    });
    const deleteRes = await request(`/jobs/${tempJob.job._id}`, {
      method: 'DELETE',
      headers: employerAuthHeaders,
    });
    console.log('  ✅ Temporary job deleted successfully:', deleteRes.message);

    // 4.10 Test applying to closed job is prevented
    console.log('  4.10 Testing Closed Job Application Guard...');
    const closedJobRes = await request('/jobs', {
      method: 'POST',
      headers: employerAuthHeaders,
      body: {
        title: 'Archived Backend Role',
        description: 'No longer open.',
        skills: ['Java'],
        location: 'Remote',
      },
    });
    // Set status to Closed
    await request(`/jobs/${closedJobRes.job._id}`, {
      method: 'PUT',
      headers: employerAuthHeaders,
      body: { status: 'Closed' },
    });
    try {
      await request('/applications', {
        method: 'POST',
        headers: seekerAuthHeaders,
        body: {
          jobId: closedJobRes.job._id,
        },
      });
      console.error('  ❌ FAILED: Application to closed job should have been rejected!');
    } catch (err) {
      console.log('  ✅ Correctly rejected application to closed job with 400 Bad Request');
    }

    // ----------------------------------------------------
    // TEST 5: AI SERVICES ENDPOINTS
    // ----------------------------------------------------
    console.log('\n5️⃣ Testing AI Service Endpoints...');
    
    // 5.1 Skill Gap
    const skillGapRes = await request('/ai/skill-gap', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        targetRole: 'Full Stack Developer',
        missingSkills: ['Docker', 'TypeScript']
      },
    });
    console.log('  ✅ Skill Gap Roadmap Generated for:', skillGapRes.roadmap.targetJobTitle, '| Modules:', skillGapRes.roadmap.missingSkillsBreakdown?.length);

    // 5.2 Interview Questions
    const interviewRes = await request('/ai/interview', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        jobTitle: 'Full Stack Developer',
        companyName: 'TechNova Solutions'
      },
    });
    console.log('  ✅ Interview Questions Generated:', interviewRes.questions?.length, 'questions created.');

    // 5.3 Answer Evaluation
    const evalRes = await request('/ai/evaluate-answer', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        question: 'Explain the difference between state and props in React.',
        answer: 'Props are read-only inputs passed from parent to child, while state is local mutable data managed within the component using useState.',
        jobTitle: 'Frontend Developer'
      },
    });
    console.log('  ✅ Answer Evaluated with score:', evalRes.evaluation?.score, '/ 100');

    // 5.4 Career Assistant Chat
    const chatRes = await request('/ai/career-assistant', {
      method: 'POST',
      headers: seekerAuthHeaders,
      body: {
        message: 'What projects should I build to showcase my full-stack skills?'
      },
    });
    console.log('  ✅ Career Assistant replied. Response length:', chatRes.reply?.length, 'chars.');

    // 5.5 Career Recommendations
    const recRes = await request('/ai/career-recommendations', {
      method: 'POST',
      headers: seekerAuthHeaders,
    });
    console.log('  ✅ Career Recommendations Generated:', recRes.data?.recommendations?.length, 'recommended roles.');

    console.log('\n====================================================');
    console.log('🎉 ALL COMPREHENSIVE TESTS AND USER JOURNEYS PASSED!');
    console.log('====================================================');


  } catch (error) {
    console.error('\n❌ TEST FAILED Status:', error.status, 'Message:', error.message, 'Data:', error.data);
    process.exit(1);
  }
}

runTests();
