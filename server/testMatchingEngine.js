/**
 * SkillBridge AI — Smart Matching Engine Comprehensive Test Suite
 * 
 * Verifies all 12 specified test cases:
 * 1. Perfect skill match
 * 2. Partial skill match
 * 3. Missing required skills
 * 4. Missing preferred skills
 * 5. Fresh graduate
 * 6. Experienced candidate
 * 7. Remote job
 * 8. Different location
 * 9. Related skill names
 * 10. Unrelated skill names
 * 11. Empty candidate profile
 * 12. Empty job requirements
 */

const {
  calculateJobCompatibility,
  calculateSkillMatch,
  getCanonicalSkill,
  evaluateExperienceMatch,
  evaluateLocationMatch,
} = require('./services/matchingService');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ Passed: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ Failed: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING 12 SMART MATCHING ENGINE TEST CASES');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST CASE 1: Perfect Skill Match
// ----------------------------------------------------
console.log('1️⃣ Test Case 1: Perfect Skill Match');
const candidate1 = {
  profile: {
    skills: ['React', 'JavaScript', 'Git', 'Node.js', 'MongoDB'],
    experience: [{ title: 'Full Stack Dev', years: 2 }],
    education: [{ degree: 'B.Tech in Computer Science', institution: 'IIT' }],
    location: 'Bengaluru',
    preferredLocations: ['Bengaluru']
  }
};
const job1 = {
  title: 'Full Stack Engineer',
  skills: ['React', 'JavaScript', 'Git', 'Node.js', 'MongoDB'],
  preferredSkills: ['TypeScript'],
  experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
  location: 'Bengaluru',
  workplaceType: 'Hybrid'
};
const res1 = calculateJobCompatibility(candidate1, job1);
assert(res1.matchScore >= 85, `Perfect match score is high (Got: ${res1.matchScore}%)`);
assert(res1.matchedSkills.length === 5, `All 5 required skills matched (Got: ${res1.matchedSkills.length})`);
assert(res1.missingSkills.length === 0, `No missing required skills`);
assert(res1.experienceMatch.status === 'Meets requirement', `Experience meets requirement`);
assert(res1.locationMatch.status === 'Location preference match', `Location preference match`);

// ----------------------------------------------------
// TEST CASE 2: Partial Skill Match
// ----------------------------------------------------
console.log('\n2️⃣ Test Case 2: Partial Skill Match');
const candidate2 = {
  profile: {
    skills: ['Vue', 'Express', 'MySQL'], // Related category to React, Node.js, PostgreSQL
    experience: [{ title: 'Web Developer', years: 2 }]
  }
};
const job2 = {
  title: 'Frontend Developer',
  skills: ['React', 'Node.js', 'PostgreSQL'],
  experience: { minYears: 2, maxYears: 4 }
};
const res2 = calculateJobCompatibility(candidate2, job2);
assert(res2.partialSkills.length > 0, `Detected partial/related skills across framework clusters (Got: ${res2.partialSkills.join(', ')})`);
assert(res2.matchScore > 40 && res2.matchScore < 85, `Score is moderate for partial match (Got: ${res2.matchScore}%)`);

// ----------------------------------------------------
// TEST CASE 3: Missing Required Skills
// ----------------------------------------------------
console.log('\n3️⃣ Test Case 3: Missing Required Skills');
const candidate3 = {
  profile: {
    skills: ['HTML', 'CSS'],
    experience: []
  }
};
const job3 = {
  title: 'Senior Cloud Architect',
  skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Go'],
  experience: { minYears: 5, maxYears: 8 }
};
const res3 = calculateJobCompatibility(candidate3, job3);
assert(res3.missingSkills.length >= 4, `Identifies missing required skills (Got: ${res3.missingSkills.length})`);
assert(res3.matchScore <= 50, `Score is appropriately lowered for missing critical requirements (Got: ${res3.matchScore}%)`);
assert(res3.recommendations.length > 0, `Provides actionable learning recommendations for missing skills`);

// ----------------------------------------------------
// TEST CASE 4: Missing Preferred Skills
// ----------------------------------------------------
console.log('\n4️⃣ Test Case 4: Missing Preferred Skills');
const candidate4 = {
  profile: {
    skills: ['React', 'JavaScript', 'Git'],
    experience: [{ years: 2 }]
  }
};
const job4 = {
  title: 'React Developer',
  skills: ['React', 'JavaScript', 'Git'],
  preferredSkills: ['TypeScript', 'Jest'], // Missing preferred
  experience: { minYears: 1, maxYears: 3 }
};
const res4 = calculateJobCompatibility(candidate4, job4);
assert(res4.matchedSkills.length === 3, `All required skills matched`);
assert(res4.missingPreferredSkills.length === 2, `Missing preferred skills correctly categorized`);
assert(res4.matchScore >= 80, `Missing preferred skills does NOT penalize heavily (Got: ${res4.matchScore}%)`);

// ----------------------------------------------------
// TEST CASE 5: Fresh Graduate Candidate
// ----------------------------------------------------
console.log('\n5️⃣ Test Case 5: Fresh Graduate Candidate');
const candidate5 = {
  profile: {
    skills: ['JavaScript', 'React', 'Python'],
    experience: [], // 0 years
    education: [{ degree: 'B.Tech in Computer Science', graduationYear: 2025 }],
    projects: [{ title: 'AI Campus Portal', technologies: ['React', 'Python'] }]
  }
};
const job5 = {
  title: 'Graduate Software Engineer Intern',
  skills: ['JavaScript', 'React'],
  experience: { minYears: 0, maxYears: 1, level: 'Entry Level' },
  location: 'Hyderabad'
};
const res5 = calculateJobCompatibility(candidate5, job5);
assert(res5.experienceMatch.status === 'Suitable', `Identified as Suitable for Entry Level (Got: ${res5.experienceMatch.status})`);
assert(res5.matchScore >= 80, `Fresh graduate gets high compatibility on entry role (Got: ${res5.matchScore}%)`);
assert(res5.projectRelevance.hasRelevantProjects === true, `Projects counted as supporting evidence`);

// ----------------------------------------------------
// TEST CASE 6: Experienced Candidate
// ----------------------------------------------------
console.log('\n6️⃣ Test Case 6: Experienced Candidate');
const candidate6 = {
  profile: {
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    experience: [{ title: 'Senior Engineer', years: 6 }],
    education: [{ degree: 'M.Tech in Software Engineering' }]
  }
};
const job6 = {
  title: 'Senior Full Stack Lead',
  skills: ['React', 'Node.js', 'PostgreSQL'],
  experience: { minYears: 4, maxYears: 7 }
};
const res6 = calculateJobCompatibility(candidate6, job6);
assert(res6.experienceMatch.status === 'Meets requirement' || res6.experienceMatch.status === 'Exceeds requirement', `Experience meets senior requirement`);
assert(res6.matchScore >= 88, `Experienced candidate receives strong compatibility (Got: ${res6.matchScore}%)`);

// ----------------------------------------------------
// TEST CASE 7: Remote Job
// ----------------------------------------------------
console.log('\n7️⃣ Test Case 7: Remote Job');
const candidate7 = {
  profile: {
    skills: ['React', 'Node.js'],
    location: 'Vijayawada'
  }
};
const job7 = {
  title: 'React Engineer',
  skills: ['React', 'Node.js'],
  location: 'Anywhere (Remote)',
  workplaceType: 'Remote'
};
const res7 = calculateJobCompatibility(candidate7, job7);
assert(res7.locationMatch.status.includes('Remote'), `Remote role is marked as Strong Match (Remote)`);
assert(res7.locationMatch.score === 100, `Remote location receives full score (100)`);

// ----------------------------------------------------
// TEST CASE 8: Different Location (Mismatch without Auto-Rejection)
// ----------------------------------------------------
console.log('\n8️⃣ Test Case 8: Different Location (Mismatch without Auto-Rejection)');
const candidate8 = {
  profile: {
    skills: ['React', 'Node.js'],
    location: 'Vijayawada',
    preferredLocations: ['Vijayawada']
  }
};
const job8 = {
  title: 'React Engineer',
  skills: ['React', 'Node.js'],
  location: 'Bengaluru',
  workplaceType: 'On-site'
};
const res8 = calculateJobCompatibility(candidate8, job8);
assert(res8.locationMatch.status === 'Location mismatch', `Correctly flagged as Location mismatch`);
assert(res8.matchScore >= 60, `Candidate is NOT auto-rejected for location; skills still evaluated (Got: ${res8.matchScore}%)`);

// ----------------------------------------------------
// TEST CASE 9: Related Skill Names (Normalization Layer)
// ----------------------------------------------------
console.log('\n9️⃣ Test Case 9: Related Skill Names Normalization');
assert(getCanonicalSkill('JS') === 'javascript', 'JS normalizes to javascript');
assert(getCanonicalSkill('ECMAScript') === 'javascript', 'ECMAScript normalizes to javascript');
assert(getCanonicalSkill('React.js') === 'react', 'React.js normalizes to react');
assert(getCanonicalSkill('NodeJS') === 'nodejs', 'NodeJS normalizes to nodejs');
assert(getCanonicalSkill('Tailwind CSS') === 'tailwindcss', 'Tailwind CSS normalizes to tailwindcss');
assert(getCanonicalSkill('Postgres') === 'postgresql', 'Postgres normalizes to postgresql');
assert(getCanonicalSkill('K8s') === 'kubernetes', 'K8s normalizes to kubernetes');

const candidate9 = {
  profile: {
    skills: ['JS', 'ReactJS', 'NodeJS', 'Mongo', 'Tailwind CSS']
  }
};
const job9 = {
  title: 'Full Stack Engineer',
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TailwindCSS']
};
const res9 = calculateJobCompatibility(candidate9, job9);
assert(res9.matchedSkills.length === 5, `All 5 synonym skills mapped directly to canonical requirements (Got: ${res9.matchedSkills.length})`);

// ----------------------------------------------------
// TEST CASE 10: Unrelated Skill Names (Strict Distinction)
// ----------------------------------------------------
console.log('\n🔟 Test Case 10: Unrelated Skill Names (Strict Distinction)');
assert(getCanonicalSkill('Java') !== getCanonicalSkill('JavaScript'), 'Java ≠ JavaScript');
assert(getCanonicalSkill('Python') !== getCanonicalSkill('PyTorch'), 'Python ≠ PyTorch');
assert(getCanonicalSkill('React') !== getCanonicalSkill('React Native'), 'React ≠ React Native');
assert(getCanonicalSkill('C') !== getCanonicalSkill('C++'), 'C ≠ C++');
assert(getCanonicalSkill('C++') !== getCanonicalSkill('C#'), 'C++ ≠ C#');

const candidate10 = {
  profile: {
    skills: ['Java', 'Python', 'React'] // Does NOT have JavaScript, PyTorch, React Native
  }
};
const job10 = {
  title: 'Mobile & AI Engineer',
  skills: ['JavaScript', 'PyTorch', 'React Native']
};
const res10 = calculateJobCompatibility(candidate10, job10);
assert(res10.matchedSkills.length === 0, `Distinct technologies are not false-matched (Matched: ${res10.matchedSkills.length})`);

// ----------------------------------------------------
// TEST CASE 11: Empty Candidate Profile
// ----------------------------------------------------
console.log('\n1️⃣1️⃣ Test Case 11: Empty Candidate Profile');
const candidate11 = { profile: {} };
const job11 = {
  title: 'Backend Engineer',
  skills: ['Node.js', 'PostgreSQL']
};
const res11 = calculateJobCompatibility(candidate11, job11);
assert(typeof res11.matchScore === 'number', `Handles empty candidate profile gracefully with numeric score`);
assert(res11.missingSkills.length === 2, `Identifies missing skills`);
assert(res11.disclaimer.includes('AI compatibility estimate'), `Includes required disclaimer`);

// ----------------------------------------------------
// TEST CASE 12: Empty Job Requirements
// ----------------------------------------------------
console.log('\n1️⃣2️⃣ Test Case 12: Empty Job Requirements');
const candidate12 = {
  profile: {
    skills: ['JavaScript', 'React']
  }
};
const job12 = {
  title: 'General Technical Trainee',
  skills: []
};
const res12 = calculateJobCompatibility(candidate12, job12);
assert(typeof res12.matchScore === 'number', `Handles empty job skills without division by zero or NaN`);
assert(res12.matchedSkills.length === 0, `Matched skills is empty array`);

console.log('\n====================================================');
console.log(`🎉 ALL ${passedTests} OF ${totalTests} ASSERTIONS IN 12 TEST CASES PASSED WITH 100% SUCCESS!`);
console.log('====================================================\n');
