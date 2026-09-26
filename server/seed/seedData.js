const bcrypt = require('bcryptjs');

const defaultPasswordHash = bcrypt.hashSync('password123', 10);

const companies = [
  {
    _id: '66a111111111111111111101',
    employerId: '66b222222222222222222201',
    companyName: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    industry: 'Enterprise Software & Cloud Platforms',
    location: 'Bengaluru, Karnataka',
    website: 'https://technova.example.com',
    description: 'TechNova Solutions builds scalable enterprise web applications, cloud infrastructure management systems, and microservices for high-growth tech firms.',
    size: '250–500 employees',
    founded: '2019',
    benefits: ['Health and accidental coverage', 'Hybrid work flexibility (2 days remote)', 'Annual learning budget ₹40,000', 'Performance-linked annual bonus', 'Provident Fund & Gratuity']
  },
  {
    _id: '66a111111111111111111102',
    employerId: '66b222222222222222222202',
    companyName: 'DataBridge Labs',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    industry: 'Data Intelligence & Machine Learning',
    location: 'Hyderabad, Telangana',
    website: 'https://databridgelabs.example.com',
    description: 'DataBridge Labs develops data processing pipelines, predictive analytics engines, and applied language models for logistics and commerce businesses.',
    size: '100–250 employees',
    founded: '2021',
    benefits: ['Dedicated cloud compute budget', 'Flexible working hours', 'Medical insurance for dependents', 'Relocation assistance', 'Technical conference sponsorship']
  },
  {
    _id: '66a111111111111111111103',
    employerId: '66b222222222222222222203',
    companyName: 'FinEdge Labs',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    industry: 'Financial Technology & Payments',
    location: 'Mumbai, Maharashtra',
    website: 'https://finedgelabs.example.com',
    description: 'FinEdge Labs delivers modern reconciliation services, digital payment routing infrastructure, and merchant settlement systems.',
    size: '500+ employees',
    founded: '2018',
    benefits: ['Competitive equity / ESOPs', 'Comprehensive OPD coverage', 'Office commute allowance', 'Catered meals in office', 'Wellness stipend']
  },
  {
    _id: '66a111111111111111111104',
    employerId: '66b222222222222222222204',
    companyName: 'CloudNest Technologies',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    industry: 'Cloud Infrastructure & DevOps',
    location: 'Pune, Maharashtra',
    website: 'https://cloudnest.example.com',
    description: 'CloudNest Technologies provides automated cloud configuration audits, container orchestration, and continuous integration pipelines.',
    size: '50–150 employees',
    founded: '2022',
    benefits: ['Home office setup allowance ₹30,000', 'Annual team retreats', 'Flexible paid time off', 'Parental leave', 'Cloud certification reimbursements']
  },
  {
    _id: '66a111111111111111111105',
    employerId: '66b222222222222222222205',
    companyName: 'NextWave Digital',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    industry: 'Digital Product Engineering',
    location: 'Visakhapatnam & Vijayawada, Andhra Pradesh',
    website: 'https://nextwavedigital.example.com',
    description: 'NextWave Digital designs accessible public digital tools, municipal service portals, and responsive web platforms.',
    size: '80–200 employees',
    founded: '2020',
    benefits: ['Term insurance coverage', 'Quarterly performance incentives', 'Mentorship from lead architects', 'Fast-track career advancement']
  },
  {
    _id: '66a111111111111111111106',
    employerId: '66b222222222222222222201',
    companyName: 'BlueOrbit Systems',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    industry: 'Enterprise SaaS & Analytics',
    location: 'Chennai, Tamil Nadu',
    website: 'https://blueorbit.example.com',
    description: 'BlueOrbit Systems builds workflow automation engines and customer communication systems for mid-market service firms.',
    size: '150–300 employees',
    founded: '2019',
    benefits: ['Comprehensive family healthcare', 'Hybrid scheduling', 'Internet & phone allowance', 'Annual performance appraisal']
  },
  {
    _id: '66a111111111111111111107',
    employerId: '66b222222222222222222201',
    companyName: 'CodeCraft Technologies',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    industry: 'Full Stack Software Services',
    location: 'Delhi NCR, India',
    website: 'https://codecraft.example.com',
    description: 'CodeCraft Technologies designs high-throughput backend APIs and performant frontend architectures for growing digital startups.',
    size: '100–200 employees',
    founded: '2021',
    benefits: ['Gym membership allowance', 'Flexible timing', 'Sponsored technical workshops', 'Health insurance']
  },
  {
    _id: '66a111111111111111111108',
    employerId: '66b222222222222222222201',
    companyName: 'VertexWorks',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    industry: 'Design Engineering & Interactive Products',
    location: 'Hyderabad, Telangana',
    website: 'https://vertexworks.example.com',
    description: 'VertexWorks creates human-centered SaaS interfaces, design systems, and web applications for global software teams.',
    size: '40–100 employees',
    founded: '2022',
    benefits: ['Equipment setup budget', 'Bi-annual performance reviews', 'Flexible remote options', 'Group medical policy']
  }
];

const employers = [
  {
    _id: '66b222222222222222222201',
    name: 'Priya Nambiar',
    email: 'recruiter@technova.demo',
    passwordHash: defaultPasswordHash,
    role: 'employer',
    companyId: '66a111111111111111111101',
    profile: {
      headline: 'Technical Recruiter @ TechNova Solutions',
      phone: '+91 98111 22334',
      location: 'Bengaluru, Karnataka',
      bio: 'Managing hiring for frontend, backend, and full-stack engineering roles at TechNova Solutions.',
      skills: ['Technical Recruiting', 'Talent Sourcing', 'Engineering Hiring'],
    }
  },
  {
    _id: '66b222222222222222222202',
    name: 'Karthik Varma',
    email: 'hiring@databridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'employer',
    companyId: '66a111111111111111111102',
    profile: {
      headline: 'Engineering Hiring Lead @ DataBridge Labs',
      phone: '+91 98222 33445',
      location: 'Hyderabad, Telangana',
      bio: 'Recruiting machine learning practitioners, data engineers, and backend developers for DataBridge Labs.',
      skills: ['Engineering Hiring', 'Team Building', 'Technical Assessment'],
    }
  }
];

const candidates = [
  {
    _id: '66c333333333333333333301',
    name: 'Aarav Sharma',
    email: 'aarav@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Frontend & Full Stack Developer | React, Node.js, Express, MongoDB',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      bio: 'Software developer with practical experience building responsive web applications using React, Tailwind CSS, and Node.js. Focused on clean architecture, API design, and web performance.',
      skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'REST APIs'],
      preferredJobRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune', 'Remote'],
      expectedSalary: { min: 600000, max: 1000000, currency: 'INR' },
      github: 'https://github.com/aarav-sharma-demo',
      linkedin: 'https://linkedin.com/in/aarav-sharma-demo',
      education: [
        {
          degree: 'B.Tech in Computer Science and Engineering',
          fieldOfStudy: 'Computer Science',
          institution: 'Vellore Institute of Technology (VIT)',
          graduationYear: '2025',
          gpa: '8.8 / 10.0'
        }
      ],
      experience: [
        {
          title: 'Web Developer Intern',
          company: 'CodeCraft Technologies',
          location: 'Bengaluru',
          startDate: 'May 2024',
          endDate: 'Aug 2024',
          current: false,
          description: 'Built modular UI components in React and Tailwind CSS. Implemented REST API routes in Node.js and reduced client bundle size by 28%.',
          skillsUsed: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS']
        }
      ],
      projects: [
        {
          title: 'SkillBridge Career Platform',
          description: 'A web platform that matches candidates with relevant opportunities, explains match criteria, and provides structured interview practice.',
          technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
          liveUrl: 'https://skillbridge-demo.example.com',
          githubUrl: 'https://github.com/aarav-sharma-demo/skillbridge'
        },
        {
          title: 'Telemetry Dashboard',
          description: 'A real-time dashboard visualizing server health metrics, memory usage, and response latency.',
          technologies: ['React', 'Node.js', 'Redis', 'Chart.js'],
          githubUrl: 'https://github.com/aarav-sharma-demo/telemetry'
        }
      ],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2024' },
        { name: 'Meta Front-End Developer Certificate', issuer: 'Coursera / Meta', issueDate: '2023' }
      ]
    }
  },
  {
    _id: '66c333333333333333333302',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Data Scientist & ML Developer | Python, PyTorch, SQL, Pandas',
      phone: '+91 97654 32109',
      location: 'Hyderabad, Telangana',
      bio: 'Graduate engineer specializing in applied machine learning, data processing pipelines, and REST inference APIs using Python.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-Learn', 'SQL', 'FastAPI'],
      preferredJobRoles: ['AI/ML Intern', 'Data Analyst', 'Machine Learning Engineer'],
      preferredLocations: ['Hyderabad', 'Bengaluru', 'Remote'],
      expectedSalary: { min: 700000, max: 1200000, currency: 'INR' },
      github: 'https://github.com/ananya-reddy-demo',
      linkedin: 'https://linkedin.com/in/ananya-reddy-demo',
      education: [
        {
          degree: 'B.Tech in Artificial Intelligence & Data Science',
          institution: 'IIIT Hyderabad',
          graduationYear: '2024',
          gpa: '9.1 / 10.0'
        }
      ],
      experience: [
        {
          title: 'Machine Learning Intern',
          company: 'DataBridge Labs',
          location: 'Hyderabad',
          startDate: 'Jan 2024',
          endDate: 'Jun 2024',
          current: false,
          description: 'Developed text processing pipelines and built inference microservices using FastAPI and SQLite.',
          skillsUsed: ['Python', 'FastAPI', 'Pandas', 'PyTorch']
        }
      ],
      projects: [
        {
          title: 'Document Intelligence Pipeline',
          description: 'Automated document classification and text summarization system with batch processing support.',
          technologies: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
          githubUrl: 'https://github.com/ananya-reddy-demo/doc-intel'
        }
      ],
      certifications: [
        { name: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', issueDate: '2023' }
      ]
    }
  },
  {
    _id: '66c333333333333333333303',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Frontend Engineer | React, TypeScript, Next.js & Tailwind CSS',
      phone: '+91 96543 21098',
      location: 'Pune, Maharashtra',
      bio: 'Frontend developer focused on building accessible, responsive, and performance-optimized user interfaces.',
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Redux', 'CSS3', 'Jest', 'Git'],
      preferredJobRoles: ['Frontend Developer', 'Software Engineer'],
      preferredLocations: ['Pune', 'Mumbai', 'Bengaluru', 'Remote'],
      expectedSalary: { min: 700000, max: 1100000, currency: 'INR' },
      education: [
        {
          degree: 'B.E. in Information Technology',
          institution: 'COEP Technological University, Pune',
          graduationYear: '2024',
          gpa: '8.6 / 10.0'
        }
      ]
    }
  },
  {
    _id: '66c333333333333333333304',
    name: 'Divya Srikanth',
    email: 'divya.srikanth@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Backend Developer | Node.js, PostgreSQL & API Architecture',
      phone: '+91 95432 10987',
      location: 'Chennai, Tamil Nadu',
      bio: 'Specializing in relational database modeling, caching, and scalable REST API development with Node.js and PostgreSQL.',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST APIs', 'Git'],
      preferredJobRoles: ['Backend Developer', 'Software Engineer'],
      preferredLocations: ['Chennai', 'Bengaluru', 'Hyderabad'],
      expectedSalary: { min: 750000, max: 1200000, currency: 'INR' },
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'Anna University, Chennai',
          graduationYear: '2024',
          gpa: '8.9 / 10.0'
        }
      ]
    }
  },
  {
    _id: '66c333333333333333333305',
    name: 'Sai Krishna Chunduru',
    email: 'saikrishna@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Software Engineer | Java, Spring Boot, React & SQL',
      phone: '+91 94321 09876',
      location: 'Vijayawada, Andhra Pradesh',
      bio: 'Junior software engineer with practical knowledge of Java/Spring Boot enterprise backends and React web clients.',
      skills: ['Java', 'Spring Boot', 'React', 'JavaScript', 'SQL', 'MySQL', 'Git'],
      preferredJobRoles: ['Software Engineer', 'Full Stack Developer'],
      preferredLocations: ['Vijayawada', 'Hyderabad', 'Bengaluru', 'Visakhapatnam'],
      expectedSalary: { min: 500000, max: 800000, currency: 'INR' },
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'K L University, Vijayawada',
          graduationYear: '2025',
          gpa: '8.7 / 10.0'
        }
      ]
    }
  },
  {
    _id: '66c333333333333333333306',
    name: 'Harika Varma',
    email: 'harika.varma@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'UI/UX Designer | Figma, Wireframing, Design Systems & HTML/CSS',
      phone: '+91 93210 98765',
      location: 'Visakhapatnam, Andhra Pradesh',
      bio: 'Product designer experienced in turning workflow requirements into clear, functional web interfaces and reusable design components in Figma.',
      skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research', 'HTML5', 'CSS3'],
      preferredJobRoles: ['UI/UX Designer', 'Product Designer'],
      preferredLocations: ['Visakhapatnam', 'Hyderabad', 'Bengaluru', 'Remote'],
      expectedSalary: { min: 550000, max: 900000, currency: 'INR' },
      education: [
        {
          degree: 'B.Des in Interaction Design',
          institution: 'Andhra University, Visakhapatnam',
          graduationYear: '2024',
          gpa: '8.9 / 10.0'
        }
      ]
    }
  },
  {
    _id: '66c333333333333333333307',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Data Analyst | SQL, PowerBI, Python & Excel',
      phone: '+91 92109 87654',
      location: 'Delhi NCR, India',
      bio: 'Data analyst skilled in writing SQL aggregation queries, building interactive reporting dashboards in PowerBI, and basic Python data manipulation.',
      skills: ['SQL', 'Python', 'PowerBI', 'Excel', 'Pandas', 'Data Visualization'],
      preferredJobRoles: ['Data Analyst', 'Business Analyst'],
      preferredLocations: ['Delhi NCR', 'Bengaluru', 'Remote'],
      expectedSalary: { min: 550000, max: 850000, currency: 'INR' },
      education: [
        {
          degree: 'B.Sc in Statistics & Data Science',
          institution: 'Delhi University',
          graduationYear: '2024',
          gpa: '8.5 / 10.0'
        }
      ]
    }
  },
  {
    _id: '66c333333333333333333308',
    name: 'Kavya Pillai',
    email: 'kavya.pillai@skillbridge.demo',
    passwordHash: defaultPasswordHash,
    role: 'jobseeker',
    profile: {
      headline: 'Cloud & DevOps Intern | AWS, Linux, Docker, GitHub Actions',
      phone: '+91 91098 76543',
      location: 'Bengaluru, Karnataka',
      bio: 'Enthusiastic cloud engineer with foundational skills in Linux administration, Docker containerization, and automated deployment scripting.',
      skills: ['AWS', 'Linux', 'Docker', 'Git', 'GitHub Actions', 'Python', 'Bash'],
      preferredJobRoles: ['Cloud Intern', 'DevOps Engineer', 'Software Engineer'],
      preferredLocations: ['Bengaluru', 'Chennai', 'Hyderabad'],
      expectedSalary: { min: 600000, max: 950000, currency: 'INR' },
      education: [
        {
          degree: 'B.Tech in Information Science',
          institution: 'PES University, Bengaluru',
          graduationYear: '2025',
          gpa: '9.0 / 10.0'
        }
      ]
    }
  }
];

const jobs = [
  {
    _id: '66d444444444444444444401',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111101',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    title: 'Frontend Developer',
    description: 'TechNova Solutions is looking for a Frontend Developer to build clean, responsive user interfaces for our enterprise cloud platform. You will collaborate with backend engineers and product designers to deliver reliable, modular web components.',
    responsibilities: [
      'Build and maintain client-side components using React and modern JavaScript.',
      'Collaborate with designers to convert Figma mockups into clean, responsive layouts.',
      'Improve client load performance and maintain web accessibility standards.',
      'Write unit tests and participate in regular code reviews.'
    ],
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'Redux', 'Jest'],
    experience: { minYears: 1, maxYears: 2, level: 'Entry Level' },
    education: "Bachelor's Degree in Computer Science, IT, or equivalent practical experience",
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    salary: { min: 600000, max: 900000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 14,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444402',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111101',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    title: 'Full Stack Developer',
    description: 'We are hiring a Full Stack Developer to build end-to-end features across our React web applications and Node.js backend services. You will design database models, implement REST endpoints, and ensure smooth data flow across services.',
    responsibilities: [
      'Develop RESTful endpoints in Node.js with Express.',
      'Build interactive user interfaces in React.',
      'Maintain database schemas and queries in MongoDB and PostgreSQL.',
      'Coordinate with the engineering team during sprint planning and releases.'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Redis'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'B.Tech / B.E. in Computer Science or related degree',
    location: 'Hyderabad, Telangana',
    workplaceType: 'Hybrid',
    salary: { min: 800000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 22,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444403',
    employerId: '66b222222222222222222202',
    companyId: '66a111111111111111111102',
    companyName: 'DataBridge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    title: 'AI/ML Intern',
    description: 'DataBridge Labs is offering an internship for students or recent graduates interested in data pipelines, applied machine learning, and model evaluation.',
    responsibilities: [
      'Prepare and clean structured datasets for machine learning tasks.',
      'Implement evaluation benchmarks for classification and regression models.',
      'Build basic inference endpoints using Python and FastAPI.',
      'Document experimentation results and test data processing scripts.'
    ],
    skills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'PyTorch'],
    preferredSkills: ['FastAPI', 'SQL', 'Docker', 'Git'],
    experience: { minYears: 0, maxYears: 1, level: 'Internship' },
    education: 'Pursuing or completed degree in AI, Data Science, CSE, or related discipline',
    location: 'Hyderabad, Telangana',
    workplaceType: 'On-site',
    salary: { min: 400000, max: 600000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Internship',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 31,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444404',
    employerId: '66b222222222222222222202',
    companyId: '66a111111111111111111102',
    companyName: 'DataBridge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    title: 'Backend Developer',
    description: 'Join DataBridge Labs to build scalable backend services for data processing pipelines and API routing.',
    responsibilities: [
      'Design and maintain backend services in Node.js or Python.',
      'Implement authentication, rate limiting, and input validation.',
      'Write optimized database queries in PostgreSQL and MongoDB.',
      'Write automated integration tests for core API endpoints.'
    ],
    skills: ['Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs', 'Git'],
    preferredSkills: ['Python', 'Docker', 'Redis', 'PostgreSQL'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'B.Tech in Computer Science or equivalent practical experience',
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    salary: { min: 800000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 19,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444405',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111103',
    companyName: 'FinEdge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    title: 'Data Analyst',
    description: 'FinEdge Labs is seeking a Data Analyst to extract business intelligence from transaction metrics, create dashboard reports, and support product decision-making.',
    responsibilities: [
      'Write SQL queries to aggregate transaction and usage metrics.',
      'Build and maintain operational dashboards in PowerBI.',
      'Conduct exploratory data analysis using Python and Pandas.',
      'Present weekly performance summaries to product and operations teams.'
    ],
    skills: ['SQL', 'Python', 'PowerBI', 'Excel', 'Data Visualization'],
    preferredSkills: ['Pandas', 'Statistics', 'Tableau'],
    experience: { minYears: 1, maxYears: 2, level: 'Entry Level' },
    education: 'Degree in Statistics, Mathematics, Computer Science, or Economics',
    location: 'Mumbai, Maharashtra',
    workplaceType: 'Hybrid',
    salary: { min: 600000, max: 900000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 16,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444406',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111104',
    companyName: 'CloudNest Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    title: 'Software Engineer',
    description: 'CloudNest Technologies is hiring a Software Engineer to work on our cloud monitoring tools, system metrics collection agents, and administrative web consoles.',
    responsibilities: [
      'Implement backend services and background worker scripts.',
      'Maintain automated build and deployment pipelines.',
      'Debug performance bottlenecks and optimize database reads.',
      'Collaborate with senior engineers on system design.'
    ],
    skills: ['JavaScript', 'Node.js', 'SQL', 'Git', 'REST APIs'],
    preferredSkills: ['Java', 'Docker', 'Linux', 'AWS'],
    experience: { minYears: 1, maxYears: 3, level: 'Entry Level' },
    education: 'B.E. / B.Tech in CSE / IT / ECE',
    location: 'Pune, Maharashtra',
    workplaceType: 'Hybrid',
    salary: { min: 800000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 18,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444407',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111105',
    companyName: 'NextWave Digital',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    title: 'UI/UX Designer',
    description: 'NextWave Digital is looking for a UI/UX Designer to create intuitive user workflows for web portals and mobile applications.',
    responsibilities: [
      'Conduct user interviews and synthesize workflow requirements.',
      'Design wireframes, user flows, and interactive mockups in Figma.',
      'Maintain the core design system and component guidelines.',
      'Work with frontend developers during UI implementation and QA.'
    ],
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research'],
    preferredSkills: ['HTML5', 'CSS3', 'Design Systems'],
    experience: { minYears: 1, maxYears: 2, level: 'Entry Level' },
    education: 'Degree or Diploma in Design, Computer Science, or related field',
    location: 'Visakhapatnam, Andhra Pradesh',
    workplaceType: 'Hybrid',
    salary: { min: 550000, max: 850000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 11,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444408',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111105',
    companyName: 'NextWave Digital',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    title: 'Cloud Intern',
    description: 'An internship opportunity for students and early career engineers to learn cloud provisioning, containerization, and basic CI/CD configuration on AWS.',
    responsibilities: [
      'Assist in provisioning cloud compute and storage instances.',
      'Containerize sample application components using Docker.',
      'Assist with basic deployment scripts in GitHub Actions.',
      'Review server logs and assist in identifying configuration errors.'
    ],
    skills: ['AWS', 'Linux', 'Docker', 'Git'],
    preferredSkills: ['Python', 'GitHub Actions', 'Bash'],
    experience: { minYears: 0, maxYears: 1, level: 'Internship' },
    education: 'Pursuing or completed B.Tech / MCA / B.Sc in Computer Science',
    location: 'Vijayawada, Andhra Pradesh',
    workplaceType: 'On-site',
    salary: { min: 400000, max: 600000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Internship',
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 25,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444409',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111106',
    companyName: 'BlueOrbit Systems',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    title: 'Full Stack Developer',
    description: 'BlueOrbit Systems is hiring a Full Stack Developer to build workflow automation dashboards and integrations for our business clients.',
    responsibilities: [
      'Develop interactive frontend modules in React.',
      'Build secure REST APIs in Node.js and Express.',
      'Write optimized database queries in SQL and PostgreSQL.',
      'Participate in sprint demos and technical reviews.'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'PostgreSQL', 'Docker'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'B.Tech in Computer Science or related degree',
    location: 'Chennai, Tamil Nadu',
    workplaceType: 'Hybrid',
    salary: { min: 800000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 17,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444410',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111107',
    companyName: 'CodeCraft Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    title: 'Software Engineer',
    description: 'CodeCraft Technologies is seeking an early-career Software Engineer to build client web modules, test API integrations, and contribute to production services.',
    responsibilities: [
      'Implement frontend UI components and connect them to backend endpoints.',
      'Write clean, maintainable JavaScript/TypeScript code.',
      'Assist in debugging defects and improving test coverage.',
      'Participate in daily standups and sprint planning.'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'Git'],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'SQL'],
    experience: { minYears: 0, maxYears: 2, level: 'Entry Level' },
    education: 'B.Tech in CSE / IT or equivalent',
    location: 'Delhi NCR, India',
    workplaceType: 'Remote',
    salary: { min: 600000, max: 900000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 42,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444411',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111108',
    companyName: 'VertexWorks',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    title: 'React Developer',
    description: 'VertexWorks is hiring a React Developer to construct component libraries, responsive UI dashboards, and performant web features for enterprise clients.',
    responsibilities: [
      'Architect modular React components with TypeScript and Tailwind CSS.',
      'Manage client state using React Context and Redux Toolkit.',
      'Ensure high standards of cross-browser rendering and mobile responsiveness.',
      'Collaborate with UX designers to refine interaction fidelity.'
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Redux', 'Next.js', 'Jest', 'Figma'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'Bachelor’s degree in Computer Science, IT, or related engineering discipline',
    location: 'Hyderabad, Telangana',
    workplaceType: 'Hybrid',
    salary: { min: 700000, max: 1100000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444412',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111107',
    companyName: 'CodeCraft Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    title: 'Node.js Developer',
    description: 'We are looking for a Node.js Developer to build microservices, handle database concurrency, and maintain secure RESTful APIs.',
    responsibilities: [
      'Design and deploy asynchronous event-driven REST APIs with Express and Node.js.',
      'Optimize database queries and indexing in MongoDB and PostgreSQL.',
      'Implement JWT authentication, role checks, and request rate limiters.',
      'Write integration tests and maintain CI/CD pipeline stages.'
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    preferredSkills: ['TypeScript', 'Redis', 'Docker', 'PostgreSQL'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'B.Tech / B.E. in Computer Science, Software Engineering, or equivalent',
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    salary: { min: 850000, max: 1300000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 20,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444413',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111106',
    companyName: 'BlueOrbit Systems',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    title: 'Python Developer',
    description: 'BlueOrbit Systems is hiring a Python Developer to build data extraction tools, automation scripts, and Django web services for client workflows.',
    responsibilities: [
      'Write clean, modular Python code for web services and background batch jobs.',
      'Integrate third-party REST APIs and handle data transformations with Pandas.',
      'Implement relational schemas and query optimizations in PostgreSQL.',
      'Collaborate on containerized service packaging with Docker.'
    ],
    skills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'REST APIs', 'Git'],
    preferredSkills: ['FastAPI', 'Pandas', 'Docker', 'Linux'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'Bachelor’s degree in Computer Science, IT, or related technical discipline',
    location: 'Chennai, Tamil Nadu',
    workplaceType: 'Hybrid',
    salary: { min: 700000, max: 1100000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 13,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444414',
    employerId: '66b222222222222222222202',
    companyId: '66a111111111111111111102',
    companyName: 'DataBridge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    title: 'Data Analyst',
    description: 'DataBridge Labs is seeking a Data Analyst in Hyderabad to build analytics dashboards, run exploratory queries, and deliver data summaries for engineering leads.',
    responsibilities: [
      'Write complex SQL queries, views, and aggregations across operational tables.',
      'Build executive summary dashboards in Tableau and PowerBI.',
      'Perform data cleansing and transformation using Python and Pandas.',
      'Present metrics and insights during sprint reviews.'
    ],
    skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Pandas'],
    preferredSkills: ['PowerBI', 'PostgreSQL', 'Statistics'],
    experience: { minYears: 1, maxYears: 2, level: 'Entry Level' },
    education: 'Degree in Statistics, Mathematics, Data Science, or Computer Science',
    location: 'Hyderabad, Telangana',
    workplaceType: 'Hybrid',
    salary: { min: 600000, max: 950000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 17,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444415',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111104',
    companyName: 'CloudNest Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    title: 'Cloud Engineer',
    description: 'CloudNest Technologies is seeking a Cloud Engineer to automate infrastructure provisioning, configure Kubernetes clusters, and monitor containerized workloads.',
    responsibilities: [
      'Manage AWS cloud resources including VPCs, EC2, ECS, and S3.',
      'Deploy and scale containerized services with Docker and Kubernetes.',
      'Implement infrastructure-as-code templates using Terraform.',
      'Monitor application latency and uptime using CloudWatch and Prometheus.'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'Git'],
    preferredSkills: ['Python', 'CI/CD', 'Prometheus', 'Bash'],
    experience: { minYears: 2, maxYears: 4, level: 'Mid Level' },
    education: 'B.Tech / B.E. in Computer Science, IT, or Cloud Computing',
    location: 'Pune, Maharashtra',
    workplaceType: 'Hybrid',
    salary: { min: 900000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 14,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444416',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111106',
    companyName: 'BlueOrbit Systems',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    title: 'DevOps Intern',
    description: 'BlueOrbit Systems is offering a DevOps Internship to help fresh engineers master continuous delivery pipelines, Docker builds, and Linux server operations.',
    responsibilities: [
      'Maintain GitHub Actions workflows for automated testing and linting.',
      'Write Dockerfiles for microservices and optimize layer caching.',
      'Assist in configuring reverse proxies and SSL certificates on Linux.',
      'Document deployment checklists and environment variable management.'
    ],
    skills: ['Linux', 'Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Bash'],
    preferredSkills: ['AWS', 'Python', 'Nginx'],
    experience: { minYears: 0, maxYears: 1, level: 'Internship' },
    education: 'Pursuing or completed degree in CSE, IT, or related discipline',
    location: 'Chennai, Tamil Nadu',
    workplaceType: 'Hybrid',
    salary: { min: 400000, max: 600000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Internship',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 28,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444417',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111108',
    companyName: 'VertexWorks',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    title: 'UI/UX Designer',
    description: 'Join VertexWorks in Hyderabad to design responsive enterprise design systems, accessibility-tested components, and intuitive SaaS dashboards.',
    responsibilities: [
      'Design modular UI components, tokens, and layouts in Figma.',
      'Develop interactive prototypes and run usability testing sessions.',
      'Document design system specs and spacing tokens for engineering handoff.',
      'Ensure WCAG AA accessibility compliance across mobile and web.'
    ],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping'],
    preferredSkills: ['User Research', 'HTML5', 'CSS3', 'Tailwind CSS'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'Degree in Interaction Design, Digital Product Design, or related field',
    location: 'Hyderabad, Telangana',
    workplaceType: 'Hybrid',
    salary: { min: 650000, max: 1000000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 9,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444418',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111101',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    title: 'QA Engineer',
    description: 'TechNova Solutions is hiring a QA Engineer to automate end-to-end regression suites, test REST API endpoints, and maintain quality benchmarks.',
    responsibilities: [
      'Write and maintain automated UI tests in Cypress or Selenium.',
      'Design test scenarios and execute comprehensive API tests with Postman.',
      'Track defects, reproduce customer issues, and verify fixes.',
      'Participate in sprint release sign-offs.'
    ],
    skills: ['Selenium', 'JavaScript', 'Postman', 'API Testing', 'Jest', 'Git'],
    preferredSkills: ['Cypress', 'SQL', 'CI/CD', 'Python'],
    experience: { minYears: 1, maxYears: 3, level: 'Mid Level' },
    education: 'B.Tech in CSE / IT or equivalent degree',
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    salary: { min: 550000, max: 850000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 16,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444419',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111104',
    companyName: 'CloudNest Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    title: 'QA Engineer',
    description: 'CloudNest Technologies is looking for a QA Automation Engineer to lead API regression testing and test framework development.',
    responsibilities: [
      'Develop end-to-end browser test suites with Cypress and JavaScript.',
      'Automate API test validation and performance checks with Postman.',
      'Integrate test runners into GitHub Actions pipelines.',
      'Collaborate with developers to improve testability and code coverage.'
    ],
    skills: ['Cypress', 'JavaScript', 'Postman', 'API Testing', 'SQL', 'Git'],
    preferredSkills: ['Docker', 'Node.js', 'GitHub Actions'],
    experience: { minYears: 1, maxYears: 3, level: 'Entry Level' },
    education: 'Bachelor’s degree in Computer Science, Engineering, or relevant technical domain',
    location: 'Pune, Maharashtra',
    workplaceType: 'Remote',
    salary: { min: 600000, max: 900000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 19,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444420',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111103',
    companyName: 'FinEdge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    title: 'Cybersecurity Intern',
    description: 'FinEdge Labs is offering a Cybersecurity Internship to support vulnerability assessments, log analysis, and secure code review practices.',
    responsibilities: [
      'Assist in vulnerability scanning and security audits across web endpoints.',
      'Review authentication logs and identify suspicious network activity.',
      'Apply OWASP security benchmarks and document remediation steps.',
      'Assist in drafting internal security and compliance policies.'
    ],
    skills: ['Network Security', 'Linux', 'Python', 'Vulnerability Assessment', 'OWASP'],
    preferredSkills: ['Git', 'Wireshark', 'Bash'],
    experience: { minYears: 0, maxYears: 1, level: 'Internship' },
    education: 'Pursuing degree in Information Security, Computer Science, or Cyber Forensics',
    location: 'Mumbai, Maharashtra',
    workplaceType: 'On-site',
    salary: { min: 450000, max: 650000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Internship',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 22,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444421',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111105',
    companyName: 'NextWave Digital',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    title: 'Software Engineer',
    description: 'NextWave Digital is hiring a Junior Software Engineer to build Java enterprise backends and municipal digital portal modules.',
    responsibilities: [
      'Develop backend service methods in Java and Spring Boot.',
      'Write database schemas and stored procedures in MySQL.',
      'Implement secure REST APIs and integration points.',
      'Write unit tests and support user acceptance testing.'
    ],
    skills: ['Java', 'Spring Boot', 'SQL', 'MySQL', 'REST APIs', 'Git'],
    preferredSkills: ['React', 'Docker', 'Linux'],
    experience: { minYears: 0, maxYears: 2, level: 'Entry Level' },
    education: 'B.Tech in CSE / IT / ECE from a recognized institution',
    location: 'Visakhapatnam, Andhra Pradesh',
    workplaceType: 'Hybrid',
    salary: { min: 500000, max: 800000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444422',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111105',
    companyName: 'NextWave Digital',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    title: 'Frontend Developer',
    description: 'NextWave Digital is seeking a Frontend Developer in Vijayawada to build responsive digital interfaces with React and Tailwind CSS.',
    responsibilities: [
      'Build responsive, mobile-first web pages using React and Tailwind CSS.',
      'Connect frontend components to REST APIs and handle form submissions.',
      'Optimize asset loading and core web vitals for portal users.',
      'Participate in sprint reviews and UI QA testing.'
    ],
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git'],
    preferredSkills: ['TypeScript', 'REST APIs', 'Figma'],
    experience: { minYears: 0, maxYears: 2, level: 'Entry Level' },
    education: 'B.Tech / B.Sc / MCA in Computer Science or related field',
    location: 'Vijayawada, Andhra Pradesh',
    workplaceType: 'Hybrid',
    salary: { min: 500000, max: 800000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 12,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444423',
    employerId: '66b222222222222222222201',
    companyId: '66a111111111111111111103',
    companyName: 'FinEdge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    title: 'React Developer',
    description: 'FinEdge Labs is looking for a Remote React Developer to construct financial transaction dashboards, charting views, and user management interfaces.',
    responsibilities: [
      'Build high-performance web dashboards with React and TypeScript.',
      'Implement complex state machines and financial data tables.',
      'Write end-to-end integration tests with Jest and React Testing Library.',
      'Work closely with backend teams on REST and WebSocket feeds.'
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'REST APIs', 'Git'],
    preferredSkills: ['Redux', 'Tailwind CSS', 'Jest', 'Chart.js'],
    experience: { minYears: 2, maxYears: 4, level: 'Mid Level' },
    education: 'Bachelor’s degree in Computer Science, Software Engineering, or equivalent',
    location: 'Mumbai, Maharashtra',
    workplaceType: 'Remote',
    salary: { min: 800000, max: 1300000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Full-time',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 26,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66d444444444444444444424',
    employerId: '66b222222222222222222202',
    companyId: '66a111111111111111111102',
    companyName: 'DataBridge Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    title: 'AI/ML Intern',
    description: 'DataBridge Labs is hiring an AI/ML Intern for our Bengaluru innovation lab to assist in model fine-tuning, benchmark evaluation, and NLP dataset annotation.',
    responsibilities: [
      'Annotate and curate natural language datasets for model evaluation.',
      'Implement baseline benchmark scripts using Python, Scikit-Learn, and PyTorch.',
      'Evaluate model accuracy and document regression metrics.',
      'Collaborate with machine learning engineers during model packaging.'
    ],
    skills: ['Python', 'Machine Learning', 'Pandas', 'SQL', 'PyTorch'],
    preferredSkills: ['Scikit-Learn', 'NumPy', 'FastAPI', 'Git'],
    experience: { minYears: 0, maxYears: 1, level: 'Internship' },
    education: 'Pursuing or completed B.Tech / M.Tech in AI, Data Science, or Computer Science',
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    salary: { min: 450000, max: 650000, currency: 'INR', period: 'per annum', isDisclosed: true },
    jobType: 'Internship',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'Active',
    applicantsCount: 34,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const applications = [
  {
    _id: '66e555555555555555555501',
    jobId: '66d444444444444444444401', // Frontend Dev @ TechNova
    candidateId: '66c333333333333333333301', // Aarav Sharma
    employerId: '66b222222222222222222201',
    status: 'Shortlisted',
    matchScore: {
      overall: 82,
      skillScore: 88,
      experienceScore: 80,
      matchedSkills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
      partialSkills: ['Tailwind CSS'],
      missingSkills: ['TypeScript'],
      matchSummary: 'Strong match based on your frontend experience. You may want to strengthen TypeScript before applying.'
    },
    coverNote: 'I have practical internship experience building responsive interfaces with React and Tailwind CSS.',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66e555555555555555555502',
    jobId: '66d444444444444444444402', // Full Stack Dev @ TechNova
    candidateId: '66c333333333333333333301', // Aarav Sharma
    employerId: '66b222222222222222222201',
    status: 'Under Review',
    matchScore: {
      overall: 80,
      skillScore: 84,
      experienceScore: 78,
      matchedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
      partialSkills: [],
      missingSkills: ['TypeScript', 'Docker'],
      matchSummary: 'Solid alignment with core MERN stack requirements and practical project portfolio.'
    },
    coverNote: 'Experienced in developing REST APIs with Express and connecting them to MongoDB and React clients.',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '66e555555555555555555503',
    jobId: '66d444444444444444444403', // AI/ML Intern @ DataBridge
    candidateId: '66c333333333333333333302', // Ananya Reddy
    employerId: '66b222222222222222222202',
    status: 'Interview',
    matchScore: {
      overall: 92,
      skillScore: 95,
      experienceScore: 90,
      matchedSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'PyTorch'],
      partialSkills: ['FastAPI'],
      missingSkills: [],
      matchSummary: 'High alignment with applied machine learning and data processing requirements.'
    },
    coverNote: 'Looking forward to contributing to data processing pipelines at DataBridge Labs.',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  }
];

module.exports = {
  companies,
  employers,
  candidates,
  jobs,
  applications,
};
