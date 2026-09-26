/**
 * Master Skill Library Dataset
 * Covers 12 Core Career Categories with detailed metadata, difficulty, related skills, and common roles.
 */

const skillsData = [
  // ==========================================
  // 1. SOFTWARE DEVELOPMENT
  // ==========================================
  // Languages
  {
    name: 'C',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Foundational procedural systems programming language used for operating systems, drivers, and embedded systems.',
    difficulty: 'Intermediate',
    relatedSkills: ['C++', 'Linux', 'Data Structures', 'Pointers', 'Memory Management'],
    commonRoles: ['Systems Engineer', 'Embedded Developer', 'Firmware Engineer'],
    learningTopics: ['Memory allocation & pointers', 'Structs and file I/O', 'Bitwise operations', 'Compilation with GCC'],
    practiceProjects: ['Custom Memory Allocator', 'CLI Command Line Shell', 'Embedded Sensor Reader']
  },
  {
    name: 'C++',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'High-performance object-oriented and systems programming language with generic programming and STL support.',
    difficulty: 'Advanced',
    relatedSkills: ['C', 'Object-Oriented Programming', 'STL', 'Multithreading', 'Data Structures'],
    commonRoles: ['Game Developer', 'High-Frequency Trading Engineer', 'Systems Programmer'],
    learningTopics: ['Object-oriented design & RAII', 'Standard Template Library (STL)', 'Smart pointers & memory', 'Concurrency & multithreading'],
    practiceProjects: ['Real-time 2D Physics Engine', 'Custom Hash Map and Trie Library', 'Trading Order Book Simulator']
  },
  {
    name: 'Java',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Class-based, object-oriented language widely used in enterprise backends, Android applications, and distributed systems.',
    difficulty: 'Intermediate',
    relatedSkills: ['Spring Boot', 'Object-Oriented Programming', 'SQL', 'Hibernate', 'REST APIs'],
    commonRoles: ['Java Developer', 'Backend Engineer', 'Enterprise Software Engineer'],
    learningTopics: ['JVM architecture & garbage collection', 'Concurrency & Streams API', 'Spring Boot fundamentals', 'Design patterns (Factory, Singleton)'],
    practiceProjects: ['Enterprise Banking Transaction Service', 'Inventory Management REST API', 'Microservice Auth Service']
  },
  {
    name: 'Python',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Versatile, high-level interpreted programming language with vast ecosystems in web backends, data science, and AI.',
    difficulty: 'Beginner',
    relatedSkills: ['FastAPI', 'Django', 'Flask', 'Pandas', 'REST APIs', 'SQL'],
    commonRoles: ['Python Developer', 'Data Scientist', 'AI/ML Engineer', 'Backend Developer'],
    learningTopics: ['Data structures & list comprehensions', 'OOP & decorators', 'Virtual environments & packaging', 'Asynchronous programming (asyncio)'],
    practiceProjects: ['Asynchronous Web Scraper', 'RESTful API with FastAPI', 'Automated Financial Report Generator']
  },
  {
    name: 'JavaScript',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Core dynamic programming language of the web enabling interactive frontend interfaces and asynchronous server applications.',
    difficulty: 'Beginner',
    relatedSkills: ['TypeScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'REST APIs'],
    commonRoles: ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
    learningTopics: ['Closures, scope & prototypes', 'Event loop & promises/async-await', 'DOM manipulation & modern ES6+', 'Module systems & bundlers'],
    practiceProjects: ['Interactive Kanban Board', 'Real-time WebSocket Chat Application', 'E-commerce Shopping Cart UI']
  },
  {
    name: 'TypeScript',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Strongly typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and tooling in large-scale apps.',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Angular'],
    commonRoles: ['Full Stack Developer', 'Frontend Engineer', 'Backend Engineer'],
    learningTopics: ['Interfaces, types & unions', 'Generics & utility types', 'Type narrowing & guards', 'TypeScript with React/Express'],
    practiceProjects: ['Type-safe E-commerce State Store', 'Generic REST API Client Library', 'Form Validation Schema Engine']
  },
  {
    name: 'Go',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Statically typed, compiled language created by Google designed for high-concurrency cloud microservices and network tools.',
    difficulty: 'Intermediate',
    relatedSkills: ['Docker', 'Kubernetes', 'Microservices', 'REST APIs', 'gRPC'],
    commonRoles: ['Backend Engineer', 'Cloud Infrastructure Engineer', 'DevOps Developer'],
    learningTopics: ['Goroutines and channels', 'Structs and interfaces', 'Concurrency patterns', 'HTTP routing with Gin or Chi'],
    practiceProjects: ['Distributed Key-Value Store', 'High-throughput Rate Limiter Gateway', 'Concurrent URL Health Checker']
  },
  {
    name: 'Rust',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Modern systems programming language prioritizing memory safety, concurrency, and performance without a garbage collector.',
    difficulty: 'Advanced',
    relatedSkills: ['C++', 'Systems Programming', 'WebAssembly', 'Concurrency', 'Memory Safety'],
    commonRoles: ['Systems Engineer', 'Blockchain Developer', 'Infrastructure Engineer'],
    learningTopics: ['Ownership, borrowing & lifetimes', 'Pattern matching & enums', 'Error handling with Result/Option', 'Traits and generics'],
    practiceProjects: ['Custom Fast HTTP Server', 'Command Line Grep Tool', 'WebAssembly Markdown Parser']
  },
  {
    name: 'PHP',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Server-side scripting language powers large portions of the web, content management systems, and web frameworks like Laravel.',
    difficulty: 'Beginner',
    relatedSkills: ['Laravel', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    commonRoles: ['PHP Developer', 'Full Stack Developer', 'WordPress Engineer'],
    learningTopics: ['Object-oriented PHP 8+', 'MVC architecture in Laravel', 'MySQL PDO integration', 'Session and auth security'],
    practiceProjects: ['SaaS Content Management Engine', 'RESTful API with Laravel', 'Subscription Billing Portal']
  },
  {
    name: 'Kotlin',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Concise, modern cross-platform language fully interoperable with Java and the official preferred language for Android development.',
    difficulty: 'Intermediate',
    relatedSkills: ['Android Development', 'Java', 'Coroutines', 'Spring Boot'],
    commonRoles: ['Android Developer', 'Mobile Engineer', 'Backend Engineer'],
    learningTopics: ['Null safety & data classes', 'Coroutines & Flow', 'Jetpack Compose basics', 'Interoperability with Java'],
    practiceProjects: ['Android Expense Tracker with Jetpack Compose', 'News Feed App with Coroutines', 'Kotlin Spring Boot Microservice']
  },
  {
    name: 'Swift',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Powerful, intuitive language developed by Apple for iOS, iPadOS, macOS, watchOS, and tvOS application development.',
    difficulty: 'Intermediate',
    relatedSkills: ['SwiftUI', 'iOS Development', 'Xcode', 'Cocoa Touch'],
    commonRoles: ['iOS Developer', 'Mobile Software Engineer', 'Apple Platform Developer'],
    learningTopics: ['Optionals & error handling', 'Protocols & extensions', 'SwiftUI declarative layouts', 'Async/await & Combine'],
    practiceProjects: ['iOS Weather App with SwiftUI', 'Fitness Tracking App with Local CoreData', 'Recipe Organizer iOS App']
  },
  {
    name: 'C#',
    category: 'Software Development',
    subcategory: 'Languages',
    description: 'Modern, object-oriented language developed by Microsoft for enterprise web APIs, desktop apps, and Unity game development.',
    difficulty: 'Intermediate',
    relatedSkills: ['.NET', 'ASP.NET Core', 'SQL Server', 'Unity', 'Object-Oriented Programming'],
    commonRoles: ['.NET Developer', 'Backend Engineer', 'Game Developer'],
    learningTopics: ['LINQ & collections', 'ASP.NET Core Web API', 'Entity Framework Core', 'Async programming with Task'],
    practiceProjects: ['Enterprise HR & Payroll API', 'Inventory Microservice with EF Core', 'Unity 2D Platformer Game']
  },

  // Frontend
  {
    name: 'HTML',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Standard markup language used to structure web content, forms, semantic metadata, and accessible interfaces.',
    difficulty: 'Beginner',
    relatedSkills: ['CSS', 'JavaScript', 'Accessibility', 'SEO', 'Responsive Design'],
    commonRoles: ['Frontend Developer', 'Web Developer', 'UI Engineer'],
    learningTopics: ['Semantic HTML5 tags', 'Form controls & validation attributes', 'ARIA roles & accessibility basics', 'Meta tags for SEO & performance'],
    practiceProjects: ['Accessible Multi-step Form Page', 'Documentation Portal Layout', 'Clean Portfolio Site']
  },
  {
    name: 'CSS',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Style sheet language used to specify presentation, responsive layouts, animations, and visual styles of web pages.',
    difficulty: 'Beginner',
    relatedSkills: ['HTML', 'Tailwind CSS', 'Responsive Design', 'Bootstrap', 'JavaScript'],
    commonRoles: ['Frontend Developer', 'UI Developer', 'Web Designer'],
    learningTopics: ['Flexbox and CSS Grid layout models', 'Media queries & mobile-first design', 'Custom properties & animations', 'Box model, specificity & inheritance'],
    practiceProjects: ['Responsive Dashboard Shell with CSS Grid', 'Custom Interactive UI Component Library', 'Animated Pricing Cards Table']
  },
  {
    name: 'React',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Declarative component-based JavaScript library for building high-performance, single-page user interfaces.',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'],
    commonRoles: ['React Developer', 'Frontend Engineer', 'Full Stack Developer'],
    learningTopics: ['JSX, components & props', 'Hooks (useState, useEffect, useMemo, useRef)', 'State management & Context API', 'Component lifecycle & performance optimization'],
    practiceProjects: ['Full-featured Project Task Management App', 'Interactive Analytics Dashboard', 'E-commerce Product Catalog with Cart']
  },
  {
    name: 'Next.js',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Leading React framework offering server-side rendering, static site generation, API routing, and hybrid performance benefits.',
    difficulty: 'Intermediate',
    relatedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'SSR'],
    commonRoles: ['Full Stack Developer', 'Frontend Architect', 'React Engineer'],
    learningTopics: ['App Router & Server Components', 'Server-side rendering (SSR) & SSG', 'API routes & Server Actions', 'SEO optimization & Image optimization'],
    practiceProjects: ['Full Stack Blog with Server Components', 'SaaS Landing Page with Stripe Integration', 'Documentation Site with MDX']
  },
  {
    name: 'Angular',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Comprehensive, opinionated TypeScript-based web framework developed by Google for robust enterprise web applications.',
    difficulty: 'Intermediate',
    relatedSkills: ['TypeScript', 'RxJS', 'HTML', 'CSS', 'REST APIs'],
    commonRoles: ['Angular Developer', 'Frontend Engineer', 'Enterprise Web Developer'],
    learningTopics: ['Modules, components & data binding', 'Dependency injection & services', 'RxJS observables and reactive forms', 'Angular Router and route guards'],
    practiceProjects: ['Enterprise Customer Relationship Dashboard', 'Employee Directory Management System', 'Hospital Appointment Booking System']
  },
  {
    name: 'Vue.js',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Progressive JavaScript framework for building user interfaces with intuitive template syntax and lightweight reactivity.',
    difficulty: 'Beginner',
    relatedSkills: ['JavaScript', 'HTML', 'CSS', 'Pinia', 'Nuxt.js'],
    commonRoles: ['Vue.js Developer', 'Frontend Engineer', 'Web Developer'],
    learningTopics: ['Composition API & reactivity', 'Directives & component communication', 'Pinia state management', 'Vue Router fundamentals'],
    practiceProjects: ['Recipe Finder and Meal Planner App', 'Real-time Markdown Editor', 'Interactive Music Playlist Player']
  },
  {
    name: 'Tailwind CSS',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Utility-first CSS framework for rapidly constructing modern, bespoke user interfaces without leaving HTML/JSX.',
    difficulty: 'Beginner',
    relatedSkills: ['CSS', 'HTML', 'React', 'Responsive Design', 'Next.js'],
    commonRoles: ['Frontend Developer', 'UI Engineer', 'Full Stack Developer'],
    learningTopics: ['Utility classes & arbitrary values', 'Responsive modifiers (sm, md, lg)', 'Dark mode configuration', 'Component extraction and customization in tailwind.config'],
    practiceProjects: ['Modern SaaS Landing Page & Pricing Matrix', 'Clean Developer Portfolio with Dark Mode', 'Responsive Admin Dashboard Layout']
  },
  {
    name: 'Bootstrap',
    category: 'Software Development',
    subcategory: 'Frontend',
    description: 'Popular open-source CSS framework featuring pre-designed UI components, responsive grids, and JavaScript plugins.',
    difficulty: 'Beginner',
    relatedSkills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    commonRoles: ['Web Developer', 'UI Developer', 'Junior Frontend Developer'],
    learningTopics: ['12-column grid system & breakpoints', 'Utility classes & component styling', 'Modals, navbars & carousels', 'Customizing with Sass variables'],
    practiceProjects: ['Company Business Portal Template', 'Responsive Event Registration Site', 'Product Showcase Landing Page']
  },

  // Backend
  {
    name: 'Node.js',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Asynchronous event-driven JavaScript runtime environment built on Chrome V8 engine for building scalable network backends.',
    difficulty: 'Intermediate',
    relatedSkills: ['Express.js', 'JavaScript', 'TypeScript', 'MongoDB', 'REST APIs', 'PostgreSQL'],
    commonRoles: ['Node.js Developer', 'Backend Engineer', 'Full Stack Developer'],
    learningTopics: ['Event loop & asynchronous streams', 'File system & Buffer operations', 'Building HTTP web servers', 'NPM package management & security'],
    practiceProjects: ['Real-time Notification Microservice', 'File Upload & Processing API', 'Scalable RESTful Backend Architecture']
  },
  {
    name: 'Express.js',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Fast, minimalist web framework for Node.js providing robust routing, middleware infrastructure, and HTTP utility methods.',
    difficulty: 'Beginner',
    relatedSkills: ['Node.js', 'JavaScript', 'REST APIs', 'MongoDB', 'JWT'],
    commonRoles: ['Backend Developer', 'Full Stack Developer', 'API Engineer'],
    learningTopics: ['Route handlers & HTTP methods', 'Middleware chains (auth, logger, error)', 'Request validation with Joi/Zod', 'JWT authentication and cookie sessions'],
    practiceProjects: ['Authentication & User Authorization API', 'Blog CMS Backend with CRUD Routes', 'E-commerce Product Management API']
  },
  {
    name: 'Django',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'High-level Python web framework that encourages rapid development and clean, pragmatic design with built-in ORM and admin panel.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'PostgreSQL', 'Django REST Framework', 'SQL', 'HTML'],
    commonRoles: ['Django Developer', 'Python Web Developer', 'Backend Engineer'],
    learningTopics: ['MVT (Model-View-Template) pattern', 'Django ORM & migrations', 'Django REST Framework serializers', 'Built-in authentication and security'],
    practiceProjects: ['E-learning Platform with Student Portal', 'Job Board Backend with Search', 'Real Estate Property Listing Portal']
  },
  {
    name: 'Flask',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Lightweight WSGI Python micro web framework designed to make getting started quick and easy with ability to scale up to complex applications.',
    difficulty: 'Beginner',
    relatedSkills: ['Python', 'SQLAlchemy', 'REST APIs', 'PostgreSQL'],
    commonRoles: ['Python Developer', 'Backend Developer', 'Microservice Developer'],
    learningTopics: ['Routing and view functions', 'Jinja2 templating & request context', 'SQLAlchemy ORM integration', 'Blueprints for modular structure'],
    practiceProjects: ['Lightweight URL Shortener Service', 'REST API for IoT Telemetry Logs', 'Personal Blog Web Application']
  },
  {
    name: 'FastAPI',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Modern, fast (high-performance) web framework for building APIs with Python 3.8+ based on standard Python type hints.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Pydantic', 'REST APIs', 'Docker', 'Asynchronous Programming'],
    commonRoles: ['AI/ML Backend Engineer', 'Python API Developer', 'Backend Engineer'],
    learningTopics: ['Automatic Swagger/OpenAPI docs', 'Data validation using Pydantic', 'Async request handling with async/await', 'Dependency injection system'],
    practiceProjects: ['Machine Learning Model Inference API', 'Real-time WebSocket Chat Server', 'Microservice Auth Gateway']
  },
  {
    name: 'Spring Boot',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Enterprise-grade Java framework that simplifies bootstrapping and development of standalone, production-ready Spring applications.',
    difficulty: 'Advanced',
    relatedSkills: ['Java', 'Microservices', 'Hibernate', 'SQL', 'REST APIs'],
    commonRoles: ['Java Backend Developer', 'Spring Boot Engineer', 'Enterprise Architect'],
    learningTopics: ['Dependency Injection & Spring IoC', 'Spring Data JPA & Hibernate ORM', 'Spring Security with JWT', 'Building Microservices with Spring Cloud'],
    practiceProjects: ['Online Payment Processing System', 'Flight Booking Microservice Engine', 'Healthcare Records API']
  },
  {
    name: '.NET',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Cross-platform, open-source developer platform created by Microsoft for building cloud, web, mobile, and desktop applications.',
    difficulty: 'Intermediate',
    relatedSkills: ['C#', 'ASP.NET Core', 'SQL Server', 'Entity Framework Core', 'REST APIs'],
    commonRoles: ['.NET Developer', 'Backend Engineer', 'Enterprise Software Engineer'],
    learningTopics: ['ASP.NET Core Web API architecture', 'Entity Framework Core & code-first migrations', 'Dependency Injection in .NET', 'Middleware pipeline & JWT auth'],
    practiceProjects: ['Enterprise CRM API with ASP.NET Core', 'Hospital Management System', 'Retail Point-of-Sale Backend']
  },
  {
    name: 'REST APIs',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Architectural style for designing networked applications leveraging standard HTTP methods, status codes, and stateless communication.',
    difficulty: 'Beginner',
    relatedSkills: ['Node.js', 'Express.js', 'Postman', 'Python', 'JSON'],
    commonRoles: ['Backend Developer', 'Full Stack Developer', 'API Engineer'],
    learningTopics: ['HTTP methods (GET, POST, PUT, DELETE, PATCH)', 'HTTP status codes & error formats', 'RESTful resource naming conventions', 'API versioning, pagination & rate limiting'],
    practiceProjects: ['Fully Spec’d REST API for Library Management', 'Social Media Feed API with Pagination', 'Public Weather Aggregation API']
  },
  {
    name: 'GraphQL',
    category: 'Software Development',
    subcategory: 'Backend',
    description: 'Query language and server-side runtime for APIs that gives clients power to ask for exactly what they need and nothing more.',
    difficulty: 'Intermediate',
    relatedSkills: ['Node.js', 'React', 'Apollo Server', 'TypeScript', 'REST APIs'],
    commonRoles: ['Full Stack Developer', 'Backend Engineer', 'GraphQL Architect'],
    learningTopics: ['Schemas, types & resolvers', 'Queries, mutations & subscriptions', 'Apollo Server and Client setup', 'N+1 problem & DataLoader optimization'],
    practiceProjects: ['E-commerce Storefront with GraphQL API', 'Social Media Post & Comments GraphQL API', 'Multi-tenant Analytics Query Server']
  },

  // Databases
  {
    name: 'SQL',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Standard domain-specific language used in programming and designed for managing data held in relational database management systems.',
    difficulty: 'Beginner',
    relatedSkills: ['MySQL', 'PostgreSQL', 'Database Design', 'Data Analysis', 'Python'],
    commonRoles: ['Database Administrator', 'Data Analyst', 'Backend Developer', 'Software Engineer'],
    learningTopics: ['SELECT, WHERE, GROUP BY, HAVING', 'INNER, LEFT, RIGHT, and FULL JOINs', 'Subqueries, CTEs, and Window Functions', 'Database indexing and normalization (1NF-3NF)'],
    practiceProjects: ['Complex E-commerce Sales Reporting Queries', 'HR Analytics Database Schema and Stored Procedures', 'University Course Registration Database']
  },
  {
    name: 'MySQL',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Widely used open-source relational database management system renowned for reliability, performance, and transactional safety.',
    difficulty: 'Beginner',
    relatedSkills: ['SQL', 'PHP', 'Node.js', 'Database Design', 'Relational Databases'],
    commonRoles: ['Backend Developer', 'Database Administrator', 'Full Stack Developer'],
    learningTopics: ['InnoDB storage engine & ACID compliance', 'Table indexing & execution plan analysis (EXPLAIN)', 'Stored procedures and triggers', 'Replication and backup strategies'],
    practiceProjects: ['Multi-vendor E-commerce Database', 'Banking Transaction Ledger Database', 'Customer Ticketing System Database']
  },
  {
    name: 'PostgreSQL',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Advanced, open-source object-relational database system emphasizing extensibility, SQL compliance, and complex data types (JSONB).',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Node.js', 'Python', 'JSONB', 'Database Optimization'],
    commonRoles: ['Backend Developer', 'Data Engineer', 'Software Architect'],
    learningTopics: ['Advanced indexing (B-Tree, GIN, GiST)', 'JSONB queries and document storage', 'Transactions, isolation levels & row locking', 'Partitioning and full-text search'],
    practiceProjects: ['Geospatial Location Query Service (PostGIS)', 'Hybrid Relational + Document Data Store', 'High-throughput Audit Log Database']
  },
  {
    name: 'MongoDB',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Leading NoSQL document-oriented database using flexible JSON-like documents for high scalability and rapid schema iterations.',
    difficulty: 'Beginner',
    relatedSkills: ['Node.js', 'Express.js', 'Mongoose', 'NoSQL', 'JavaScript'],
    commonRoles: ['MERN Stack Developer', 'Full Stack Developer', 'Backend Engineer'],
    learningTopics: ['BSON document model & schema design', 'CRUD operations & query operators', 'Aggregation pipeline ($match, $group, $lookup)', 'Indexes, compound indexes & TTL'],
    practiceProjects: ['Content Management Platform with Flexible Schemas', 'IoT Sensor Data Logging System', 'Social Media Activity Feed Database']
  },
  {
    name: 'Redis',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'In-memory data structure store used as a distributed cache, message broker, rate limiter, and real-time streaming engine.',
    difficulty: 'Intermediate',
    relatedSkills: ['Node.js', 'Backend Development', 'Caching', 'Docker', 'System Design'],
    commonRoles: ['Backend Developer', 'System Architect', 'DevOps Engineer'],
    learningTopics: ['Data structures (Strings, Hashes, Lists, Sets, Sorted Sets)', 'Caching strategies (Cache-Aside, Write-Through)', 'Pub/Sub and Redis Streams', 'TTL keys and memory eviction policies'],
    practiceProjects: ['Distributed API Rate Limiter', 'Real-time Leaderboard with Sorted Sets', 'Session Cache & Web Pub/Sub Gateway']
  },
  {
    name: 'SQLite',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Self-contained, serverless, zero-configuration, transactional SQL database engine ideal for mobile apps and embedded devices.',
    difficulty: 'Beginner',
    relatedSkills: ['SQL', 'Python', 'Mobile Development', 'C++'],
    commonRoles: ['Mobile Developer', 'Embedded Engineer', 'Python Developer'],
    learningTopics: ['Single-file database architecture', 'ACID transactions in embedded scenarios', 'Integration with Python & Android', 'Pragmas and performance tuning'],
    practiceProjects: ['Desktop Note-taking App with Local Storage', 'Android Offline Data Sync Cache', 'Lightweight CLI Contact Book']
  },
  {
    name: 'Firebase',
    category: 'Software Development',
    subcategory: 'Databases',
    description: 'Google’s comprehensive app development platform providing Firestore database, real-time sync, auth, and hosting.',
    difficulty: 'Beginner',
    relatedSkills: ['JavaScript', 'React', 'Mobile Development', 'Flutter', 'Cloud Functions'],
    commonRoles: ['Frontend Developer', 'Mobile Developer', 'Full Stack Developer'],
    learningTopics: ['Firestore collections and document queries', 'Real-time snapshot listeners', 'Firebase Authentication integration', 'Security rules configuration'],
    practiceProjects: ['Real-time Collaborative Whiteboard', 'Instant Messaging Chat Application', 'Serverless Task Board App']
  },

  // Tools
  {
    name: 'Git',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Distributed version control system designed to handle everything from small to very large projects with speed and efficiency.',
    difficulty: 'Beginner',
    relatedSkills: ['GitHub', 'GitLab', 'CI/CD', 'Code Review'],
    commonRoles: ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer'],
    learningTopics: ['Branching, committing & merging', 'Resolving merge conflicts', 'Rebasing, cherry-picking & stashing', 'Git workflow (Gitflow, Trunk-based)'],
    practiceProjects: ['Simulated Team Merge Conflict Resolution', 'Git Hooks Automation Script', 'Open Source Contribution Workflow']
  },
  {
    name: 'GitHub',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Cloud hosting service for Git repositories featuring pull requests, issue tracking, GitHub Actions CI/CD, and project management.',
    difficulty: 'Beginner',
    relatedSkills: ['Git', 'GitHub Actions', 'Code Review', 'Open Source'],
    commonRoles: ['Software Developer', 'Engineering Team Lead', 'Open Source Contributor'],
    learningTopics: ['Pull Request workflows & review comments', 'GitHub Issues and Project boards', 'Branch protection rules', 'GitHub Actions setup'],
    practiceProjects: ['Automated PR Linting & Testing Workflow', 'Comprehensive Open Source Repository Setup', 'Project Release Pipeline']
  },
  {
    name: 'GitLab',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Comprehensive DevOps platform that provides Git repository management, issue tracking, and built-in CI/CD pipelines.',
    difficulty: 'Intermediate',
    relatedSkills: ['Git', 'CI/CD', 'DevOps', 'Docker'],
    commonRoles: ['DevOps Engineer', 'Software Engineer', 'Release Engineer'],
    learningTopics: ['GitLab CI/CD (.gitlab-ci.yml) syntax', 'Runners and containerized stages', 'Merge request approvals and protected branches', 'Container registry integration'],
    practiceProjects: ['Automated Microservice Build & Deploy Pipeline', 'Multi-stage Docker Registry Pipeline', 'Environment Deployment Gating']
  },
  {
    name: 'Docker',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Platform that uses OS-level virtualization to deliver software in packages called containers, guaranteeing consistency across environments.',
    difficulty: 'Intermediate',
    relatedSkills: ['Kubernetes', 'Linux', 'CI/CD', 'Cloud Computing', 'Microservices'],
    commonRoles: ['DevOps Engineer', 'Backend Developer', 'Cloud Engineer'],
    learningTopics: ['Dockerfile instructions & multi-stage builds', 'Docker images, layers, and optimization', 'Docker Compose for multi-container apps', 'Container networking and volume mounts'],
    practiceProjects: ['Containerized Full Stack MERN/PERN App with Compose', 'Lightweight Alpine-based Node.js Production Image', 'Local Microservices Development Cluster']
  },
  {
    name: 'Linux',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Open-source Unix-like operating system kernel powering majority of cloud servers, containers, and development environments.',
    difficulty: 'Beginner',
    relatedSkills: ['Bash', 'DevOps', 'Docker', 'Networking', 'Cloud Computing'],
    commonRoles: ['DevOps Engineer', 'System Administrator', 'Backend Developer'],
    learningTopics: ['Shell navigation and core commands (grep, awk, sed)', 'File permissions and user management (chmod, chown)', 'Systemd services and process management', 'Package management (apt, yum) & basic networking'],
    practiceProjects: ['Automated Server Health Check Bash Script', 'Custom Systemd Background Service Daemon', 'Automated Daily Database Backup Cron Job']
  },
  {
    name: 'Postman',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Leading API platform for building, testing, documenting, and simulating REST, GraphQL, and WebSocket APIs.',
    difficulty: 'Beginner',
    relatedSkills: ['REST APIs', 'API Testing', 'JavaScript', 'QA Testing'],
    commonRoles: ['QA Engineer', 'Backend Developer', 'Full Stack Developer'],
    learningTopics: ['Collections, environments & variables', 'Pre-request scripts and test assertions in JS', 'Automated collection runners with Newman', 'Mock servers and API documentation generation'],
    practiceProjects: ['Comprehensive Automated API Regression Suite', 'Mock Payment Gateway Test Collection', 'CI/CD Newman Automated Test Stage']
  },
  {
    name: 'VS Code',
    category: 'Software Development',
    subcategory: 'Tools',
    description: 'Highly extensible code editor developed by Microsoft featuring debugging, embedded Git, syntax highlighting, and snippet support.',
    difficulty: 'Beginner',
    relatedSkills: ['JavaScript', 'TypeScript', 'Git', 'Debugging'],
    commonRoles: ['Software Developer', 'Web Developer', 'Software Engineer'],
    learningTopics: ['Integrated debugging (launch.json)', 'Productivity shortcuts & multi-cursor editing', 'Extensions configuration (Prettier, ESLint, Tailwind)', 'Remote development with SSH and Containers'],
    practiceProjects: ['Custom VS Code Snippets Library for React', 'Full Remote SSH Development Workflow Setup', 'Multi-target Debugging Config for Node/React']
  },

  // ==========================================
  // 2. AI AND MACHINE LEARNING
  // ==========================================
  {
    name: 'Artificial Intelligence',
    category: 'AI & Machine Learning',
    subcategory: 'Foundations',
    description: 'Broad discipline of computer science focused on building smart machines capable of performing tasks that typically require human intelligence.',
    difficulty: 'Intermediate',
    relatedSkills: ['Machine Learning', 'Deep Learning', 'Python', 'Data Science'],
    commonRoles: ['AI Engineer', 'Research Scientist', 'Software Engineer'],
    learningTopics: ['Search algorithms (A*, Minimax)', 'Knowledge representation & reasoning', 'Heuristic optimization', 'Ethical AI & safety considerations'],
    practiceProjects: ['Adversarial Tic-Tac-Toe / Chess Minimax Engine', 'Heuristic Pathfinding Visualizer', 'Rule-based Expert Diagnostic System']
  },
  {
    name: 'Machine Learning',
    category: 'AI & Machine Learning',
    subcategory: 'Core ML',
    description: 'Field of AI focusing on statistical algorithms that learn patterns from data and improve their performance without explicit programming.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Statistics'],
    commonRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Developer'],
    learningTopics: ['Supervised learning (Regression, Classification)', 'Unsupervised learning (Clustering, PCA)', 'Model evaluation metrics (ROC-AUC, F1, Precision)', 'Cross-validation and hyperparameter tuning'],
    practiceProjects: ['Customer Churn Prediction Model', 'House Price Prediction with Feature Engineering', 'Credit Card Fraud Classification Pipeline']
  },
  {
    name: 'Deep Learning',
    category: 'AI & Machine Learning',
    subcategory: 'Neural Networks',
    description: 'Subset of machine learning based on artificial neural networks with multiple representation layers, excelling in vision, audio, and text.',
    difficulty: 'Advanced',
    relatedSkills: ['PyTorch', 'TensorFlow', 'Computer Vision', 'NLP', 'Python'],
    commonRoles: ['Deep Learning Engineer', 'Computer Vision Scientist', 'AI Researcher'],
    learningTopics: ['Backpropagation & gradient descent optimizers', 'Convolutional Neural Networks (CNNs)', 'Recurrent Neural Networks & LSTMs', 'Regularization (Dropout, Batch Normalization)'],
    practiceProjects: ['Handwritten Digit & Character Recognition (CNN)', 'Audio Keyword Spotting Model', 'Stock Price Sequence Forecasting with LSTM']
  },
  {
    name: 'Natural Language Processing',
    category: 'AI & Machine Learning',
    subcategory: 'NLP',
    description: 'Branch of AI giving computers the ability to understand, interpret, manipulate, and generate human language text and speech.',
    difficulty: 'Advanced',
    relatedSkills: ['Python', 'Hugging Face', 'Large Language Models', 'PyTorch', 'Transformers'],
    commonRoles: ['NLP Engineer', 'AI Research Scientist', 'Data Scientist'],
    learningTopics: ['Tokenization, stemming & lemmatization', 'Word embeddings (Word2Vec, GloVe)', 'Transformer architecture & self-attention', 'Sentiment analysis and named entity recognition (NER)'],
    practiceProjects: ['Customer Feedback Sentiment Classifier', 'Named Entity Extraction API for Resumes', 'Automated Article Summarization Tool']
  },
  {
    name: 'Computer Vision',
    category: 'AI & Machine Learning',
    subcategory: 'Vision',
    description: 'AI discipline enabling machines to derive meaningful information from digital images, videos, and other visual inputs.',
    difficulty: 'Advanced',
    relatedSkills: ['Deep Learning', 'PyTorch', 'Python', 'OpenCV', 'TensorFlow'],
    commonRoles: ['Computer Vision Engineer', 'Robotics Software Developer', 'AI Engineer'],
    learningTopics: ['Image preprocessing and filtering (OpenCV)', 'Object detection (YOLO, Faster R-CNN)', 'Image segmentation (U-Net)', 'Transfer learning with ResNet/EfficientNet'],
    practiceProjects: ['Real-time Facial Mask & Emotion Detector', 'Automated License Plate Recognition System', 'Defect Detection in Manufacturing Images']
  },
  {
    name: 'Generative AI',
    category: 'AI & Machine Learning',
    subcategory: 'Generative Models',
    description: 'Class of artificial intelligence algorithms capable of generating novel text, images, code, or audio based on learned patterns.',
    difficulty: 'Intermediate',
    relatedSkills: ['Large Language Models', 'Prompt Engineering', 'RAG', 'LangChain', 'Python'],
    commonRoles: ['Generative AI Engineer', 'AI Solutions Architect', 'Full Stack AI Developer'],
    learningTopics: ['Generative models (GANs, VAEs, Diffusion, LLMs)', 'Fine-tuning vs prompting strategies', 'Multimodal generation (Text-to-Image, Speech)', 'Safety, guardrails & evaluation'],
    practiceProjects: ['AI Code Review Assistant', 'Synthetic Test Data Generator', 'Marketing Copy Generator with Guardrails']
  },
  {
    name: 'Large Language Models',
    category: 'AI & Machine Learning',
    subcategory: 'LLMs',
    description: 'Massive neural network models trained on extensive text datasets to understand, reason, and generate human-like language.',
    difficulty: 'Intermediate',
    relatedSkills: ['Prompt Engineering', 'RAG', 'LangChain', 'Hugging Face', 'Python'],
    commonRoles: ['LLM Engineer', 'AI Application Developer', 'Data Scientist'],
    learningTopics: ['Transformer decoder architecture', 'Context windows and tokenization', 'Parameter-Efficient Fine-Tuning (LoRA, QLoRA)', 'Inference optimization and quantizations (GGUF)'],
    practiceProjects: ['Domain-specific Legal / Medical QA Bot', 'Automated Email Response Drafting Assistant', 'Enterprise Code Refactoring Assistant']
  },
  {
    name: 'Prompt Engineering',
    category: 'AI & Machine Learning',
    subcategory: 'LLM Techniques',
    description: 'Practice of structuring and optimizing inputs for generative AI models to produce accurate, reliable, and tailored outputs.',
    difficulty: 'Beginner',
    relatedSkills: ['Generative AI', 'Large Language Models', 'RAG', 'AI Agents'],
    commonRoles: ['AI Prompt Specialist', 'AI Product Manager', 'Full Stack Developer'],
    learningTopics: ['Zero-shot & Few-shot prompting', 'Chain-of-Thought (CoT) reasoning', 'System instructions & persona framing', 'JSON mode and structured outputs'],
    practiceProjects: ['Structured Resume Parser Prompt System', 'Automated Customer Ticket Classifier', 'Interactive Coding Tutor Prompt Framework']
  },
  {
    name: 'RAG',
    category: 'AI & Machine Learning',
    subcategory: 'Architecture',
    description: 'Retrieval-Augmented Generation: framework combining information retrieval with LLMs to generate grounded, factually accurate answers.',
    difficulty: 'Intermediate',
    relatedSkills: ['Vector Databases', 'LangChain', 'Large Language Models', 'Python', 'Embeddings'],
    commonRoles: ['RAG Engineer', 'AI Solutions Developer', 'Data Engineer'],
    learningTopics: ['Document chunking strategies', 'Embedding models & similarity metrics', 'Vector retrieval and reranking (Cross-Encoders)', 'Context compression and Hallucination reduction'],
    practiceProjects: ['Enterprise Knowledge Base Q&A System', 'Financial Earnings Report Research Assistant', 'Internal API Documentation Search Engine']
  },
  {
    name: 'AI Agents',
    category: 'AI & Machine Learning',
    subcategory: 'Autonomous Systems',
    description: 'Autonomous systems powered by LLMs equipped with tool-calling, memory, and iterative planning to accomplish complex goals.',
    difficulty: 'Advanced',
    relatedSkills: ['LangChain', 'Python', 'Large Language Models', 'Prompt Engineering'],
    commonRoles: ['AI Agent Developer', 'Autonomous Systems Engineer', 'AI Architect'],
    learningTopics: ['ReAct (Reason + Act) prompting pattern', 'Tool calling and API integration', 'Short-term and long-term memory systems', 'Multi-agent orchestration and delegation'],
    practiceProjects: ['Autonomous Market Research Agent', 'Automated GitHub Bug Fixing Agent', 'Personal Travel Itinerary & Booking Agent']
  },
  {
    name: 'TensorFlow',
    category: 'AI & Machine Learning',
    subcategory: 'Frameworks',
    description: 'End-to-end open-source machine learning and deep learning library developed by Google for research and production deployments.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Deep Learning', 'Keras', 'Computer Vision'],
    commonRoles: ['Machine Learning Engineer', 'Deep Learning Specialist', 'AI Developer'],
    learningTopics: ['Tensors, operations & computation graphs', 'Keras Sequential & Functional APIs', 'TensorBoard visualization & metrics', 'TensorFlow Lite for mobile deployment'],
    practiceProjects: ['Image Classification Pipeline with Keras', 'Time-series Weather Forecasting Model', 'Mobile-ready TFLite Object Classifier']
  },
  {
    name: 'PyTorch',
    category: 'AI & Machine Learning',
    subcategory: 'Frameworks',
    description: 'Dynamic, flexible open-source deep learning framework developed by Meta widely preferred in cutting-edge AI research and industry.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Deep Learning', 'Computer Vision', 'NLP', 'CUDA'],
    commonRoles: ['AI Research Engineer', 'PyTorch Developer', 'Deep Learning Specialist'],
    learningTopics: ['Tensors, autograd & dynamic graphs', 'nn.Module, loss functions & optimizers', 'Custom Dataset and DataLoader classes', 'GPU acceleration with CUDA'],
    practiceProjects: ['Custom Neural Network Classifier from Scratch', 'Transfer Learning Image Classifier with ResNet', 'Transformer-based Character Level Text Generator']
  },
  {
    name: 'Scikit-learn',
    category: 'AI & Machine Learning',
    subcategory: 'Core ML',
    description: 'Essential Python library providing simple and efficient tools for predictive data analysis and classical machine learning algorithms.',
    difficulty: 'Beginner',
    relatedSkills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Statistics'],
    commonRoles: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst'],
    learningTopics: ['Pipelines & ColumnTransformers', 'Preprocessing (StandardScaler, OneHotEncoder)', 'Supervised algorithms (RandomForest, SVM, LogisticRegression)', 'K-Means clustering & Dimensionality Reduction'],
    practiceProjects: ['Automated End-to-End ML Training Pipeline', 'Customer Segmentation Clustering Model', 'Spam Email Detection Filter']
  },
  {
    name: 'Pandas',
    category: 'AI & Machine Learning',
    subcategory: 'Data Processing',
    description: 'Fast, powerful, and flexible open-source data analysis and manipulation library built on top of the Python programming language.',
    difficulty: 'Beginner',
    relatedSkills: ['Python', 'NumPy', 'Data Analysis', 'SQL', 'Data Cleaning'],
    commonRoles: ['Data Analyst', 'Data Scientist', 'Data Engineer', 'Python Developer'],
    learningTopics: ['DataFrames and Series manipulation', 'Handling missing values & data cleaning', 'GroupBy, aggregations & pivot tables', 'Merging, joining & time-series analysis'],
    practiceProjects: ['Sales Data Cleansing & KPI Aggregator', 'COVID-19 Global Trends Data Analysis', 'Financial Stock Volatility Analyzer']
  },
  {
    name: 'NumPy',
    category: 'AI & Machine Learning',
    subcategory: 'Numerical Computing',
    description: 'Fundamental package for scientific computing in Python, providing support for large, multi-dimensional arrays and mathematical functions.',
    difficulty: 'Beginner',
    relatedSkills: ['Python', 'Pandas', 'Linear Algebra', 'Machine Learning'],
    commonRoles: ['Data Scientist', 'AI Engineer', 'Quantitative Analyst'],
    learningTopics: ['N-dimensional array creation & slicing', 'Vectorization and broadcasting rules', 'Linear algebra operations (dot product, eigenvalues)', 'Random sampling and mathematical functions'],
    practiceProjects: ['Linear Regression from Scratch with NumPy', 'Matrix Factorization Recommendation Model', 'Image Pixel Manipulation Filters']
  },
  {
    name: 'Hugging Face',
    category: 'AI & Machine Learning',
    subcategory: 'Ecosystem',
    description: 'Hub and library ecosystem (Transformers, Datasets, Diffusers) for sharing, downloading, and fine-tuning state-of-the-art AI models.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'PyTorch', 'NLP', 'Large Language Models', 'Transformers'],
    commonRoles: ['NLP Engineer', 'AI Application Developer', 'Machine Learning Engineer'],
    learningTopics: ['AutoModel & AutoTokenizer APIs', 'Fine-tuning with Trainer API', 'Hugging Face Hub model hosting', 'Inference Pipelines for text, vision, audio'],
    practiceProjects: ['Fine-tuned BERT Sentiment Classifier', 'Zero-shot Classification Pipeline', 'Custom Hugging Face Space Demo App']
  },
  {
    name: 'LangChain',
    category: 'AI & Machine Learning',
    subcategory: 'Frameworks',
    description: 'Software framework designed to facilitate the creation of applications using large language models, agents, and retrieval chains.',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Large Language Models', 'RAG', 'Vector Databases', 'Prompt Engineering'],
    commonRoles: ['AI Engineer', 'Full Stack AI Developer', 'Software Engineer'],
    learningTopics: ['LangChain Expression Language (LCEL)', 'Prompt templates & output parsers', 'Document loaders & vector store retrievers', 'Conversational memory and Agent tools'],
    practiceProjects: ['Document Question-Answering Chatbot', 'Autonomous Web Research Assistant with Search Tool', 'Structured Extraction Pipeline for Invoices']
  },
  {
    name: 'Vector Databases',
    category: 'AI & Machine Learning',
    subcategory: 'Databases',
    description: 'Specialized databases (Pinecone, Chroma, Milvus, Qdrant, FAISS) optimized for storing and querying high-dimensional vector embeddings.',
    difficulty: 'Intermediate',
    relatedSkills: ['RAG', 'Embeddings', 'Python', 'Large Language Models'],
    commonRoles: ['AI Engineer', 'Data Engineer', 'Search Architect'],
    learningTopics: ['Vector embeddings & distance metrics (Cosine, Euclidean)', 'Approximate Nearest Neighbor (HNSW, IVF)', 'Metadata filtering and indexing', 'Integrating vector stores in RAG pipelines'],
    practiceProjects: ['Semantic Code Search Engine', 'Image Similarity Search Application', 'Personalized Product Recommendation Engine']
  },

  // ==========================================
  // 3. DATA AND ANALYTICS
  // ==========================================
  {
    name: 'Excel',
    category: 'Data & Analytics',
    subcategory: 'Spreadsheets',
    description: 'Essential spreadsheet software for data calculation, pivot tables, financial modeling, and business reporting.',
    difficulty: 'Beginner',
    relatedSkills: ['Data Analysis', 'Statistics', 'Power BI', 'Financial Basics'],
    commonRoles: ['Data Analyst', 'Financial Analyst', 'Business Operations Specialist'],
    learningTopics: ['VLOOKUP, XLOOKUP & INDEX/MATCH', 'Pivot Tables & Pivot Charts', 'Data validation and conditional formatting', 'Basic macros & formula auditing'],
    practiceProjects: ['Financial Budgeting & Cash Flow Model', 'Sales Performance Tracking Dashboard', 'Inventory Reorder Alert Calculator']
  },
  {
    name: 'Power BI',
    category: 'Data & Analytics',
    subcategory: 'Visualization',
    description: 'Microsoft’s business analytics tool providing interactive visualizations, business intelligence dashboards, and self-service reporting.',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Excel', 'Data Visualization', 'DAX', 'Data Modeling'],
    commonRoles: ['Power BI Developer', 'BI Analyst', 'Data Analyst'],
    learningTopics: ['Power Query ETL and data transformations', 'Star schema data modeling', 'DAX calculations (CALCULATE, RELATED)', 'Publishing reports and configuring gateways'],
    practiceProjects: ['Executive KPI & Revenue Dashboard', 'Human Resources Attrition Analytics Report', 'Supply Chain Logistics Performance Dashboard']
  },
  {
    name: 'Tableau',
    category: 'Data & Analytics',
    subcategory: 'Visualization',
    description: 'Powerful data visualization platform enabling analysts to create interactive dashboards, geographic maps, and visual storyboards.',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Data Visualization', 'Excel', 'Data Analysis'],
    commonRoles: ['Tableau Developer', 'Data Visualization Specialist', 'BI Consultant'],
    learningTopics: ['Dimensions vs Measures', 'Calculated fields and Level of Detail (LOD) expressions', 'Dual-axis charts and custom maps', 'Dashboard storytelling and actions'],
    practiceProjects: ['Global COVID-19 Impact Visual Story', 'Retail Sales & Profitability Dashboard', 'Customer Retention & Cohort Heatmap']
  },
  {
    name: 'Statistics',
    category: 'Data & Analytics',
    subcategory: 'Theory',
    description: 'Mathematical foundation of data analysis covering probability, hypothesis testing, distributions, and inferential modeling.',
    difficulty: 'Intermediate',
    relatedSkills: ['Data Analysis', 'Python', 'Machine Learning', 'Excel'],
    commonRoles: ['Data Scientist', 'Quantitative Researcher', 'Data Analyst'],
    learningTopics: ['Descriptive statistics (Mean, Median, Standard Deviation)', 'Probability distributions (Normal, Binomial, Poisson)', 'Hypothesis testing (p-value, t-test, Chi-square)', 'Confidence intervals & A/B test analysis'],
    practiceProjects: ['Website A/B Testing Significance Calculator', 'Product Quality Sampling Analysis', 'Customer Survey Inferential Study']
  },
  {
    name: 'Data Visualization',
    category: 'Data & Analytics',
    subcategory: 'Analysis',
    description: 'Graphic representation of data to communicate insights clearly, discover trends, and support data-driven decision making.',
    difficulty: 'Beginner',
    relatedSkills: ['Power BI', 'Tableau', 'Python', 'Excel', 'UI/UX & Design'],
    commonRoles: ['Data Analyst', 'BI Developer', 'Product Analyst'],
    learningTopics: ['Selecting the right chart for the data type', 'Color theory, accessibility and visual hierarchy', 'Avoiding chart junk and deceptive axes', 'Interactive storytelling techniques'],
    practiceProjects: ['Executive Business Overview Infographic', 'Quarterly Revenue Performance Storyboard', 'Interactive Customer Demographics Breakdown']
  },
  {
    name: 'Data Cleaning',
    category: 'Data & Analytics',
    subcategory: 'Data Prep',
    description: 'Process of detecting, correcting, or removing corrupt, inaccurate, or missing records from raw datasets before analysis.',
    difficulty: 'Beginner',
    relatedSkills: ['Python', 'Pandas', 'SQL', 'Excel'],
    commonRoles: ['Data Analyst', 'Data Engineer', 'Data Scientist'],
    learningTopics: ['Handling nulls and missing value imputation', 'Standardizing date formats & string cleanups', 'Detecting and treating statistical outliers', 'De-duplication and schema validation'],
    practiceProjects: ['Raw E-commerce Transaction Scrubbing Script', 'Messy Customer Contact Database Sanitization', 'Survey Response Standardization Pipeline']
  },
  {
    name: 'Data Analysis',
    category: 'Data & Analytics',
    subcategory: 'Analysis',
    description: 'Systematic inspection, cleansing, transformation, and modeling of data to discover useful information and support business decisions.',
    difficulty: 'Beginner',
    relatedSkills: ['SQL', 'Python', 'Excel', 'Power BI', 'Statistics'],
    commonRoles: ['Data Analyst', 'Business Analyst', 'Operations Analyst'],
    learningTopics: ['Exploratory Data Analysis (EDA)', 'Trend and seasonality identification', 'Cohort analysis and customer segmentation', 'Formulating actionable business recommendations'],
    practiceProjects: ['Customer Churn Exploratory Analysis', 'Product Feature Adoption Case Study', 'Marketing Campaign ROI Evaluation']
  },
  {
    name: 'Data Engineering',
    category: 'Data & Analytics',
    subcategory: 'Engineering',
    description: 'Discipline of designing, building, and maintaining reliable infrastructure and data pipelines for collecting and processing data at scale.',
    difficulty: 'Advanced',
    relatedSkills: ['SQL', 'Python', 'ETL', 'Apache Spark', 'Data Warehousing', 'AWS'],
    commonRoles: ['Data Engineer', 'Big Data Developer', 'Pipeline Architect'],
    learningTopics: ['Batch vs stream processing architectures', 'Data lakehouse principles (Delta Lake, Iceberg)', 'Orchestration with Airflow or Prefect', 'Data quality validation and monitoring'],
    practiceProjects: ['Automated End-to-End ETL Pipeline with Airflow', 'Real-time Clickstream Processing Pipeline', 'Multi-source Data Lake Ingestion System']
  },
  {
    name: 'ETL',
    category: 'Data & Analytics',
    subcategory: 'Data Pipelines',
    description: 'Extract, Transform, Load: procedure of copying data from one or more sources into a destination system representing data differently.',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Python', 'Data Engineering', 'Data Warehousing'],
    commonRoles: ['ETL Developer', 'Data Engineer', 'BI Developer'],
    learningTopics: ['Source data extraction strategies (CDC, full, incremental)', 'Data transformation, enrichment & cleansing', 'Loading into destination databases efficiently', 'Error handling and pipeline retry mechanics'],
    practiceProjects: ['Automated Daily CSV to PostgreSQL Ingestion', 'E-commerce Orders Incremental Sync Pipeline', 'Third-party API to Data Warehouse Connector']
  },
  {
    name: 'Data Warehousing',
    category: 'Data & Analytics',
    subcategory: 'Architecture',
    description: 'Centralized repository of integrated data from disparate sources, organized for analytical querying, reporting, and BI.',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Data Engineering', 'Snowflake', 'BigQuery', 'ETL'],
    commonRoles: ['Data Warehouse Architect', 'BI Engineer', 'Data Engineer'],
    learningTopics: ['Dimensional modeling (Fact & Dimension tables)', 'Star schema vs Snowflake schema', 'Slowly Changing Dimensions (SCD Type 1 & 2)', 'Columnar storage optimization and partitioning'],
    practiceProjects: ['Retail Sales Dimensional Data Warehouse Schema', 'Financial Ledger Analytics Data Mart', 'Healthcare Visits Fact Table Architecture']
  },
  {
    name: 'Apache Spark',
    category: 'Data & Analytics',
    subcategory: 'Big Data',
    description: 'Unified multi-language analytical engine for large-scale distributed data processing and machine learning.',
    difficulty: 'Advanced',
    relatedSkills: ['Python', 'PySpark', 'SQL', 'Data Engineering', 'Scala'],
    commonRoles: ['Big Data Engineer', 'Data Platform Engineer', 'Spark Developer'],
    learningTopics: ['Spark Core, RDDs, and DataFrames', 'Distributed transformations and lazy evaluation', 'Spark SQL and query optimization (Catalyst)', 'Structured Streaming for real-time analytics'],
    practiceProjects: ['Large-scale Log File Aggregation Engine', 'Distributed E-commerce Recommendations with PySpark', 'Real-time Transaction Anomaly Streamer']
  },

  // ==========================================
  // 4. CLOUD AND DEVOPS
  // ==========================================
  {
    name: 'AWS',
    category: 'Cloud & DevOps',
    subcategory: 'Cloud Platforms',
    description: 'World’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from global data centers.',
    difficulty: 'Intermediate',
    relatedSkills: ['Cloud Security', 'Docker', 'Linux', 'Terraform', 'Serverless'],
    commonRoles: ['Cloud Engineer', 'DevOps Specialist', 'AWS Solutions Architect'],
    learningTopics: ['Core compute & storage (EC2, S3, EBS)', 'Networking (VPC, Subnets, Security Groups)', 'Managed databases (RDS, DynamoDB)', 'Identity & Access Management (IAM)'],
    practiceProjects: ['Highly Available Multi-tier Web App on AWS', 'Serverless Image Thumbnail Pipeline with S3 & Lambda', 'Secure VPC Architecture with Bastion Host']
  },
  {
    name: 'Azure',
    category: 'Cloud & DevOps',
    subcategory: 'Cloud Platforms',
    description: 'Microsoft’s cloud computing platform providing services for compute, analytics, storage, and networking with strong enterprise integration.',
    difficulty: 'Intermediate',
    relatedSkills: ['Cloud Security', 'Linux', 'Terraform', '.NET'],
    commonRoles: ['Azure Cloud Engineer', 'DevOps Specialist', 'Cloud Administrator'],
    learningTopics: ['Azure Virtual Machines and App Services', 'Azure Virtual Networks (VNet) & NSGs', 'Azure Active Directory (Entra ID)', 'Azure SQL & Blob Storage'],
    practiceProjects: ['Deploying Secure Web App on Azure App Service', 'Azure Hybrid Network Connection with VPN Gateway', 'Automated Backup Strategy with Azure Backup']
  },
  {
    name: 'Google Cloud',
    category: 'Cloud & DevOps',
    subcategory: 'Cloud Platforms',
    description: 'Suite of cloud computing services running on the same infrastructure that Google uses internally for its end-user products.',
    difficulty: 'Intermediate',
    relatedSkills: ['Kubernetes', 'Cloud Security', 'BigQuery', 'Docker'],
    commonRoles: ['GCP Cloud Engineer', 'Data Platform Engineer', 'DevOps Engineer'],
    learningTopics: ['Google Compute Engine and Cloud Run', 'Google Kubernetes Engine (GKE) basics', 'BigQuery and Cloud Storage', 'Cloud IAM and Service Accounts'],
    practiceProjects: ['Containerized Microservice on Google Cloud Run', 'Serverless Event Pipeline with Cloud Pub/Sub & Functions', 'BigQuery Analytics Data Mart Deployment']
  },
  {
    name: 'Kubernetes',
    category: 'Cloud & DevOps',
    subcategory: 'Orchestration',
    description: 'Open-source system for automating deployment, scaling, and management of containerized applications across compute clusters.',
    difficulty: 'Advanced',
    relatedSkills: ['Docker', 'Linux', 'Cloud Computing', 'CI/CD', 'Helm'],
    commonRoles: ['Kubernetes Administrator', 'DevOps Engineer', 'Cloud Architect'],
    learningTopics: ['Pods, Deployments, and ReplicaSets', 'Services, Ingress & Cluster Networking', 'ConfigMaps, Secrets, and Persistent Volumes', 'Horizontal Pod Autoscaling and Helm charts'],
    practiceProjects: ['Zero-downtime Microservice Deployment Cluster', 'Production-ready Ingress Controller with TLS', 'Helm Chart Package for Web Application']
  },
  {
    name: 'CI/CD',
    category: 'Cloud & DevOps',
    subcategory: 'Automation',
    description: 'Continuous Integration & Continuous Delivery: automated methodologies enabling development teams to deliver code changes frequently and reliably.',
    difficulty: 'Intermediate',
    relatedSkills: ['GitHub Actions', 'Jenkins', 'Docker', 'Git', 'Automated Testing'],
    commonRoles: ['DevOps Engineer', 'Release Engineer', 'Full Stack Developer'],
    learningTopics: ['Automated test execution on commit', 'Building and publishing container images', 'Deployment strategies (Blue-Green, Canary)', 'Environment promotion and secrets management'],
    practiceProjects: ['Automated Linting, Testing & Staging Deployment Pipeline', 'Zero-downtime Blue-Green Production Rollout', 'Automated Docker Image Release with Semantic Versioning']
  },
  {
    name: 'Jenkins',
    category: 'Cloud & DevOps',
    subcategory: 'Automation',
    description: 'Open-source automation server enabling developers around the world to reliably build, test, and deploy their software.',
    difficulty: 'Intermediate',
    relatedSkills: ['CI/CD', 'Linux', 'Docker', 'Git', 'Bash'],
    commonRoles: ['DevOps Engineer', 'Build Engineer', 'System Administrator'],
    learningTopics: ['Declarative vs Scripted Jenkins pipelines', 'Jenkinsfile syntax and stages', 'Distributed builds with Agent nodes', 'Plugin management and credentials store'],
    practiceProjects: ['Declarative Multi-branch Pipeline with Jenkinsfile', 'Automated Security Vulnerability Scanning Stage', 'Jenkins Docker Agent Auto-scaling Setup']
  },
  {
    name: 'GitHub Actions',
    category: 'Cloud & DevOps',
    subcategory: 'Automation',
    description: 'Native CI/CD and workflow automation tool integrated directly inside GitHub repositories to build, test, and deploy code.',
    difficulty: 'Beginner',
    relatedSkills: ['CI/CD', 'GitHub', 'Git', 'Docker', 'YAML'],
    commonRoles: ['DevOps Engineer', 'Full Stack Developer', 'Software Engineer'],
    learningTopics: ['Workflow YAML syntax (triggers, jobs, steps)', 'Action marketplace and custom composite actions', 'Secrets and environment variables', 'Matrix builds for cross-version testing'],
    practiceProjects: ['Automated NPM Package Publishing Workflow', 'Full Stack CI/CD Deploying to AWS S3 & CloudFront', 'Automated Weekly Dependency Security Audit']
  },
  {
    name: 'Terraform',
    category: 'Cloud & DevOps',
    subcategory: 'Infrastructure as Code',
    description: 'Open-source infrastructure-as-code software tool providing a consistent CLI workflow to manage hundreds of cloud services.',
    difficulty: 'Advanced',
    relatedSkills: ['AWS', 'Azure', 'Google Cloud', 'Cloud Security', 'DevOps'],
    commonRoles: ['Cloud Infrastructure Engineer', 'DevOps Engineer', 'Platform Engineer'],
    learningTopics: ['HCL (HashiCorp Configuration Language) syntax', 'Terraform state management and remote backends', 'Modular infrastructure components (modules)', 'Variables, outputs, and lifecycle rules'],
    practiceProjects: ['Complete AWS VPC & EC2 Cluster Provisioning Script', 'Multi-environment Cloud Infrastructure Modules', 'Automated S3 & CloudFront CDN Infrastructure']
  },
  {
    name: 'Cloud Security',
    category: 'Cloud & DevOps',
    subcategory: 'Security',
    description: 'Discipline of cybersecurity applied to protecting cloud environments, data, applications, and virtual infrastructure.',
    difficulty: 'Intermediate',
    relatedSkills: ['AWS', 'Cybersecurity Fundamentals', 'Terraform', 'Linux Security'],
    commonRoles: ['Cloud Security Engineer', 'Security Architect', 'DevSecOps Specialist'],
    learningTopics: ['Least-privilege IAM policies and roles', 'Data encryption at rest and in transit', 'Security Groups, WAF, and Network ACLs', 'Compliance auditing and vulnerability scanning'],
    practiceProjects: ['Automated IAM Privilege Audit Tool', 'Encrypted Cloud Storage & Secret Rotation Policy', 'Cloud Security Baseline Configuration']
  },
  {
    name: 'Serverless',
    category: 'Cloud & DevOps',
    subcategory: 'Cloud Architecture',
    description: 'Cloud computing execution model where the cloud provider dynamically manages the allocation and provisioning of servers (FaaS).',
    difficulty: 'Intermediate',
    relatedSkills: ['AWS', 'Node.js', 'Python', 'REST APIs', 'Cloud Computing'],
    commonRoles: ['Cloud Developer', 'Backend Engineer', 'Solutions Architect'],
    learningTopics: ['AWS Lambda & API Gateway integration', 'Event-driven triggers (S3, SQS, DynamoDB Streams)', 'Cold starts and concurrency optimization', 'Serverless Framework / SAM configuration'],
    practiceProjects: ['Serverless PDF Generation API', 'Automated Event-driven Email Notification Service', 'Serverless Webhook Handler with DynamoDB']
  },
  {
    name: 'Monitoring',
    category: 'Cloud & DevOps',
    subcategory: 'Observability',
    description: 'Systematic collection, analysis, and visualization of metrics, logs, and traces to ensure application reliability and performance.',
    difficulty: 'Intermediate',
    relatedSkills: ['Linux', 'DevOps', 'Cloud Computing', 'Prometheus', 'Grafana'],
    commonRoles: ['Site Reliability Engineer (SRE)', 'DevOps Engineer', 'System Administrator'],
    learningTopics: ['Three pillars of observability (Metrics, Logs, Traces)', 'Prometheus metric scraping and PromQL', 'Grafana dashboard design and alerting', 'Log aggregation with ELK or Loki'],
    practiceProjects: ['Full Observability Stack with Prometheus & Grafana', 'Automated Slack Alerting for Service Downtime', 'Application Performance APM Tracing Setup']
  },
  {
    name: 'Networking',
    category: 'Cloud & DevOps',
    subcategory: 'Infrastructure',
    description: 'Fundamental principles of computer communications including protocols, routing, subnetting, DNS, and secure data transmission.',
    difficulty: 'Beginner',
    relatedSkills: ['Linux', 'Cloud Computing', 'Network Security', 'Cybersecurity'],
    commonRoles: ['Network Engineer', 'Cloud Engineer', 'System Administrator'],
    learningTopics: ['OSI and TCP/IP network model layers', 'IP addressing, CIDR blocks and subnetting', 'DNS resolution process and routing protocols', 'HTTP/HTTPS, TLS handshakes, and WebSockets'],
    practiceProjects: ['Subnet IP Calculator Utility', 'Custom Packet Sniffer in Python', 'Local DNS Caching Server Setup']
  },

  // ==========================================
  // 5. CYBERSECURITY
  // ==========================================
  {
    name: 'Cybersecurity Fundamentals',
    category: 'Cybersecurity',
    subcategory: 'Foundations',
    description: 'Core concepts of information security including confidentiality, integrity, availability (CIA triad), threats, and risk management.',
    difficulty: 'Beginner',
    relatedSkills: ['Network Security', 'Web Security', 'Linux Security', 'OWASP'],
    commonRoles: ['Cybersecurity Analyst', 'Security Specialist', 'Information Security Officer'],
    learningTopics: ['CIA Triad & threat modeling', 'Authentication & Multi-Factor Authentication', 'Malware types and attack vectors', 'Security policies and incident response lifecycle'],
    practiceProjects: ['Company Security Awareness Policy Blueprint', 'Basic Threat Model for Web Application', 'Incident Response Playbook Template']
  },
  {
    name: 'Network Security',
    category: 'Cybersecurity',
    subcategory: 'Defense',
    description: 'Practices and technologies designed to protect the usability and integrity of a company’s network and data transmissions.',
    difficulty: 'Intermediate',
    relatedSkills: ['Networking', 'Linux Security', 'Vulnerability Assessment', 'Firewalls'],
    commonRoles: ['Network Security Engineer', 'SOC Analyst', 'Security Specialist'],
    learningTopics: ['Firewalls, IDS/IPS configuration', 'Virtual Private Networks (VPNs) and tunneling', 'Wireshark packet capture analysis', 'Port scanning and network defense strategies'],
    practiceProjects: ['Packet Analysis Report with Wireshark', 'Configuring iptables Linux Firewall Rules', 'Network Intrusion Detection Rule Tuning with Snort']
  },
  {
    name: 'Web Security',
    category: 'Cybersecurity',
    subcategory: 'Application Security',
    description: 'Measures and protocols taken to secure web applications, APIs, and online services from digital vulnerabilities and exploits.',
    difficulty: 'Intermediate',
    relatedSkills: ['OWASP', 'Penetration Testing', 'REST APIs', 'JavaScript'],
    commonRoles: ['Application Security Engineer', 'Penetration Tester', 'Full Stack Developer'],
    learningTopics: ['Cross-Site Scripting (XSS) prevention', 'Cross-Site Request Forgery (CSRF) & mitigation', 'SQL Injection (SQLi) defense', 'Content Security Policy (CSP) & CORS headers'],
    practiceProjects: ['Vulnerable Web App Remediation Audit', 'Secure JWT Auth Implementation with HttpOnly Cookies', 'API Security Assessment and Rate Limit Hardening']
  },
  {
    name: 'Ethical Hacking',
    category: 'Cybersecurity',
    subcategory: 'Offensive Security',
    description: 'Authorized practice of bypassing system security to identify potential data breaches and threats in a network or web service.',
    difficulty: 'Advanced',
    relatedSkills: ['Penetration Testing', 'Linux', 'OWASP', 'Vulnerability Assessment'],
    commonRoles: ['Ethical Hacker', 'Penetration Tester', 'Red Team Specialist'],
    learningTopics: ['Reconnaissance and OSINT techniques', 'Vulnerability scanning (Nmap, Nessus)', 'Exploitation frameworks (Metasploit)', 'Post-exploitation and responsible disclosure reporting'],
    practiceProjects: ['Authorized Capture The Flag (CTF) Challenge Writeup', 'Vulnerability Audit on Sandboxed Web Application', 'Automated Subdomain and Port Enumeration Script']
  },
  {
    name: 'Penetration Testing',
    category: 'Cybersecurity',
    subcategory: 'Offensive Security',
    description: 'Simulated cyberattack against your computer system to check for exploitable vulnerabilities and evaluate defense readiness.',
    difficulty: 'Advanced',
    relatedSkills: ['Ethical Hacking', 'Web Security', 'OWASP', 'Linux Security'],
    commonRoles: ['Penetration Tester', 'Security Consultant', 'Red Teamer'],
    learningTopics: ['Penetration testing methodologies (PTES, OWASP)', 'Burp Suite proxy and request interception', 'Privilege escalation on Linux and Windows', 'Writing professional pentest findings reports'],
    practiceProjects: ['Comprehensive Burp Suite Web Application Pentest', 'Privilege Escalation Lab Documentation', 'Executive Penetration Testing Audit Report']
  },
  {
    name: 'Cryptography',
    category: 'Cybersecurity',
    subcategory: 'Foundations',
    description: 'Mathematical science of securing communication and data against adversarial third parties through ciphers and hashing.',
    difficulty: 'Advanced',
    relatedSkills: ['Cybersecurity Fundamentals', 'Web Security', 'Python', 'Algorithms'],
    commonRoles: ['Cryptography Engineer', 'Security Researcher', 'Backend Security Developer'],
    learningTopics: ['Symmetric encryption (AES, DES)', 'Asymmetric encryption (RSA, ECC)', 'Cryptographic hashing (SHA-256, bcrypt)', 'Digital signatures and PKI / SSL certificates'],
    practiceProjects: ['End-to-End Encrypted Messaging Script', 'Custom Digital Signature Verifier in Python', 'Zero-Knowledge Proof Concept Demo']
  },
  {
    name: 'OWASP',
    category: 'Cybersecurity',
    subcategory: 'Application Security',
    description: 'Open Web Application Security Project: globally recognized standard awareness document for developers and web application security.',
    difficulty: 'Beginner',
    relatedSkills: ['Web Security', 'Penetration Testing', 'Software Development'],
    commonRoles: ['Application Security Engineer', 'Software Developer', 'QA Security Engineer'],
    learningTopics: ['OWASP Top 10 web vulnerabilities', 'Broken access control remediation', 'Cryptographic failures and insecure design', 'Security misconfiguration and dependency auditing'],
    practiceProjects: ['OWASP Top 10 Security Checklist & Audit', 'Static Code Analysis Pipeline for Vulnerabilities', 'Remediating Insecure Direct Object References (IDOR)']
  },
  {
    name: 'Linux Security',
    category: 'Cybersecurity',
    subcategory: 'System Security',
    description: 'Operating system hardening techniques, access controls, audit logs, and security policies for Linux servers.',
    difficulty: 'Intermediate',
    relatedSkills: ['Linux', 'Cybersecurity Fundamentals', 'DevOps', 'Bash'],
    commonRoles: ['Linux System Administrator', 'Security Engineer', 'Cloud Infrastructure Engineer'],
    learningTopics: ['SSH key hardening and disabling root login', 'File permissions, ACLs and sudoers configuration', 'SELinux / AppArmor mandatory access controls', 'Auditd log auditing and fail2ban setup'],
    practiceProjects: ['Automated Linux Production Hardening Script', 'Fail2ban Intrusion Prevention Deployment', 'Auditd Security Monitoring Ruleset']
  },
  {
    name: 'Digital Forensics',
    category: 'Cybersecurity',
    subcategory: 'Investigation',
    description: 'Branch of forensic science encompassing the recovery, investigation, and analysis of material found in digital devices related to cybercrime.',
    difficulty: 'Advanced',
    relatedSkills: ['Cybersecurity Fundamentals', 'Linux Security', 'Incident Response'],
    commonRoles: ['Digital Forensics Investigator', 'Incident Response Analyst', 'Cyber Forensics Specialist'],
    learningTopics: ['Chain of custody and forensic imaging (dd, FTK)', 'Memory dump analysis with Volatility', 'File system artifact analysis and deleted file recovery', 'Timeline reconstruction from system logs'],
    practiceProjects: ['Memory Dump Investigation Case Report', 'Disk Image Artifact Extraction Analysis', 'Malware Infection Timeline Reconstruction']
  },
  {
    name: 'Security Operations',
    category: 'Cybersecurity',
    subcategory: 'SOC',
    description: 'Day-to-day monitoring, detection, analysis, and response to cybersecurity events and incidents across organizational infrastructure.',
    difficulty: 'Intermediate',
    relatedSkills: ['Cybersecurity Fundamentals', 'Network Security', 'Incident Response', 'SIEM'],
    commonRoles: ['SOC Analyst (Tier 1/2)', 'Security Operations Lead', 'Incident Handler'],
    learningTopics: ['SIEM (Security Information & Event Management) tools', 'Log correlation and alert triage', 'Incident containment and eradication procedures', 'Threat hunting fundamentals'],
    practiceProjects: ['SIEM Alert Triage and Incident Escalation Report', 'Phishing Email Header Analysis and Blocklist Rules', 'Malicious IP Investigation Workflow']
  },
  {
    name: 'Vulnerability Assessment',
    category: 'Cybersecurity',
    subcategory: 'Assessment',
    description: 'Systematic review of security weaknesses in an information system, evaluating if it is susceptible to any known vulnerabilities.',
    difficulty: 'Intermediate',
    relatedSkills: ['Ethical Hacking', 'OWASP', 'Penetration Testing', 'Network Security'],
    commonRoles: ['Vulnerability Analyst', 'Security Consultant', 'Cybersecurity Specialist'],
    learningTopics: ['Automated scanning tools (Nessus, OpenVAS)', 'CVSS scoring system and severity classification', 'False positive elimination and manual verification', 'Prioritized vulnerability remediation planning'],
    practiceProjects: ['Enterprise Vulnerability Assessment Report', 'CVSS Severity Matrix and Remediation Roadmap', 'Automated Container Image Vulnerability Scan']
  },

  // ==========================================
  // 6. UI/UX & DESIGN
  // ==========================================
  {
    name: 'UI Design',
    category: 'UI/UX & Design',
    subcategory: 'Visual Design',
    description: 'Process of designing the visual look, feel, layout, typography, colors, and interactive elements of software interfaces.',
    difficulty: 'Beginner',
    relatedSkills: ['UX Design', 'Figma', 'Design Systems', 'CSS', 'Responsive Design'],
    commonRoles: ['UI Designer', 'Visual Designer', 'Product Designer'],
    learningTopics: ['Typography scales and font pairing', 'Color theory and contrast ratios (WCAG)', 'Grid systems, whitespace and visual hierarchy', 'Iconography and micro-interactions'],
    practiceProjects: ['Modern Banking Mobile App UI Kit', 'E-commerce Product Detail & Checkout Interface', 'SaaS Analytics Dashboard UI']
  },
  {
    name: 'UX Design',
    category: 'UI/UX & Design',
    subcategory: 'User Experience',
    description: 'Design process focusing on user satisfaction, ease of use, accessibility, and utility provided in the interaction with a product.',
    difficulty: 'Beginner',
    relatedSkills: ['User Research', 'Wireframing', 'UI Design', 'Figma', 'Prototyping'],
    commonRoles: ['UX Designer', 'Product Designer', 'UX Researcher'],
    learningTopics: ['User journey mapping & personas', 'Information architecture and card sorting', 'Usability heuristics (Nielsen Norman)', 'Affordances, signifiers, and mental models'],
    practiceProjects: ['Onboarding Flow Redesign Case Study', 'User Journey Map for Food Delivery Service', 'Usability Evaluation Audit on Existing Website']
  },
  {
    name: 'Figma',
    category: 'UI/UX & Design',
    subcategory: 'Design Tools',
    description: 'Collaborative cloud-based design and prototyping tool used by product teams worldwide for UI, UX, and design systems.',
    difficulty: 'Beginner',
    relatedSkills: ['UI Design', 'Design Systems', 'Prototyping', 'Wireframing'],
    commonRoles: ['UI/UX Designer', 'Product Designer', 'Frontend Developer'],
    learningTopics: ['Auto Layout and responsive constraints', 'Component variants and properties', 'Design tokens and shared libraries', 'Interactive prototyping and smart animations'],
    practiceProjects: ['Comprehensive Responsive Web UI Kit in Figma', 'Interactive Mobile App Prototype with Micro-interactions', 'Design System Library with Reusable Variants']
  },
  {
    name: 'Wireframing',
    category: 'UI/UX & Design',
    subcategory: 'UX Design',
    description: 'Creating low-fidelity visual representations of a website or app layout to establish structural hierarchy before visual styling.',
    difficulty: 'Beginner',
    relatedSkills: ['UX Design', 'Figma', 'Prototyping', 'User Research'],
    commonRoles: ['UX Designer', 'Product Manager', 'Information Architect'],
    learningTopics: ['Low-fidelity sketching and paper prototyping', 'Layout wireframing in Figma / Balsamiq', 'Content prioritization and visual blocks', 'Iterative user feedback on structure'],
    practiceProjects: ['Mobile Banking App Low-Fi Wireframe Flows', 'SaaS Dashboard Layout Wireframe Exploration', 'Hospital Booking Portal Wireframes']
  },
  {
    name: 'Prototyping',
    category: 'UI/UX & Design',
    subcategory: 'Interaction',
    description: 'Building interactive simulations of a product to test concepts, transitions, and user flows with stakeholders and testers.',
    difficulty: 'Intermediate',
    relatedSkills: ['Figma', 'UI Design', 'Interaction Design', 'UX Design'],
    commonRoles: ['Product Designer', 'UI/UX Designer', 'Interaction Designer'],
    learningTopics: ['Trigger-action interaction models', 'Smart animate transitions and easing curves', 'Variable-driven prototype logic in Figma', 'Usability test session facilitation'],
    practiceProjects: ['High-fidelity Interactive E-commerce Checkout Prototype', 'Animated Mobile Tab Bar Micro-interactions', 'Complex Multi-step Form Interactive Flow']
  },
  {
    name: 'Design Systems',
    category: 'UI/UX & Design',
    subcategory: 'Design Engineering',
    description: 'Comprehensive set of design standards, documentation, tokens, and reusable UI components managed by product and dev teams.',
    difficulty: 'Advanced',
    relatedSkills: ['Figma', 'UI Design', 'Tailwind CSS', 'CSS', 'React'],
    commonRoles: ['Design Systems Engineer', 'Lead Product Designer', 'UI Architect'],
    learningTopics: ['Design tokens (Colors, Typography, Spacing, Elevation)', 'Component specification guidelines and states', 'Version control and library publishing in Figma', 'Aligning Figma tokens with CSS/Tailwind tokens'],
    practiceProjects: ['Enterprise Design System Component Library', 'Design Tokens Schema & Export Pipeline', 'Accessibility-tested Core UI Component Spec']
  },
  {
    name: 'User Research',
    category: 'UI/UX & Design',
    subcategory: 'UX Research',
    description: 'Systematic study of target users and their requirements to add realistic contexts and insights to design processes.',
    difficulty: 'Intermediate',
    relatedSkills: ['UX Design', 'User Research', 'Data Analysis', 'Usability Testing'],
    commonRoles: ['UX Researcher', 'Product Designer', 'Product Manager'],
    learningTopics: ['Qualitative user interviews and observational studies', 'Quantitative surveys and analytics data review', 'Creating actionable user personas and empathy maps', 'Synthesizing findings into design recommendations'],
    practiceProjects: ['User Research Discovery Report for E-Commerce App', 'Usability Testing Synthesis Matrix & Action Items', 'User Persona Profiles and Pain Points Canvas']
  },
  {
    name: 'Interaction Design',
    category: 'UI/UX & Design',
    subcategory: 'Design Theory',
    description: 'Design of the interaction between users and products with focus on creating engaging, intuitive interfaces with logical behaviors.',
    difficulty: 'Intermediate',
    relatedSkills: ['UI Design', 'UX Design', 'Prototyping', 'Animation'],
    commonRoles: ['Interaction Designer', 'Product Designer', 'UI/UX Designer'],
    learningTopics: ['5 Dimensions of Interaction Design', 'Feedback loops, state transitions, and loading feedback', 'Gesture-based interactions on mobile devices', 'Micro-interactions that communicate state changes'],
    practiceProjects: ['Mobile Pull-to-Refresh & Gesture Interactions', 'Interactive Card Swipe Animation System', 'Dynamic Form Inline Validation Feedback System']
  },
  {
    name: 'Responsive Design',
    category: 'UI/UX & Design',
    subcategory: 'Web Design',
    description: 'Approach to web design making web pages render well on a variety of devices, window sizes, and screen orientations.',
    difficulty: 'Beginner',
    relatedSkills: ['CSS', 'HTML', 'Tailwind CSS', 'UI Design'],
    commonRoles: ['Frontend Developer', 'UI Designer', 'Web Developer'],
    learningTopics: ['Mobile-first vs desktop-first breakpoints', 'Fluid typography and relative sizing (rem, clamp)', 'Responsive images and picture elements', 'Touch target sizing on mobile viewports'],
    practiceProjects: ['Fully Responsive Portfolio Layout (320px to 4K)', 'Adaptive Navigation Bar for Mobile and Desktop', 'Responsive Pricing Grid with Feature Tables']
  },
  {
    name: 'Accessibility',
    category: 'UI/UX & Design',
    subcategory: 'Standards',
    description: 'Practice of making websites and applications usable by as many people as possible, including individuals with disabilities (WCAG).',
    difficulty: 'Intermediate',
    relatedSkills: ['HTML', 'CSS', 'UI Design', 'Web Development'],
    commonRoles: ['Accessibility Specialist', 'Frontend Developer', 'Product Designer'],
    learningTopics: ['WCAG 2.1 AA/AAA compliance principles (POUR)', 'Keyboard navigation and visible focus rings', 'ARIA attributes and semantic HTML tags', 'Color contrast validation and screen reader testing'],
    practiceProjects: ['Accessibility Audit & Remediation on Web Portal', 'Screen Reader-Friendly Modal Dialog Component', 'High-Contrast Accessible Theme Palette']
  },
  {
    name: 'Photoshop',
    category: 'UI/UX & Design',
    subcategory: 'Creative Tools',
    description: 'Industry-standard raster graphics editor for photo editing, digital art manipulation, and web asset preparation.',
    difficulty: 'Beginner',
    relatedSkills: ['Illustrator', 'UI Design', 'Visual Design'],
    commonRoles: ['Graphic Designer', 'Visual Designer', 'Content Creator'],
    learningTopics: ['Layers, masks, and non-destructive adjustments', 'Selections, cropping, and object removal', 'Exporting optimized web assets (WebP, PNG)', 'Color grading and image enhancement'],
    practiceProjects: ['Product Marketing Banner Visuals', 'Hero Image Photo Retouching & Composite', 'Social Media Asset Collection']
  },
  {
    name: 'Illustrator',
    category: 'UI/UX & Design',
    subcategory: 'Creative Tools',
    description: 'Leading vector graphics editor for creating scalable logos, icons, typography, illustrations, and digital branding assets.',
    difficulty: 'Intermediate',
    relatedSkills: ['Photoshop', 'UI Design', 'Figma', 'Branding'],
    commonRoles: ['Vector Illustrator', 'Brand Designer', 'UI Designer'],
    learningTopics: ['Pen tool mastery and vector bezier curves', 'Pathfinder operations and shape builder', 'Creating scalable SVG icons and illustrations', 'Typography styling and logo construction'],
    practiceProjects: ['Custom 24-piece SVG Icon Set for Tech App', 'Brand Identity Logo and Vector Mascot', 'Isometric Vector Illustration for Landing Page']
  },

  // ==========================================
  // 7. MOBILE DEVELOPMENT
  // ==========================================
  {
    name: 'Android Development',
    category: 'Mobile Development',
    subcategory: 'Android',
    description: 'Engineering native applications for the Android mobile operating system using Kotlin, Java, and Android Jetpack libraries.',
    difficulty: 'Intermediate',
    relatedSkills: ['Kotlin', 'Java', 'Android Jetpack', 'Mobile UI/UX', 'REST APIs'],
    commonRoles: ['Android Developer', 'Mobile Engineer', 'Android Architect'],
    learningTopics: ['Activity & Fragment lifecycles', 'Jetpack Compose modern declarative UI', 'Room database for local storage', 'Retrofit for networking and REST APIs'],
    practiceProjects: ['Android Crypto Price Tracker App', 'Offline-capable Task Manager with Room DB', 'Music Streaming App Client']
  },
  {
    name: 'Flutter',
    category: 'Mobile Development',
    subcategory: 'Cross-Platform',
    description: 'Google’s open-source UI software development kit used to build natively compiled applications for mobile, web, and desktop from a single codebase.',
    difficulty: 'Intermediate',
    relatedSkills: ['Dart', 'Mobile UI/UX', 'Firebase', 'REST APIs'],
    commonRoles: ['Flutter Developer', 'Cross-Platform Mobile Engineer', 'App Developer'],
    learningTopics: ['Stateless and Stateful widgets', 'State management (Bloc, Provider, Riverpod)', 'Navigation 2.0 and routing', 'Integrating native device features (Camera, GPS)'],
    practiceProjects: ['Cross-platform E-commerce Store Mobile App', 'Real-time Chat App with Flutter & Firebase', 'Fitness & Workout Tracking Mobile Application']
  },
  {
    name: 'Dart',
    category: 'Mobile Development',
    subcategory: 'Languages',
    description: 'Client-optimized programming language developed by Google for fast apps on any platform, serving as the language of Flutter.',
    difficulty: 'Beginner',
    relatedSkills: ['Flutter', 'JavaScript', 'Object-Oriented Programming'],
    commonRoles: ['Flutter Developer', 'Mobile Developer'],
    learningTopics: ['Sound null safety and typing', 'Async programming with Futures & Streams', 'Object-oriented classes and mixins', 'Collections and functional operators'],
    practiceProjects: ['Command Line Habit Tracker in Dart', 'Dart HTTP Client Library', 'JSON Serialization Benchmark Suite']
  },
  {
    name: 'React Native',
    category: 'Mobile Development',
    subcategory: 'Cross-Platform',
    description: 'Popular open-source framework by Meta for writing real, natively rendering mobile applications for iOS and Android using React and JavaScript.',
    difficulty: 'Intermediate',
    relatedSkills: ['React', 'JavaScript', 'TypeScript', 'Mobile UI/UX', 'Expo'],
    commonRoles: ['React Native Developer', 'Mobile Engineer', 'Full Stack Mobile Developer'],
    learningTopics: ['Core components (View, Text, FlatList)', 'Expo workflow and native CLI configuration', 'React Navigation (Stack, Tabs)', 'Accessing device APIs (Camera, AsyncStorage)'],
    practiceProjects: ['Social Media Feed App with React Native & Expo', 'Food Delivery Tracking App with Maps', 'Local Audio Player Mobile Application']
  },
  {
    name: 'iOS Development',
    category: 'Mobile Development',
    subcategory: 'iOS',
    description: 'Creating native applications for Apple’s iOS devices using Swift, SwiftUI, and the iOS SDK ecosystem in Xcode.',
    difficulty: 'Intermediate',
    relatedSkills: ['Swift', 'SwiftUI', 'Xcode', 'Mobile UI/UX', 'CoreData'],
    commonRoles: ['iOS Developer', 'Mobile Software Engineer', 'Apple Platform Developer'],
    learningTopics: ['Xcode IDE & Interface Builder / SwiftUI', 'CoreData / SwiftData persistence', 'URLSession for network requests', 'App Store submission guidelines and TestFlight'],
    practiceProjects: ['iOS Expense & Budget Manager App', 'Weather Forecast App with WidgetKit Support', 'Podcast Player iOS Application']
  },
  {
    name: 'SwiftUI',
    category: 'Mobile Development',
    subcategory: 'iOS',
    description: 'Apple’s modern declarative UI framework to design user interfaces across all Apple platforms with Swift code.',
    difficulty: 'Intermediate',
    relatedSkills: ['Swift', 'iOS Development', 'Mobile UI/UX'],
    commonRoles: ['iOS Developer', 'Mobile UI Engineer'],
    learningTopics: ['State, Binding, and ObservedObject', 'Stacks (VStack, HStack, ZStack) and Lists', 'Animations, transitions, and gesture recognizers', 'Dynamic preview canvases in Xcode'],
    practiceProjects: ['Habit Tracker iOS App with SwiftUI', 'Smart Home Controller Interface', 'Interactive Quiz App with Animated Transitions']
  },
  {
    name: 'Mobile UI/UX',
    category: 'Mobile Development',
    subcategory: 'Mobile Design',
    description: 'Design principles tailored for mobile device constraints, touch ergonomics, platform guidelines (Human Interface & Material Design).',
    difficulty: 'Beginner',
    relatedSkills: ['UI/UX & Design', 'Figma', 'Android Development', 'iOS Development'],
    commonRoles: ['Mobile Designer', 'Product Designer', 'Mobile App Developer'],
    learningTopics: ['Thumb zone ergonomics and navigation patterns', 'Apple HIG vs Google Material Design 3 guidelines', 'Haptic feedback and mobile micro-interactions', 'Mobile accessibility and offline state indicators'],
    practiceProjects: ['Mobile App Design Flow conforming to Apple HIG', 'Material 3 Android App UI Specification', 'Mobile Onboarding & Permission Request Flow']
  },

  // ==========================================
  // 8. SOFTWARE TESTING
  // ==========================================
  {
    name: 'Manual Testing',
    category: 'Software Testing',
    subcategory: 'QA Foundations',
    description: 'Software testing process where test cases are executed manually by human testers without using automated tools.',
    difficulty: 'Beginner',
    relatedSkills: ['Test Case Design', 'QA Fundamentals', 'Bug Reporting', 'Jira'],
    commonRoles: ['QA Tester', 'Manual QA Engineer', 'Software Test Specialist'],
    learningTopics: ['Software Testing Life Cycle (STLC)', 'Smoke, sanity, functional and regression testing', 'Writing actionable bug reports with reproduction steps', 'Test execution logs and status reporting'],
    practiceProjects: ['Comprehensive Test Execution Report on Web Application', 'Bug Tracking Log with Severity & Priority Matrix', 'Cross-browser Compatibility Manual Test Matrix']
  },
  {
    name: 'Test Case Design',
    category: 'Software Testing',
    subcategory: 'Test Techniques',
    description: 'Systematic techniques used to design high-coverage test cases that uncover edge cases and software defects efficiently.',
    difficulty: 'Beginner',
    relatedSkills: ['Manual Testing', 'QA Fundamentals', 'Automation Testing'],
    commonRoles: ['QA Analyst', 'Test Lead', 'Quality Assurance Engineer'],
    learningTopics: ['Boundary Value Analysis (BVA)', 'Equivalence Partitioning (EP)', 'Decision Table and State Transition Testing', 'Error guessing and exploratory test scenarios'],
    practiceProjects: ['Boundary Value Test Suite for Banking Transfer Flow', 'E-commerce Checkout Matrix Test Case Document', 'Authentication & Password Policy Test Suite']
  },
  {
    name: 'API Testing',
    category: 'Software Testing',
    subcategory: 'Automation',
    description: 'Software testing type that validates Application Programming Interfaces (APIs) for functionality, reliability, performance, and security.',
    difficulty: 'Intermediate',
    relatedSkills: ['Postman', 'REST APIs', 'Automation Testing', 'JavaScript'],
    commonRoles: ['QA Automation Engineer', 'Backend QA Specialist', 'SDET'],
    learningTopics: ['Validating HTTP status codes & response bodies', 'Schema validation with JSON Schema', 'Authentication testing (Bearer token, API keys)', 'Automated test scripting in Postman / RestAssured'],
    practiceProjects: ['Automated End-to-End API Test Suite for E-commerce', 'Payment Gateway Integration Regression Pack', 'API Load and Error Handling Test Suite']
  },
  {
    name: 'Selenium',
    category: 'Software Testing',
    subcategory: 'Automation Tools',
    description: 'Widely adopted open-source framework for automated testing of web applications across various browsers and operating systems.',
    difficulty: 'Intermediate',
    relatedSkills: ['Java', 'Python', 'Automation Testing', 'TestNG', 'WebDriver'],
    commonRoles: ['QA Automation Engineer', 'SDET', 'Selenium Test Engineer'],
    learningTopics: ['Selenium WebDriver architecture & locators (XPath, CSS)', 'Page Object Model (POM) design pattern', 'Handling dropdowns, alerts, windows & iframes', 'Parallel test execution with TestNG / PyTest'],
    practiceProjects: ['Page Object Model Automation Framework for E-Commerce', 'Cross-browser Automated Regression Test Suite', 'Data-driven Login Test Suite with Excel Integration']
  },
  {
    name: 'Playwright',
    category: 'Software Testing',
    subcategory: 'Automation Tools',
    description: 'Modern end-to-end testing library from Microsoft enabling resilient, fast, and cross-browser automation with auto-waiting.',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'TypeScript', 'Automation Testing', 'CI/CD'],
    commonRoles: ['QA Automation Engineer', 'SDET', 'Frontend Test Engineer'],
    learningTopics: ['Auto-waiting, locators, and assertions', 'Cross-browser testing (Chromium, Firefox, WebKit)', 'Codegen test recorder and trace viewer', 'Parallel execution and CI pipeline integration'],
    practiceProjects: ['End-to-End E-Commerce Checkout Test Suite in Playwright', 'Visual Regression Test Suite with Screenshots', 'GitHub Actions Playwright Automated CI Pipeline']
  },
  {
    name: 'Cypress',
    category: 'Software Testing',
    subcategory: 'Automation Tools',
    description: 'Next-generation front-end testing tool built for the modern web, providing fast, reliable testing for anything that runs in a browser.',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'React', 'Automation Testing', 'Frontend'],
    commonRoles: ['Frontend QA Engineer', 'SDET', 'Full Stack Developer'],
    learningTopics: ['Cypress architecture & time-travel debugging', 'Custom commands and fixtures', 'Intercepting network requests and mocking APIs', 'Component testing in React / Vue'],
    practiceProjects: ['Full E-Commerce User Journey Test in Cypress', 'Network Mocking & Offline State Test Suite', 'Custom Cypress Command Utility Library']
  },
  {
    name: 'Jest',
    category: 'Software Testing',
    subcategory: 'Unit Testing',
    description: 'Delightful JavaScript testing framework with a focus on simplicity, used for unit and snapshot testing in Node and React apps.',
    difficulty: 'Beginner',
    relatedSkills: ['JavaScript', 'React', 'TypeScript', 'Unit Testing'],
    commonRoles: ['Frontend Developer', 'Node.js Developer', 'Software Engineer'],
    learningTopics: ['describe, test, expect assertions', 'Mocking functions and modules (jest.fn, jest.mock)', 'Snapshot testing for React components', 'Code coverage reports generation'],
    practiceProjects: ['Comprehensive Unit Test Suite for Utility Library', 'React Component Snapshot & Event Test Suite', 'Node.js Express Controller Mock Tests']
  },
  {
    name: 'Unit Testing',
    category: 'Software Testing',
    subcategory: 'Testing Types',
    description: 'Software testing method where individual units or components of a software are tested in isolation to ensure correctness.',
    difficulty: 'Beginner',
    relatedSkills: ['Jest', 'JUnit', 'PyTest', 'Software Development'],
    commonRoles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    learningTopics: ['First principles of unit testing (FIRST principle)', 'Mocking dependencies and stubs', 'Test-Driven Development (TDD) cycle', 'Achieving high branch and statement coverage'],
    practiceProjects: ['TDD String Calculator Implementation', 'Unit Test Suite for Financial Calculation Engine', 'Payment Validator Unit Tests with 100% Coverage']
  },
  {
    name: 'Integration Testing',
    category: 'Software Testing',
    subcategory: 'Testing Types',
    description: 'Phase in software testing in which individual software modules are combined and tested as a group to verify interconnected behavior.',
    difficulty: 'Intermediate',
    relatedSkills: ['Unit Testing', 'API Testing', 'Automation Testing', 'Node.js'],
    commonRoles: ['SDET', 'Backend Developer', 'QA Automation Engineer'],
    learningTopics: ['Testing database queries with test containers', 'Testing HTTP endpoint integration with Supertest', 'Managing test database state and rollbacks', 'Mocking third-party external integrations'],
    practiceProjects: ['Express + MongoDB Integration Test Suite with Supertest', 'User Authentication End-to-End Flow Integration', 'Order Processing Database Transaction Tests']
  },
  {
    name: 'Automation Testing',
    category: 'Software Testing',
    subcategory: 'Core QA',
    description: 'Technique of using special software tools to execute tests and compare actual outcomes with predicted outcomes automatically.',
    difficulty: 'Intermediate',
    relatedSkills: ['Selenium', 'Playwright', 'Cypress', 'Python', 'CI/CD'],
    commonRoles: ['QA Automation Engineer', 'SDET', 'Test Automation Lead'],
    learningTopics: ['Automation framework design (Hybrid, Data-driven)', 'Selecting candidates for automation vs manual testing', 'Integrating test suites into CI/CD pipelines', 'Test reporting and flaky test management'],
    practiceProjects: ['Hybrid Test Automation Framework from Scratch', 'Nightly Regression Automation Pipeline', 'Automated Test Execution Reporting Dashboard']
  },
  {
    name: 'Performance Testing',
    category: 'Software Testing',
    subcategory: 'Non-Functional',
    description: 'Testing practice performed to determine how a system performs in terms of responsiveness and stability under a particular workload (JMeter, k6).',
    difficulty: 'Advanced',
    relatedSkills: ['JMeter', 'k6', 'API Testing', 'Backend Development'],
    commonRoles: ['Performance Test Engineer', 'SDET', 'Site Reliability Engineer'],
    learningTopics: ['Load testing, stress testing & endurance testing', 'Virtual users, ramp-up, and throughput metrics', 'Measuring latency percentiles (p95, p99)', 'Identifying database and server bottlenecks'],
    practiceProjects: ['Load Testing E-Commerce Checkout with k6 (1000 VUs)', 'JMeter Stress Test on Authentication API', 'Performance Bottleneck Identification Report']
  },
  {
    name: 'QA Fundamentals',
    category: 'Software Testing',
    subcategory: 'QA Foundations',
    description: 'Core concepts of software quality assurance, verification vs validation, defect lifecycles, and testing principles.',
    difficulty: 'Beginner',
    relatedSkills: ['Manual Testing', 'Test Case Design', 'Software Development'],
    commonRoles: ['Junior QA Tester', 'Quality Assurance Analyst', 'Software Tester'],
    learningTopics: ['Quality Assurance vs Quality Control', '7 Principles of Software Testing', 'Defect lifecycle and severity vs priority', 'Verification, Validation and V-Model'],
    practiceProjects: ['Quality Assurance Plan Document for Web Release', 'Bug Triage Process Flowchart and Guidelines', 'Risk-based Test Strategy Blueprint']
  },

  // ==========================================
  // 9. BUSINESS & MANAGEMENT
  // ==========================================
  {
    name: 'Business Analysis',
    category: 'Business & Management',
    subcategory: 'Analysis',
    description: 'Discipline of identifying business needs, determining solutions to business problems, and articulating requirements.',
    difficulty: 'Beginner',
    relatedSkills: ['Requirements Gathering', 'Agile', 'SQL', 'Data Analysis'],
    commonRoles: ['Business Analyst', 'Product Owner', 'Systems Analyst'],
    learningTopics: ['Stakeholder interview and elicitation techniques', 'Writing Business Requirement Documents (BRDs)', 'Gap analysis and business process modeling (BPMN)', 'Cost-benefit and feasibility analysis'],
    practiceProjects: ['Comprehensive BRD for Online Loan Application', 'BPMN Process Flow for Customer Order Fulfillment', 'Feature Gap Analysis Document for SaaS Migration']
  },
  {
    name: 'Product Management',
    category: 'Business & Management',
    subcategory: 'Product',
    description: 'Organizational function that guides every step of a product’s lifecycle: from development to positioning and pricing.',
    difficulty: 'Intermediate',
    relatedSkills: ['Agile', 'User Research', 'Business Strategy', 'UI/UX & Design'],
    commonRoles: ['Product Manager', 'Associate Product Manager', 'Product Owner'],
    learningTopics: ['Product roadmap planning & prioritization frameworks (RICE, MoSCoW)', 'Writing Product Requirement Documents (PRDs)', 'Tracking product metrics (DAU, MAU, Churn, Retention)', 'Go-To-Market (GTM) strategy execution'],
    practiceProjects: ['Full PRD for a Mobile Banking Feature', 'Product Roadmap and Feature Prioritization Matrix', 'Competitive Product Benchmarking Deck']
  },
  {
    name: 'Project Management',
    category: 'Business & Management',
    subcategory: 'Management',
    description: 'Practice of initiating, planning, executing, controlling, and closing the work of a team to achieve specific goals and criteria.',
    difficulty: 'Beginner',
    relatedSkills: ['Agile', 'Scrum', 'Risk Management', 'Time Management'],
    commonRoles: ['Project Manager', 'Scrum Master', 'Delivery Manager'],
    learningTopics: ['Project scope, schedule, and budget constraints', 'Work Breakdown Structures (WBS) and Gantt charts', 'Resource allocation and stakeholder communications', 'Risk mitigation and contingency planning'],
    practiceProjects: ['End-to-End Project Plan and Timeline for Website Launch', 'Risk Register Matrix for Software Migration', 'Resource Allocation & Budgeting Sheet']
  },
  {
    name: 'Agile',
    category: 'Business & Management',
    subcategory: 'Methodologies',
    description: 'Iterative approach to project management and software development that helps teams deliver value to customers faster with fewer headaches.',
    difficulty: 'Beginner',
    relatedSkills: ['Scrum', 'Project Management', 'Product Management', 'Jira'],
    commonRoles: ['Scrum Master', 'Product Owner', 'Software Engineer'],
    learningTopics: ['4 Values and 12 Principles of Agile Manifesto', 'User stories, acceptance criteria and story points', 'Agile estimation techniques (Planning Poker)', 'Continuous improvement and retrospectives'],
    practiceProjects: ['Agile Sprint Planning Document with User Stories', 'Team Retrospective Action Board Template', 'Agile Transformation Roadmap for Small Team']
  },
  {
    name: 'Scrum',
    category: 'Business & Management',
    subcategory: 'Methodologies',
    description: 'Specific Agile framework used to manage knowledge work, with an emphasis on software development sprints, ceremonies, and artifacts.',
    difficulty: 'Beginner',
    relatedSkills: ['Agile', 'Project Management', 'Jira', 'Leadership'],
    commonRoles: ['Scrum Master', 'Product Owner', 'Development Team Member'],
    learningTopics: ['Scrum Roles (Scrum Master, Product Owner, Dev Team)', 'Scrum Ceremonies (Daily Standup, Planning, Review, Retro)', 'Scrum Artifacts (Product Backlog, Sprint Backlog, Increment)', 'Burndown charts and sprint velocity tracking'],
    practiceProjects: ['Simulated 2-Week Sprint Backlog & Velocity Plan', 'Daily Standup Impediment Tracker', 'Scrum Master Playbook for New Teams']
  },
  {
    name: 'Requirements Gathering',
    category: 'Business & Management',
    subcategory: 'Analysis',
    description: 'Process of determining what a particular project or product should accomplish through stakeholder interviews and observation.',
    difficulty: 'Beginner',
    relatedSkills: ['Business Analysis', 'Product Management', 'Communication'],
    commonRoles: ['Business Analyst', 'Product Manager', 'Consultant'],
    learningTopics: ['Functional vs Non-functional requirements', 'Stakeholder elicitation interviews & workshops', 'Writing SMART user stories and acceptance criteria', 'Traceability matrix management'],
    practiceProjects: ['Requirements Traceability Matrix for E-Commerce App', 'Stakeholder Interview Questionnaire & Notes Summary', 'Non-Functional Requirements Specification Document']
  },
  {
    name: 'Business Strategy',
    category: 'Business & Management',
    subcategory: 'Strategy',
    description: 'Long-term plan of action designed to achieve a particular goal or set of goals or objectives for a company.',
    difficulty: 'Intermediate',
    relatedSkills: ['Market Research', 'Business Analysis', 'Product Management'],
    commonRoles: ['Strategy Consultant', 'Business Development Manager', 'Founder'],
    learningTopics: ['SWOT and Porter’s Five Forces frameworks', 'Competitive positioning and differentiation', 'Business model canvas construction', 'Unit economics and revenue growth strategies'],
    practiceProjects: ['Business Model Canvas for a B2B SaaS Startup', 'Competitive Threat Analysis Report (Porter’s 5 Forces)', 'Strategic Growth Expansion Proposal']
  },
  {
    name: 'Market Research',
    category: 'Business & Management',
    subcategory: 'Research',
    description: 'Organized effort to gather information about target markets, competitors, customer demographics, and industry trends.',
    difficulty: 'Beginner',
    relatedSkills: ['Data Analysis', 'Business Strategy', 'Marketing'],
    commonRoles: ['Market Research Analyst', 'Product Marketer', 'Business Analyst'],
    learningTopics: ['Primary vs secondary research methods', 'TAM, SAM, SOM market sizing calculations', 'Competitor feature and pricing benchmarking', 'Customer survey design and data synthesis'],
    practiceProjects: ['Market Sizing (TAM/SAM/SOM) Analysis for EdTech', 'Comprehensive Competitor Intelligence Matrix', 'Customer Survey Findings Presentation']
  },
  {
    name: 'Operations',
    category: 'Business & Management',
    subcategory: 'Operations',
    description: 'Administration of business practices to create the highest level of efficiency possible within an organization.',
    difficulty: 'Beginner',
    relatedSkills: ['Business Analysis', 'Project Management', 'Time Management'],
    commonRoles: ['Operations Manager', 'Business Operations Analyst', 'COO'],
    learningTopics: ['Process optimization and workflow streamlining', 'Standard Operating Procedures (SOP) documentation', 'Vendor management and SLA monitoring', 'Operational KPI tracking and resource utilization'],
    practiceProjects: ['Customer Support Operations SOP Manual', 'Internal Tooling Workflow Optimization Proposal', 'Operational Cost Reduction Analysis']
  },
  {
    name: 'Risk Management',
    category: 'Business & Management',
    subcategory: 'Governance',
    description: 'Identification, evaluation, and prioritization of risks followed by coordinated application of resources to minimize impact.',
    difficulty: 'Intermediate',
    relatedSkills: ['Project Management', 'Business Strategy', 'Cybersecurity'],
    commonRoles: ['Risk Analyst', 'Project Manager', 'Compliance Officer'],
    learningTopics: ['Risk identification and categorization (Operational, Financial, Tech)', 'Qualitative and quantitative risk analysis (Risk Matrix)', 'Risk response strategies (Mitigate, Transfer, Accept, Avoid)', 'Continuous risk monitoring and escalation protocols'],
    practiceProjects: ['Enterprise Project Risk Assessment Matrix', 'IT Security & Data Loss Risk Mitigation Plan', 'Business Continuity Plan Overview']
  },
  {
    name: 'Financial Basics',
    category: 'Business & Management',
    subcategory: 'Finance',
    description: 'Understanding fundamental financial concepts including revenue, profit margins, cash flow, balance sheets, and ROI.',
    difficulty: 'Beginner',
    relatedSkills: ['Excel', 'Business Analysis', 'Data Analysis'],
    commonRoles: ['Financial Analyst', 'Business Analyst', 'Product Manager'],
    learningTopics: ['Income Statement, Balance Sheet & Cash Flow Statement', 'Gross margin, Net margin, and EBITDA calculation', 'Return on Investment (ROI) and Break-even analysis', 'Budgeting and forecasting basics'],
    practiceProjects: ['Simple Startup P&L Financial Model', 'ROI Calculation Tool for Software Investment', 'Departmental Quarterly Expense Budget Sheet']
  },

  // ==========================================
  // 10. MARKETING & SALES
  // ==========================================
  {
    name: 'Digital Marketing',
    category: 'Marketing & Sales',
    subcategory: 'Marketing',
    description: 'Promotion of brands and products to connect with potential customers using the internet and digital channels.',
    difficulty: 'Beginner',
    relatedSkills: ['SEO', 'SEM', 'Social Media Marketing', 'Google Analytics', 'Content Marketing'],
    commonRoles: ['Digital Marketing Specialist', 'Growth Marketer', 'Marketing Manager'],
    learningTopics: ['Marketing funnel stages (TOFU, MOFU, BOFU)', 'Multi-channel acquisition strategies', 'Customer Acquisition Cost (CAC) and LTV metrics', 'Campaign planning and budget allocation'],
    practiceProjects: ['Multi-channel Product Launch Campaign Plan', 'Customer Acquisition Strategy Deck', 'Performance Marketing Budget Calculator']
  },
  {
    name: 'SEO',
    category: 'Marketing & Sales',
    subcategory: 'Search Marketing',
    description: 'Search Engine Optimization: process of improving the quality and quantity of website traffic from search engines organically.',
    difficulty: 'Intermediate',
    relatedSkills: ['Digital Marketing', 'Content Marketing', 'Google Analytics', 'HTML'],
    commonRoles: ['SEO Specialist', 'Content Strategist', 'Growth Marketer'],
    learningTopics: ['On-page SEO (Title tags, meta descriptions, headings)', 'Technical SEO (Site speed, sitemaps, robots.txt, schema markup)', 'Keyword research and search intent analysis', 'Backlink building and domain authority strategies'],
    practiceProjects: ['Comprehensive Website SEO Audit & Action Plan', 'Keyword Research Matrix for Software Product', 'On-page SEO Optimization for 5 Key Landing Pages']
  },
  {
    name: 'SEM',
    category: 'Marketing & Sales',
    subcategory: 'Search Marketing',
    description: 'Search Engine Marketing: promotion of websites by increasing their visibility in search engine results pages primarily through paid advertising (PPC).',
    difficulty: 'Intermediate',
    relatedSkills: ['Digital Marketing', 'Google Analytics', 'SEO', 'Lead Generation'],
    commonRoles: ['PPC Specialist', 'Performance Marketer', 'Digital Ad Manager'],
    learningTopics: ['Google Ads search campaign structure', 'Bidding strategies (CPC, CPA, Target ROAS)', 'Ad copywriting and quality score optimization', 'Negative keyword management and conversion tracking'],
    practiceProjects: ['Google Ads Search Campaign Strategy Plan', 'Ad Copy & Extension Variations Test Matrix', 'Paid Search Budget and ROI Forecast Model']
  },
  {
    name: 'Social Media Marketing',
    category: 'Marketing & Sales',
    subcategory: 'Social Media',
    description: 'Use of social media platforms (LinkedIn, Twitter/X, Instagram, YouTube) to connect with your audience, build brand, and drive sales.',
    difficulty: 'Beginner',
    relatedSkills: ['Digital Marketing', 'Content Marketing', 'Copywriting', 'Brand Management'],
    commonRoles: ['Social Media Manager', 'Community Manager', 'Brand Strategist'],
    learningTopics: ['Platform-specific content strategies', 'Social media calendar planning and scheduling', 'Audience engagement and community building', 'Social media analytics and ROI measurement'],
    practiceProjects: ['1-Month Multi-platform Social Media Content Calendar', 'LinkedIn B2B Thought Leadership Campaign Strategy', 'Social Media Growth & Engagement Audit']
  },
  {
    name: 'Content Marketing',
    category: 'Marketing & Sales',
    subcategory: 'Inbound Marketing',
    description: 'Strategic marketing approach focused on creating and distributing valuable, relevant, and consistent content to attract a defined audience.',
    difficulty: 'Beginner',
    relatedSkills: ['Copywriting', 'SEO', 'Digital Marketing', 'Social Media Marketing'],
    commonRoles: ['Content Marketer', 'Content Writer', 'Brand Storyteller'],
    learningTopics: ['Content strategy aligned with buyer personas', 'Blog post writing, whitepapers, and case studies', 'Content distribution and repurposing techniques', 'Measuring content engagement and conversion rates'],
    practiceProjects: ['Content Marketing Pillar Strategy Document', '3 In-depth Technical Case Studies for B2B SaaS', 'Lead Magnet E-book Outline & Promotional Copy']
  },
  {
    name: 'Email Marketing',
    category: 'Marketing & Sales',
    subcategory: 'Retention Marketing',
    description: 'Act of sending a commercial message, typically to a group of people, using email to build customer relationships and drive sales.',
    difficulty: 'Beginner',
    relatedSkills: ['Digital Marketing', 'Copywriting', 'Lead Generation', 'CRM'],
    commonRoles: ['Email Marketer', 'Lifecycle Marketer', 'CRM Specialist'],
    learningTopics: ['Email list segmentation and lead nurturing', 'Designing automated drip campaigns and welcome sequences', 'Subject line copywriting and A/B testing', 'Open rates, CTR, deliverability, and CAN-SPAM compliance'],
    practiceProjects: ['5-Part Automated Onboarding Email Drip Campaign', 'Promotional Newsletter Template with High-converting CTA', 'Email List Re-engagement Strategy Plan']
  },
  {
    name: 'Google Analytics',
    category: 'Marketing & Sales',
    subcategory: 'Analytics',
    description: 'Web analytics service offering statistics and basic analytical tools for search engine optimization (SEO) and marketing purposes (GA4).',
    difficulty: 'Intermediate',
    relatedSkills: ['Data Analysis', 'Digital Marketing', 'SEO', 'Data Visualization'],
    commonRoles: ['Web Analyst', 'Marketing Analyst', 'Growth Marketer'],
    learningTopics: ['GA4 event-based tracking model', 'Custom events and conversion tracking', 'User acquisition and traffic source attribution', 'Creating custom exploration reports in GA4'],
    practiceProjects: ['GA4 Custom Event & Conversion Tracking Setup Plan', 'E-commerce User Funnel Drop-off Analysis Report', 'Traffic Channel Acquisition Performance Dashboard']
  },
  {
    name: 'Brand Management',
    category: 'Marketing & Sales',
    subcategory: 'Branding',
    description: 'Function of marketing that uses techniques to increase the perceived value of a product line or brand over time.',
    difficulty: 'Intermediate',
    relatedSkills: ['Digital Marketing', 'Content Marketing', 'UI/UX & Design', 'Copywriting'],
    commonRoles: ['Brand Manager', 'Marketing Strategist', 'Creative Director'],
    learningTopics: ['Brand identity, mission, and voice guidelines', 'Brand positioning and value propositions', 'Managing brand reputation and PR crises', 'Measuring brand equity and customer sentiment'],
    practiceProjects: ['Comprehensive Brand Guidelines Document', 'Brand Voice & Tone Reference Guide for Writers', 'Brand Positioning Repositioning Strategy Deck']
  },
  {
    name: 'Sales',
    category: 'Marketing & Sales',
    subcategory: 'Sales',
    description: 'Direct activities related to selling products or services to individual consumers (B2C) or enterprise organizations (B2B).',
    difficulty: 'Beginner',
    relatedSkills: ['Lead Generation', 'Negotiation', 'Communication', 'CRM'],
    commonRoles: ['Account Executive', 'Sales Representative', 'Business Development Representative'],
    learningTopics: ['Sales pipeline stages & deal forecasting', 'B2B consultative selling methodologies (SPIN, MEDDIC)', 'Handling buyer objections effectively', 'Closing techniques and contract negotiations'],
    practiceProjects: ['B2B Sales Pitch Deck and Discovery Call Script', 'Objection Handling Playbook for SaaS Product', 'Sales Pipeline Forecasting Model']
  },
  {
    name: 'Lead Generation',
    category: 'Marketing & Sales',
    subcategory: 'Sales & Growth',
    description: 'Initiation of consumer interest or enquiry into products or services of a business through inbound and outbound tactics.',
    difficulty: 'Beginner',
    relatedSkills: ['Digital Marketing', 'Sales', 'Email Marketing', 'CRM'],
    commonRoles: ['BDR / SDR', 'Lead Generation Specialist', 'Growth Hacker'],
    learningTopics: ['Inbound lead generation via gated content & landing pages', 'Outbound prospecting on LinkedIn and email', 'Lead qualification frameworks (BANT, MQL vs SQL)', 'Lead scoring and CRM routing'],
    practiceProjects: ['Outbound Cold Email & LinkedIn Sequence Playbook', 'Lead Generation Landing Page Optimization Plan', 'B2B Lead Scoring Model Document']
  },
  {
    name: 'CRM',
    category: 'Marketing & Sales',
    subcategory: 'Sales Tools',
    description: 'Customer Relationship Management: technology for managing all your company’s relationships and interactions with customers (HubSpot, Salesforce).',
    difficulty: 'Beginner',
    relatedSkills: ['Sales', 'Email Marketing', 'Lead Generation', 'Business Operations'],
    commonRoles: ['CRM Administrator', 'Sales Operations Specialist', 'Account Manager'],
    learningTopics: ['Contact and company record management', 'Deal pipelines and sales stage automation', 'Automated task workflows and email sequences', 'Sales reporting and pipeline health dashboards'],
    practiceProjects: ['HubSpot / Salesforce Pipeline Stage Configuration Plan', 'Automated Deal Stage Follow-up Workflow', 'Sales Team Activity KPI Dashboard']
  },
  {
    name: 'Copywriting',
    category: 'Marketing & Sales',
    subcategory: 'Content Creation',
    description: 'Art of writing text for advertising and marketing purposes to persuade readers to take a specific action (click, sign up, buy).',
    difficulty: 'Beginner',
    relatedSkills: ['Content Marketing', 'Digital Marketing', 'Email Marketing', 'SEO'],
    commonRoles: ['Copywriter', 'Content Strategist', 'Growth Marketer'],
    learningTopics: ['Copywriting formulas (AIDA, PAS, BAB)', 'Crafting high-converting headlines and CTAs', 'Writing persuasive landing page copy', 'Tone of voice and clarity in product messaging'],
    practiceProjects: ['SaaS Homepage Copy Rewrite (Hero, Features, Pricing)', 'High-converting Ad Copy Suite for Social Ads', 'Cold Outreach Email Copy Experiment Pack']
  },

  // ==========================================
  // 11. PROFESSIONAL SKILLS
  // ==========================================
  {
    name: 'Communication',
    category: 'Professional Skills',
    subcategory: 'Interpersonal',
    description: 'Ability to convey information effectively and efficiently across verbal, written, and digital mediums to diverse audiences.',
    difficulty: 'Beginner',
    relatedSkills: ['English Communication', 'Public Speaking', 'Presentation', 'Teamwork'],
    commonRoles: ['All Roles', 'Team Lead', 'Project Manager', 'Software Engineer'],
    learningTopics: ['Active listening and empathetic responses', 'Concise and structured written communication', 'Adapting messages to technical vs executive audiences', 'Giving and receiving constructive feedback'],
    practiceProjects: ['Technical Executive Summary for Non-technical Leaders', 'Constructive Peer Code Review Feedback Template', 'Effective Asynchronous Team Update Framework']
  },
  {
    name: 'English Communication',
    category: 'Professional Skills',
    subcategory: 'Language',
    description: 'Proficiency in professional spoken and written business English for global workplace collaboration and documentation.',
    difficulty: 'Beginner',
    relatedSkills: ['Communication', 'Public Speaking', 'Presentation', 'Resume Writing'],
    commonRoles: ['Software Engineer', 'Consultant', 'Business Analyst', 'All Roles'],
    learningTopics: ['Professional business vocabulary & grammar', 'Clear email writing and meeting etiquette', 'Pronunciation and articulate speech delivery', 'Structuring technical documentation in plain English'],
    practiceProjects: ['Professional Project Status Email Series', 'Recorded 3-Minute Technical Introduction Speech', 'Business Proposal Executive Summary in English']
  },
  {
    name: 'Public Speaking',
    category: 'Professional Skills',
    subcategory: 'Speaking',
    description: 'Art of performing a speech to a live audience with clarity, confidence, audience engagement, and persuasive delivery.',
    difficulty: 'Intermediate',
    relatedSkills: ['Presentation', 'Communication', 'Leadership'],
    commonRoles: ['Tech Speaker', 'Product Manager', 'Team Lead', 'Executive'],
    learningTopics: ['Overcoming stage anxiety & vocal pacing', 'Structuring an engaging opening and memorable conclusion', 'Using storytelling to illustrate technical concepts', 'Handling audience Q&A sessions smoothly'],
    practiceProjects: ['5-Minute Lightning Tech Talk Presentation', 'Keynote Speech Outline for Industry Panel', 'Recorded Technical Demo Presentation']
  },
  {
    name: 'Presentation',
    category: 'Professional Skills',
    subcategory: 'Speaking',
    description: 'Skills involved in creating visually engaging slide decks and delivering structured ideas persuasively to stakeholders.',
    difficulty: 'Beginner',
    relatedSkills: ['Public Speaking', 'Communication', 'UI/UX & Design'],
    commonRoles: ['Consultant', 'Product Manager', 'Software Engineer', 'Sales Lead'],
    learningTopics: ['Slide design principles and avoiding visual clutter', 'Structuring presentations with the Rule of Three', 'Executive slide storytelling', 'Delivering remote interactive presentations on Zoom/Teams'],
    practiceProjects: ['Quarterly Engineering Sprint Review Slide Deck', 'Product Pitch Deck for Executive Stakeholders', 'Technical Architecture Proposal Slides']
  },
  {
    name: 'Teamwork',
    category: 'Professional Skills',
    subcategory: 'Collaboration',
    description: 'Collaborative effort of a group to achieve a common goal or complete a task in the most effective and harmonious way.',
    difficulty: 'Beginner',
    relatedSkills: ['Communication', 'Leadership', 'Emotional Intelligence', 'Conflict Resolution'],
    commonRoles: ['All Roles', 'Software Engineer', 'Product Designer'],
    learningTopics: ['Cross-functional collaboration techniques', 'Trust building and psychological safety in teams', 'Accountability and shared ownership of outcomes', 'Asynchronous collaboration norms in remote teams'],
    practiceProjects: ['Team Working Agreement Charter Document', 'Cross-functional Collaboration Playbook', 'Peer Feedback & Recognition System Proposal']
  },
  {
    name: 'Leadership',
    category: 'Professional Skills',
    subcategory: 'Management',
    description: 'Action of leading a group of people or an organization, inspiring trust, fostering growth, and driving collective mission.',
    difficulty: 'Intermediate',
    relatedSkills: ['Teamwork', 'Emotional Intelligence', 'Decision Making', 'Communication'],
    commonRoles: ['Engineering Manager', 'Team Lead', 'Project Manager', 'Director'],
    learningTopics: ['Servant leadership vs directive leadership', 'Delegation and empowering team members', 'Conducting productive 1-on-1 career development meetings', 'Navigating change and team morale during high pressure'],
    practiceProjects: ['1-on-1 Meeting Agenda Template & Growth Framework', 'Engineering Team OKR Goal Setting Blueprint', 'Leadership Transition Action Plan']
  },
  {
    name: 'Problem Solving',
    category: 'Professional Skills',
    subcategory: 'Cognitive',
    description: 'Process of working through details of a problem to reach a logical solution, systematically breaking down ambiguity.',
    difficulty: 'Beginner',
    relatedSkills: ['Critical Thinking', 'Algorithms', 'Data Analysis', 'Software Development'],
    commonRoles: ['Software Engineer', 'Data Analyst', 'Consultant', 'All Roles'],
    learningTopics: ['Root cause analysis (5 Whys, Fishbone Diagram)', 'First-principles thinking breakdown', 'Brainstorming and evaluating trade-offs (Pros/Cons)', 'Implementing and validating chosen solutions'],
    practiceProjects: ['Post-mortem Root Cause Incident Report', 'Complex Architecture Trade-off Decision Document', 'Process Bottleneck Remediation Blueprint']
  },
  {
    name: 'Critical Thinking',
    category: 'Professional Skills',
    subcategory: 'Cognitive',
    description: 'Objective analysis and evaluation of an issue in order to form a sound judgment free from cognitive biases.',
    difficulty: 'Intermediate',
    relatedSkills: ['Problem Solving', 'Data Analysis', 'Statistics'],
    commonRoles: ['Product Manager', 'Software Architect', 'Data Scientist'],
    learningTopics: ['Identifying cognitive biases & logical fallacies', 'Evaluating evidence credibility and source validity', 'Questioning underlying assumptions in proposals', 'Formulating nuanced, balanced conclusions'],
    practiceProjects: ['Critical Review of Technology Adoption Proposal', 'Debiasing Checklist for Engineering Hiring Decisions', 'Analytical Critique of a Business Case Study']
  },
  {
    name: 'Time Management',
    category: 'Professional Skills',
    subcategory: 'Productivity',
    description: 'Process of planning and exercising conscious control of time spent on specific activities to increase efficiency and productivity.',
    difficulty: 'Beginner',
    relatedSkills: ['Project Management', 'Adaptability', 'Professional Skills'],
    commonRoles: ['All Roles', 'Software Engineer', 'Freelancer'],
    learningTopics: ['Eisenhower Matrix (Urgent vs Important)', 'Time blocking and deep work habits (Pomodoro)', 'Overcoming procrastination and managing interruptions', 'Prioritizing high-leverage daily goals'],
    practiceProjects: ['Personal Weekly Time-blocking & Priority Schedule', 'Daily Deep Work Audit & Distraction Mitigation Plan', 'Sprint Task Prioritization Matrix']
  },
  {
    name: 'Adaptability',
    category: 'Professional Skills',
    subcategory: 'Growth',
    description: 'Capacity to adjust to new conditions, adopt new tools quickly, and thrive in rapidly changing technical or organizational environments.',
    difficulty: 'Beginner',
    relatedSkills: ['Problem Solving', 'Emotional Intelligence', 'Professional Skills'],
    commonRoles: ['All Roles', 'Startup Engineer', 'Consultant'],
    learningTopics: ['Cultivating a growth mindset vs fixed mindset', 'Learning how to learn new programming languages quickly', 'Navigating organizational pivots and restructuring', 'Resilience in the face of setbacks and ambiguous requirements'],
    practiceProjects: ['Self-directed 7-Day Technology Learning Challenge Plan', 'Rapid Onboarding Playbook for New Codebase', 'Personal Resilience & Reflection Journal']
  },
  {
    name: 'Negotiation',
    category: 'Professional Skills',
    subcategory: 'Interpersonal',
    description: 'Discussion aimed at reaching an agreement on terms, pricing, timelines, or offers acceptable to all parties involved.',
    difficulty: 'Intermediate',
    relatedSkills: ['Communication', 'Conflict Resolution', 'Salary Negotiation'],
    commonRoles: ['Account Executive', 'Product Manager', 'Engineering Lead', 'All Roles'],
    learningTopics: ['BATNA (Best Alternative to a Negotiated Agreement)', 'Principled negotiation (Getting to Yes framework)', 'Value creation vs value claiming', 'Managing emotions and tactical pauses during negotiations'],
    practiceProjects: ['Vendor Contract Negotiation Roleplay Script', 'Project Deadline Extension Negotiation Plan', 'Cross-team Resource Allocation Agreement']
  },
  {
    name: 'Conflict Resolution',
    category: 'Professional Skills',
    subcategory: 'Interpersonal',
    description: 'Process by which two or more parties engaged in a disagreement, dispute, or debate reach a constructive, peaceful resolution.',
    difficulty: 'Intermediate',
    relatedSkills: ['Communication', 'Emotional Intelligence', 'Teamwork', 'Negotiation'],
    commonRoles: ['Team Lead', 'Engineering Manager', 'HR Specialist', 'All Roles'],
    learningTopics: ['Thomas-Kilmann Conflict Mode Instrument (TKI)', 'Depersonalizing disagreements and focusing on facts', 'Facilitating productive mediation conversations', 'Rebuilding trust after contentious workplace disagreements'],
    practiceProjects: ['Conflict Mediation Framework for Engineering Teams', 'Technical Architecture Disagreement Resolution Protocol', 'Post-conflict Team Alignment Charter']
  },
  {
    name: 'Emotional Intelligence',
    category: 'Professional Skills',
    subcategory: 'Interpersonal',
    description: 'Capability of individuals to recognize their own emotions and those of others, discern between different feelings, and guide behavior.',
    difficulty: 'Intermediate',
    relatedSkills: ['Communication', 'Leadership', 'Teamwork', 'Conflict Resolution'],
    commonRoles: ['Engineering Manager', 'Product Manager', 'Team Lead', 'All Roles'],
    learningTopics: ['Self-awareness and emotional triggers', 'Self-regulation and composure under stress', 'Empathy and reading non-verbal social cues', 'Building positive interpersonal workplace relationships'],
    practiceProjects: ['Personal Emotional Self-awareness Reflection Audit', 'Empathy-driven Team Feedback Framework', 'High-stress Situation De-escalation Plan']
  },
  {
    name: 'Networking',
    category: 'Professional Skills',
    subcategory: 'Career Growth',
    description: 'Cultivation of productive relationships with peers, industry professionals, mentors, and employers for mutual career benefit.',
    difficulty: 'Beginner',
    relatedSkills: ['Communication', 'LinkedIn Profile', 'Personal Branding'],
    commonRoles: ['All Roles', 'Job Seeker', 'Founder', 'Consultant'],
    learningTopics: ['Crafting a memorable 30-second introduction elevator pitch', 'Networking at tech conferences and meetups effectively', 'Authentic informational interview outreach on LinkedIn', 'Nurturing and staying in touch with professional connections'],
    practiceProjects: ['Informational Interview Outreach Template Suite', '30-Day Tech Community Engagement Plan', 'Professional Contact Management Tracking Sheet']
  },

  // ==========================================
  // 12. CAREER & JOB SKILLS
  // ==========================================
  {
    name: 'Resume Writing',
    category: 'Career & Job Skills',
    subcategory: 'Job Search',
    description: 'Crafting concise, ATS-friendly, metric-driven resumes that effectively highlight relevant technical competencies and achievements.',
    difficulty: 'Beginner',
    relatedSkills: ['Personal Branding', 'LinkedIn Profile', 'English Communication'],
    commonRoles: ['All Job Seekers', 'Software Engineer', 'Data Analyst'],
    learningTopics: ['XYZ formula (Accomplished [X], as measured by [Y], by doing [Z])', 'ATS keyword optimization and clean formatting', 'Writing concise, impactful technical project bullet points', 'Tailoring resumes to specific job descriptions'],
    practiceProjects: ['Polished ATS-optimized 1-Page Technical Resume', 'Tailored Resume Variations for Frontend vs Full Stack', 'Action Verb & Metric Enhancement Audit']
  },
  {
    name: 'LinkedIn Profile',
    category: 'Career & Job Skills',
    subcategory: 'Job Search',
    description: 'Optimizing your professional LinkedIn presence, headline, summary, project highlights, and network visibility for recruiters.',
    difficulty: 'Beginner',
    relatedSkills: ['Resume Writing', 'Personal Branding', 'Networking'],
    commonRoles: ['All Job Seekers', 'Tech Professionals'],
    learningTopics: ['Compelling technical headline formulas', 'About summary storytelling that showcases impact', 'Showcasing verified projects, skills, and certifications', 'Optimizing profile visibility for recruiter search filters'],
    practiceProjects: ['Complete LinkedIn Profile Overhaul & Headline Rewrite', 'Compelling About Section Story Draft', 'Project Showcase Media Section Curation']
  },
  {
    name: 'Interview Preparation',
    category: 'Career & Job Skills',
    subcategory: 'Interviews',
    description: 'Comprehensive preparation strategy covering company research, answer structuring, mock practice, and interview day readiness.',
    difficulty: 'Beginner',
    relatedSkills: ['Technical Interview', 'Behavioral Interview', 'Communication'],
    commonRoles: ['All Job Seekers', 'Candidates'],
    learningTopics: ['Researching company tech stack and business model', 'Preparing intelligent questions to ask interviewers', 'Overcoming interview anxiety and mock practice', 'Following up professionally post-interview'],
    practiceProjects: ['Target Company Deep-dive Research Dossier', 'List of 10 Strategic Questions to Ask Interviewers', 'Mock Interview Practice Schedule & Recording']
  },
  {
    name: 'Technical Interview',
    category: 'Career & Job Skills',
    subcategory: 'Interviews',
    description: 'Mastery of technical rounds assessing core computer science fundamentals, architecture design, and problem-solving skills.',
    difficulty: 'Intermediate',
    relatedSkills: ['Coding Interview', 'System Design', 'Data Structures', 'Algorithms'],
    commonRoles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    learningTopics: ['Explaining thought process out loud while coding', 'Clarifying ambiguous requirements before coding', 'Analyzing Time & Space complexity (Big-O)', 'Handling edge cases and testing code interactively'],
    practiceProjects: ['Mock Technical Phone Screen Simulation', 'Technical Concept Explanation Audio Practice', 'Big-O Complexity Cheat Sheet and Analysis']
  },
  {
    name: 'HR Interview',
    category: 'Career & Job Skills',
    subcategory: 'Interviews',
    description: 'Navigating human resources screening calls assessing cultural fit, career trajectory, motivations, and salary expectations.',
    difficulty: 'Beginner',
    relatedSkills: ['Behavioral Interview', 'Salary Negotiation', 'Communication'],
    commonRoles: ['All Job Seekers'],
    learningTopics: ['Answering "Tell me about yourself" with concise impact', 'Explaining career transitions and motivation for the role', 'Navigating salary expectation questions professionally', 'Demonstrating cultural alignment and enthusiasm'],
    practiceProjects: ['Scripted 90-Second "Tell Me About Yourself" Pitch', 'HR Screener Common Questions Prep Sheet', 'Professional Salary Expectation Script']
  },
  {
    name: 'Behavioral Interview',
    category: 'Career & Job Skills',
    subcategory: 'Interviews',
    description: 'Answering situational questions about past experiences, teamwork, conflicts, and challenges using the structured STAR method.',
    difficulty: 'Beginner',
    relatedSkills: ['STAR Method', 'Communication', 'HR Interview'],
    commonRoles: ['All Job Seekers', 'Software Engineer', 'Product Manager'],
    learningTopics: ['STAR method framework (Situation, Task, Action, Result)', 'Building a story bank of 6-8 versatile past experiences', 'Discussing past failures and learnings constructively', 'Showcasing leadership, initiative, and conflict resolution'],
    practiceProjects: ['Complete STAR Story Bank (6 Core Scenarios)', 'Recorded Behavioral Answer Practice Review', 'Failure-to-Learning Story Refinement']
  },
  {
    name: 'Group Discussion',
    category: 'Career & Job Skills',
    subcategory: 'Campus Hiring',
    description: 'Participating constructively in campus placement group discussions, contributing structured points, and collaborating respectfully.',
    difficulty: 'Intermediate',
    relatedSkills: ['Communication', 'Public Speaking', 'Teamwork', 'Critical Thinking'],
    commonRoles: ['Campus Placement Candidates', 'Entry Level Applicants'],
    learningTopics: ['Initiating the discussion with a clear definition', 'Entering discussions politely without interrupting', 'Synthesizing conflicting viewpoints and building consensus', 'Structuring arguments with facts and logical reasoning'],
    practiceProjects: ['5 Current Tech Topic Summary Prep Sheets', 'Mock Group Discussion Facilitation Practice', 'Opening and Concluding Statement Templates']
  },
  {
    name: 'Quantitative Reasoning',
    category: 'Career & Job Skills',
    subcategory: 'Aptitude',
    description: 'Mathematical problem-solving ability tested during initial placement aptitude and screening rounds.',
    difficulty: 'Intermediate',
    relatedSkills: ['Logical Reasoning', 'Problem Solving', 'Statistics'],
    commonRoles: ['Entry Level Software Engineers', 'Data Analysts', 'Campus Hires'],
    learningTopics: ['Percentages, Profit & Loss, and Ratios', 'Time, Speed, and Distance calculations', 'Permutations, Combinations, and Probability', 'Shortcuts for mental math and estimation'],
    practiceProjects: ['100-Question Quantitative Aptitude Timed Challenge', 'Formulas and Mental Math Shortcut Sheet', 'Topic-wise Speed Improvement Tracker']
  },
  {
    name: 'Logical Reasoning',
    category: 'Career & Job Skills',
    subcategory: 'Aptitude',
    description: 'Ability to understand and logically work through concepts, patterns, deductions, and problems in aptitude assessments.',
    difficulty: 'Beginner',
    relatedSkills: ['Quantitative Reasoning', 'Critical Thinking', 'Problem Solving'],
    commonRoles: ['Entry Level Engineers', 'Campus Placements', 'All Job Seekers'],
    learningTopics: ['Deductive reasoning and syllogisms', 'Number and letter series patterns', 'Seating arrangements and blood relations', 'Data sufficiency and logical puzzles'],
    practiceProjects: ['Daily 30-Minute Logical Puzzle Challenge Pack', 'Seating Arrangement Solving Matrix Practice', 'Syllogism Deduction Rules Reference']
  },
  {
    name: 'Verbal Ability',
    category: 'Career & Job Skills',
    subcategory: 'Aptitude',
    description: 'Assessment of reading comprehension, vocabulary, grammar accuracy, and sentence correction in recruitment tests.',
    difficulty: 'Beginner',
    relatedSkills: ['English Communication', 'Communication', 'Reading Comprehension'],
    commonRoles: ['All Job Seekers', 'Campus Hires'],
    learningTopics: ['Reading comprehension speed and key point identification', 'Sentence correction and spotting grammatical errors', 'Vocabulary, synonyms, and antonyms in context', 'Para-jumbles and sentence ordering logic'],
    practiceProjects: ['Reading Comprehension Passage Speed Drill', '100 Common Grammar Error Correction Exercises', 'Daily High-frequency Vocab Flashcards']
  },
  {
    name: 'Coding Interview',
    category: 'Career & Job Skills',
    subcategory: 'Technical Hiring',
    description: 'Solving algorithmic, data structure, and live coding challenges under timed conditions during software engineering interviews.',
    difficulty: 'Advanced',
    relatedSkills: ['Data Structures', 'Algorithms', 'Python', 'C++', 'Java', 'JavaScript'],
    commonRoles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    learningTopics: ['Array, String, and Hash Table patterns (Two Pointers, Sliding Window)', 'Trees, Graphs, BFS, and DFS traversals', 'Dynamic Programming and memoization patterns', 'Writing clean, bug-free, edge-case-tested code quickly'],
    practiceProjects: ['Blind 75 Core LeetCode Patterns Solved Portfolio', 'Mock 45-Minute Timed Live Coding Sessions', 'Algorithm Pattern Cheat Sheet (Sliding Window, DFS, DP)']
  },
  {
    name: 'Portfolio Building',
    category: 'Career & Job Skills',
    subcategory: 'Personal Branding',
    description: 'Developing and curating public project portfolios, live demos, and GitHub repositories that prove practical engineering ability.',
    difficulty: 'Intermediate',
    relatedSkills: ['GitHub', 'Personal Branding', 'Web Development', 'Resume Writing'],
    commonRoles: ['Frontend Developer', 'Full Stack Developer', 'UI/UX Designer'],
    learningTopics: ['Selecting 2-3 standout, non-trivial projects', 'Writing stellar GitHub READMEs with architecture diagrams and live links', 'Deploying live demos with custom domains or free hosting', 'Documenting trade-offs, tech stack choices, and metrics'],
    practiceProjects: ['Stunning Personal Portfolio Website with Live Project Demos', 'Production-grade GitHub README with Architecture GIFs', 'Full Stack Project Case Study Writeup']
  },
  {
    name: 'Personal Branding',
    category: 'Career & Job Skills',
    subcategory: 'Career Growth',
    description: 'Conscious and intentional effort to create and influence public perception of an individual by positioning them as an authority in their field.',
    difficulty: 'Beginner',
    relatedSkills: ['LinkedIn Profile', 'Portfolio Building', 'Public Speaking', 'Networking'],
    commonRoles: ['Software Engineers', 'Designers', 'Founders', 'Consultants'],
    learningTopics: ['Defining your technical niche and unique value proposition', 'Sharing project learnings and technical tutorials publicly', 'Engaging constructively in open source and developer forums', 'Maintaining consistent branding across GitHub, LinkedIn, and Twitter'],
    practiceProjects: ['Technical Article / Tutorial Published on Dev.to or Medium', 'Personal Brand Positioning Statement & Bio Suite', '30-Day Technical Knowledge Sharing Calendar']
  },
  {
    name: 'Job Search Strategy',
    category: 'Career & Job Skills',
    subcategory: 'Job Search',
    description: 'Systematic approach to identifying target companies, leveraging referrals, tracking applications, and managing interview pipelines.',
    difficulty: 'Beginner',
    relatedSkills: ['Resume Writing', 'Networking', 'LinkedIn Profile', 'Interview Preparation'],
    commonRoles: ['All Job Seekers'],
    learningTopics: ['Target company tiering (Dream, Target, Safety companies)', 'Getting employee referrals via genuine networking', 'Organizing an application tracking spreadsheet / pipeline', 'Optimizing application timing and follow-up strategies'],
    practiceProjects: ['Target 30-Company Tiered Search Tracker', 'Referral Request Email & LinkedIn Template Suite', 'Weekly Application & Outreach Sprint Goal Tracker']
  },
  {
    name: 'Salary Negotiation',
    category: 'Career & Job Skills',
    subcategory: 'Compensation',
    description: 'Strategies for researching market compensation, evaluating job offers, and negotiating base pay, bonuses, and equity professionally.',
    difficulty: 'Intermediate',
    relatedSkills: ['Negotiation', 'Communication', 'HR Interview'],
    commonRoles: ['All Job Seekers', 'Experienced Candidates'],
    learningTopics: ['Researching realistic market compensation bands (Levels.fyi, AmbitionBox)', 'Evaluating total compensation (Base, Bonus, Equity/ESOPs, Benefits)', 'Counter-offer scripts and phrasing without risking the offer', 'Negotiating non-salary terms (Remote flexibility, joining bonus)'],
    practiceProjects: ['Market Compensation Research Report for Target Roles', 'Counter-offer Negotiation Script and Email Template', 'Total Compensation Comparison Calculator']
  },
  {
    name: 'Workplace Etiquette',
    category: 'Career & Job Skills',
    subcategory: 'Professionalism',
    description: 'Unwritten codes of conduct and professional behavior that govern how people interact in physical and remote office environments.',
    difficulty: 'Beginner',
    relatedSkills: ['Communication', 'Teamwork', 'Emotional Intelligence'],
    commonRoles: ['All Employees', 'Junior Engineers', 'New Graduates'],
    learningTopics: ['Professional communication norms on Slack / Email', 'Meeting etiquette (Punctuality, unmuting, camera on)', 'Respecting boundaries, diversity, and constructive disagreement', 'Taking accountability for deliverables and transparent progress updates'],
    practiceProjects: ['Remote Workplace Communication Standards Guide', 'Professional Meeting Etiquette Checklist', 'Onboarding Professionalism Guidelines for New Hires']
  }
];

module.exports = skillsData;
module.exports.skillsData = skillsData;
