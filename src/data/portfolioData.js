/**
 * Portfolio Data Configuration
 * Edit this file to customize all content, personal details, links, and projects.
 */

export const portfolioData = {
  personal: {
    name: "Alex Morgan",
    role: "Full-Stack Software Engineer",
    tagline: "Building resilient distributed systems & intuitive modern web experiences.",
    shortBio:
      "Passionate software engineer with hands-on experience in full-stack web development, cloud native architectures, and scalable API design. I love bridging technical rigor with delightful user experiences.",
    extendedBio:
      "I am currently in my final year of Computer Science and Engineering, actively building production-grade web applications and exploring distributed cloud services. Over the past 3 years, I've contributed to open-source software, completed high-impact software engineering internships, and led engineering initiatives in campus tech clubs. When I'm not writing code, you can find me analyzing system design case studies, tinkering with IoT microcontrollers, or participating in 48-hour hackathons.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    fallbackAvatar: "AM",
    location: "San Francisco, CA (Open to Remote / Relocation)",
    email: "alex.morgan.dev@example.com",
    availability: "Available for Full-time Roles & Internships",
    resumeUrl: "/resume.pdf", // Can be a local PDF in /public or external link
    socials: {
      github: "https://github.com/alexmorgan-dev",
      linkedin: "https://linkedin.com/in/alexmorgan-dev",
      twitter: "https://twitter.com/alexmorgan_dev",
      portfolio: "https://alexmorgan.dev"
    },
    metrics: [
      { label: "Years Coding", value: "3+" },
      { label: "Completed Projects", value: "24+" },
      { label: "Internships & Roles", value: "3" },
      { label: "Open Source PRs", value: "50+" }
    ]
  },

  careerInterests: [
    {
      title: "Cloud & Distributed Systems",
      description: "Designing fault-tolerant, horizontally scalable microservices using Kubernetes, Go, and Kafka.",
      icon: "Cloud"
    },
    {
      title: "Full-Stack Web Engineering",
      description: "Creating accessible, performant, and responsive web platforms using modern React, Next.js, and TypeScript.",
      icon: "Layout"
    },
    {
      title: "API Architecture & Security",
      description: "Architecting secure RESTful and GraphQL APIs with OAuth2, rate limiting, and zero-trust principles.",
      icon: "ShieldCheck"
    },
    {
      title: "AI-Augmented Developer Tooling",
      description: "Integrating intelligent LLM workflows and vector search pipelines into day-to-day developer productivity tools.",
      icon: "Cpu"
    }
  ],

  skills: {
    languages: [
      { name: "TypeScript", level: 92, category: "Languages", icon: "Code2", badge: "Advanced" },
      { name: "JavaScript (ES6+)", level: 95, category: "Languages", icon: "FileCode", badge: "Expert" },
      { name: "Python", level: 88, category: "Languages", icon: "Terminal", badge: "Advanced" },
      { name: "Go (Golang)", level: 80, category: "Languages", icon: "Cpu", badge: "Proficient" },
      { name: "Java", level: 82, category: "Languages", icon: "Coffee", badge: "Proficient" },
      { name: "C++", level: 78, category: "Languages", icon: "Binary", badge: "Intermediate" },
      { name: "SQL", level: 90, category: "Languages", icon: "Database", badge: "Advanced" },
      { name: "HTML5 / CSS3", level: 95, category: "Languages", icon: "Globe", badge: "Expert" }
    ],
    frameworks: [
      { name: "React 19 / 18", level: 95, category: "Frameworks", icon: "Atom", badge: "Advanced" },
      { name: "Next.js", level: 90, category: "Frameworks", icon: "Zap", badge: "Advanced" },
      { name: "Node.js & Express", level: 92, category: "Frameworks", icon: "Server", badge: "Advanced" },
      { name: "Tailwind CSS", level: 95, category: "Frameworks", icon: "Palette", badge: "Expert" },
      { name: "FastAPI", level: 84, category: "Frameworks", icon: "Activity", badge: "Proficient" },
      { name: "Spring Boot", level: 75, category: "Frameworks", icon: "Layers", badge: "Intermediate" },
      { name: "GraphQL", level: 82, category: "Frameworks", icon: "Network", badge: "Proficient" }
    ],
    databases: [
      { name: "PostgreSQL", level: 90, category: "Databases", icon: "Database", badge: "Advanced" },
      { name: "MongoDB", level: 88, category: "Databases", icon: "HardDrive", badge: "Advanced" },
      { name: "Redis", level: 85, category: "Databases", icon: "Zap", badge: "Proficient" },
      { name: "Prisma ORM", level: 90, category: "Databases", icon: "Layers", badge: "Advanced" },
      { name: "Supabase", level: 88, category: "Databases", icon: "CloudRain", badge: "Advanced" },
      { name: "MySQL", level: 82, category: "Databases", icon: "Table", badge: "Proficient" }
    ],
    tools: [
      { name: "Git & GitHub", level: 95, category: "Tools", icon: "GitBranch", badge: "Expert" },
      { name: "Docker", level: 86, category: "Tools", icon: "Box", badge: "Proficient" },
      { name: "AWS (S3, EC2, Lambda)", level: 82, category: "Tools", icon: "Cloud", badge: "Proficient" },
      { name: "Linux / Bash", level: 88, category: "Tools", icon: "TerminalSquare", badge: "Advanced" },
      { name: "Postman", level: 92, category: "Tools", icon: "Send", badge: "Advanced" },
      { name: "Vite / Webpack", level: 90, category: "Tools", icon: "Compass", badge: "Advanced" },
      { name: "CI/CD (GitHub Actions)", level: 85, category: "Tools", icon: "Workflow", badge: "Proficient" }
    ]
  },

  projects: [
    {
      id: "cloudpulse",
      title: "CloudPulse - Distributed Metrics & APM Dashboard",
      tagline: "Real-time telemetry and cluster monitoring with sub-second alert triggers.",
      category: "Full Stack",
      featured: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      description:
        "High-performance observability dashboard built to monitor containerized microservices. Ingests telemetry metrics over WebSocket and gRPC streams, aggregates time-series data with Redis and TimescaleDB, and renders live charts.",
      highlights: [
        "Handles 15,000+ metrics events/sec with under 50ms aggregation lag",
        "Configurable threshold alerts with Slack and Discord webhook integrations",
        "Interactive canvas graphs with zoomable timeline and log anomaly drill-downs"
      ],
      techStack: ["Next.js", "TypeScript", "Node.js", "Redis", "TimescaleDB", "Tailwind CSS", "Docker"],
      githubUrl: "https://github.com/alexmorgan-dev/cloudpulse-apm",
      liveUrl: "https://cloudpulse-demo.vercel.app"
    },
    {
      id: "synapse-ai",
      title: "SynapseAI - Collaborative Knowledge Workspace",
      tagline: "AI-enhanced multi-user documentation engine with semantic search.",
      category: "AI & Full Stack",
      featured: true,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      description:
        "Real-time rich-text markdown collaborative editor with embedded vector search (RAG) capabilities. Enables engineering teams to ask questions directly to their internal code documentation and specs.",
      highlights: [
        "Real-time operational transformation and conflict resolution via WebSockets",
        "OpenAI embeddings + pgvector for sub-second semantic document retrieval",
        "Granular RBAC with team workspaces, version histories, and markdown export"
      ],
      techStack: ["React 19", "FastAPI", "Python", "PostgreSQL", "pgvector", "Tailwind CSS"],
      githubUrl: "https://github.com/alexmorgan-dev/synapse-ai-docs",
      liveUrl: "https://synapse-docs-preview.vercel.app"
    },
    {
      id: "finflow",
      title: "FinFlow - Algorithmic Portfolio Tracker",
      tagline: "Automated asset tracking, tax-loss harvesting analytics & backtesting engine.",
      category: "Full Stack",
      featured: true,
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80",
      description:
        "Personal wealth and investment analytics suite that syncs with real-time exchange rates and market tickers. Calculates Sharpe ratio, maximum drawdown, and generates monthly rebalancing recommendations.",
      highlights: [
        "Direct integration with financial market APIs with Redis caching layer",
        "Monte Carlo risk simulation pipeline executed via web worker concurrency",
        "Multi-currency support with automated currency conversion"
      ],
      techStack: ["TypeScript", "React", "Node.js", "Express", "Prisma", "PostgreSQL", "Chart.js"],
      githubUrl: "https://github.com/alexmorgan-dev/finflow-analytics",
      liveUrl: "https://finflow-demo.vercel.app"
    },
    {
      id: "devdock",
      title: "DevDock - Instant Ephemeral Dev Environments",
      tagline: "Spin up isolated container development sandboxes in the browser in seconds.",
      category: "Developer Tools",
      featured: false,
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1000&q=80",
      description:
        "Cloud development CLI and web orchestrator that provisions isolated Docker containers with pre-installed toolchains, web IDE, and terminal streaming via xterm.js.",
      highlights: [
        "Zero-configuration Node.js, Python, and Go sandbox templates",
        "Resource isolation with cgroups and automated 30-minute idle sleep timeouts",
        "Web-based bash terminal with bidirectional WebSocket streaming"
      ],
      techStack: ["Go", "Docker API", "React", "WebSocket", "Tailwind CSS"],
      githubUrl: "https://github.com/alexmorgan-dev/devdock-orchestrator",
      liveUrl: "https://devdock.dev"
    },
    {
      id: "healthhub",
      title: "HealthHub - Telemedicine Patient Portal",
      tagline: "HIPAA-compliant video consults, digital prescriptions and EHR records.",
      category: "Full Stack",
      featured: false,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
      description:
        "Full-fledged clinical telehealth portal featuring WebRTC peer-to-peer encrypted video calls, appointment booking, digital prescriptions, and automated appointment reminders.",
      highlights: [
        "End-to-end encrypted WebRTC audio/video consultations",
        "Calendar scheduling engine with Google Calendar two-way sync",
        "Automated PDF prescription generation and encrypted digital signatures"
      ],
      techStack: ["Next.js", "WebRTC", "PostgreSQL", "Tailwind CSS", "Stripe API"],
      githubUrl: "https://github.com/alexmorgan-dev/healthhub-telehealth",
      liveUrl: "https://healthhub-portal.vercel.app"
    },
    {
      id: "ciphergate",
      title: "CipherGate - Zero-Knowledge Password Vault",
      tagline: "Client-side encrypted credential manager with biometrics and audit logs.",
      category: "Security & Tools",
      featured: false,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
      description:
        "Modern password manager leveraging Web Crypto API (AES-GCM-256 and PBKDF2) where encryption keys never leave the user's client browser device.",
      highlights: [
        "Client-side PBKDF2 key derivation with 600,000 iterations",
        "Password leak checker using HIBP k-Anonymity API",
        "Passkey and WebAuthn biometric unlock support"
      ],
      techStack: ["React", "Web Crypto API", "IndexedDB", "Tailwind CSS"],
      githubUrl: "https://github.com/alexmorgan-dev/ciphergate-vault",
      liveUrl: "https://ciphergate.vercel.app"
    }
  ],

  experiences: [
    {
      id: "exp-1",
      role: "Software Engineering Intern",
      organization: "Acme Cloud Technologies",
      location: "San Jose, CA (Hybrid)",
      type: "Internship",
      duration: "May 2025 - August 2025 (4 mos)",
      status: "Completed",
      description:
        "Engineered core backend services and micro-frontend modules for an enterprise cloud management platform serving 200k+ active daily users.",
      responsibilities: [
        "Built and deployed RESTful microservices in Go and Node.js, reducing API response times by 32% across 12 high-traffic endpoints.",
        "Refactored legacy customer billing dashboard into responsive React and Tailwind components, improving Lighthouse accessibility score from 68 to 98.",
        "Created an automated GitHub Actions CI/CD pipeline with unit testing and Docker container scans, slashing deployment failure rates by 45%.",
        "Collaborated with senior architects on zero-downtime database migration strategies for a PostgreSQL cluster with 10M+ rows."
      ],
      techStack: ["Go", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GitHub Actions"]
    },
    {
      id: "exp-2",
      role: "Full-Stack Developer Intern",
      organization: "Nexus Labs & Innovations",
      location: "San Francisco, CA (Remote)",
      type: "Internship",
      duration: "January 2025 - April 2025 (4 mos)",
      status: "Completed",
      description:
        "Contributed to the development of a real-time analytics portal and data visualization pipeline for IoT sensor hardware fleets.",
      responsibilities: [
        "Implemented real-time data streaming over WebSockets and Redis pub/sub, enabling live sensor telemetry updates under 100ms.",
        "Developed interactive telemetry charts using React and Canvas, rendering 50,000+ data points smoothly at 60 FPS without DOM lag.",
        "Integrated role-based access control (RBAC) and JWT authentication with refresh token rotation.",
        "Authored comprehensive integration test suites using Jest and Supertest, boosting code test coverage from 55% to 84%."
      ],
      techStack: ["React", "Express", "Redis", "MongoDB", "WebSockets", "Jest", "Tailwind CSS"]
    },
    {
      id: "exp-3",
      role: "Undergraduate Teaching Assistant & Lab Mentor",
      organization: "University School of Computing",
      location: "Campus",
      type: "Academic Role",
      duration: "August 2024 - December 2024 (5 mos)",
      status: "Completed",
      description:
        "Mentored 120+ undergraduate students in Data Structures, Algorithms, and Object-Oriented Software Design in Java & C++.",
      responsibilities: [
        "Conducted weekly laboratory sessions demonstrating asymptotic complexity analysis, graph algorithms, and dynamic programming.",
        "Reviewed and graded 400+ student programming assignments, providing constructive code feedback on clean architecture and memory management.",
        "Hosted weekly 1-on-1 office hours to debug complex segmentation faults and concurrency race conditions."
      ],
      techStack: ["Java", "C++", "Data Structures", "Algorithms", "Git", "Linux"]
    }
  ],

  education: [
    {
      degree: "Bachelor of Science in Computer Science & Engineering",
      institution: "State University of California, School of Engineering",
      location: "California, USA",
      duration: "2022 - 2026 (Expected Graduation: May 2026)",
      gpa: "3.85 / 4.0 (Dean's Honor List)",
      courses: [
        "Data Structures & Algorithms",
        "Operating Systems & Concurrency",
        "Database Management Systems",
        "Distributed Systems & Cloud Computing",
        "Computer Networks & Security",
        "Software Engineering Methodologies",
        "Artificial Intelligence & Machine Learning"
      ],
      activities: [
        "President, Google Developer Student Clubs (GDSC)",
        "Winner, Annual University Hackathon (1st place among 60 teams)",
        "Member, ACM Student Chapter"
      ]
    }
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate (SAA-C03)",
      issuer: "Amazon Web Services",
      date: "Issued Nov 2024 · Expires Nov 2027",
      credentialId: "AWS-SAA-88492019",
      url: "https://aws.amazon.com/verification",
      badgeIcon: "Cloud"
    },
    {
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      date: "Issued Jun 2024",
      credentialId: "META-FED-5529103",
      url: "https://coursera.org/verify/meta",
      badgeIcon: "Layers"
    },
    {
      name: "PostgreSQL Database Administrator & Performance Tuning",
      issuer: "Linux Foundation / EdX",
      date: "Issued Mar 2024",
      credentialId: "LF-PG-309182",
      url: "https://edx.org",
      badgeIcon: "Database"
    },
    {
      name: "Docker Certified Associate (DCA)",
      issuer: "Docker Inc.",
      date: "Issued Jan 2024",
      credentialId: "DC-8729104",
      url: "https://docker.com",
      badgeIcon: "Box"
    }
  ],

  workshops: [
    {
      title: "Microservices Architecture & Event-Driven Systems with Kafka",
      organizer: "Confluent & Cloud Native Foundation",
      duration: "3-Day Intensive Workshop (Oct 2025)",
      description: "Hands-on implementation of CQRS, event sourcing, Kafka streams, and distributed transaction sagas."
    },
    {
      title: "Kubernetes in Production: Helm, Ingress & GitOps",
      organizer: "DevOps Global Summit",
      duration: "Weekend Bootcamp (July 2025)",
      description: "Cluster configuration, ArgoCD declarative continuous delivery, and zero-downtime rolling deployments."
    },
    {
      title: "Modern Full-Stack React 19 & Server Components Deep Dive",
      organizer: "React Summit Workshops",
      duration: "2-Day Masterclass (April 2025)",
      description: "Architectural patterns for React Server Components (RSC), server actions, streaming SSR, and asset optimization."
    },
    {
      title: "Applied Generative AI & Vector Search Systems",
      organizer: "AI Engineer Conference",
      duration: "Full-Day Hands-on Lab (Feb 2025)",
      description: "Building production RAG pipelines, chunking heuristics, embedding fine-tuning, and semantic caching."
    }
  ],

  contact: {
    email: "alex.morgan.dev@example.com",
    phone: "+1 (555) 349-2048",
    location: "San Francisco, California, United States",
    timezone: "PST (UTC-8) - Flexible for all US & global timezones",
    responseTime: "Typically replies within 24 hours",
    socials: {
      github: {
        username: "alexmorgan-dev",
        url: "https://github.com/alexmorgan-dev"
      },
      linkedin: {
        username: "alexmorgan-dev",
        url: "https://linkedin.com/in/alexmorgan-dev"
      },
      twitter: {
        username: "@alexmorgan_dev",
        url: "https://twitter.com/alexmorgan_dev"
      }
    }
  }
};
