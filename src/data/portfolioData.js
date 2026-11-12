/**
 * Portfolio Data Configuration for Niraai Madhi Rajendran
 */

export const portfolioData = {
  personal: {
    name: "Niraai Madhi Rajendran",
    shortName: "Niraai Madhi",
    role: "AI & Data Science Undergraduate",
    tagline: "Exploring LLMs, machine learning agents, data warehousing, and AI automation.",
    bio: [
      "Artificial Intelligence and Data Science undergraduate with hands-on experience in AI, machine learning, data analysis, data warehousing, and web application development.",
      "Skilled in Python, SQL, Pandas, NumPy, MS Excel, LLMs, prompt engineering, and AI automation. Experienced in developing AI agents, data warehouse solutions, responsive websites, dashboards, and data-driven applications.",
      "Oracle AI certified with foundational knowledge of Cloud and Generative AI concepts. Seeking AI/ML internship opportunities to apply technical and problem-solving skills to real-world AI solutions."
    ],
    location: "Tamil Nadu, India",
    phone: "9342322829",
    email: "niraai.she.her@gmail.com",
    linkedin: "https://www.linkedin.com/in/niraai-madhi-a46960324",
    github: "https://github.com/niraai-madhi",
    softSkills: ["Analytical Thinking", "Problem Solving", "Team Collaboration", "Quick Learner"]
  },

  skills: [
    {
      category: "Programming",
      items: ["Python", "SQL", "JavaScript"]
    },
    {
      category: "AI & GenAI",
      items: ["LLMs", "Prompt Engineering", "Generative AI", "AI Agents", "AI Automation"]
    },
    {
      category: "Data Analysis & Visuals",
      items: ["Pandas", "NumPy", "Data Cleaning", "Exploratory Data Analysis (EDA)", "Basic Statistical Analysis", "MS Excel", "Power BI", "Tableau"]
    },
    {
      category: "Database & Storage",
      items: ["SQL Queries", "Filtering & Aggregation", "Joins", "Data Warehousing"]
    },
    {
      category: "Web & Dev Tools",
      items: ["HTML", "CSS", "JavaScript", "Responsive Web Design", "API Integration", "Git", "GitHub"]
    }
  ],

  projects: [
    {
      id: "ai-job-finder",
      title: "AI LinkedIn Job Finder",
      tagline: "Career assistance system analyzing resumes & matching LinkedIn opportunities.",
      description: "Developed an AI-powered career assistance system to analyze resumes and identify relevant LinkedIn job opportunities. Leveraged LLMs and prompt engineering to automate job matching, resume analysis, and personalized cover-letter generation.",
      bg: "/images/landscapes/stream-in-the-mountains.jpg",
      screenshot: "/images/project-screenshots/desktop-agent.png",
      tags: ["Python", "LLMs", "Prompt Engineering", "APIs", "Automation"],
      featured: true
    },
    {
      id: "data-warehouse",
      title: "Enterprise Data Warehouse Solution",
      tagline: "Multi-source data warehouse architecture for analytics & reporting.",
      description: "Designed and implemented a data warehouse to organize and manage data from multiple sources. Utilized SQL and data transformation techniques to support efficient querying, analytics, and business reporting.",
      bg: "/images/landscapes/the-coming-storm.jpg",
      screenshot: "/images/project-screenshots/cli-agent.png",
      tags: ["SQL", "Data Warehousing", "ETL", "Data Modeling"],
      featured: true
    },
    {
      id: "airbnb-analysis",
      title: "NYC Airbnb Revenue Analysis (10,000+ Records)",
      tagline: "Exploratory data analysis uncovering pricing trends & revenue patterns.",
      description: "Analyzed 10,000+ Airbnb listing records to identify pricing trends and revenue patterns. Cleaned and structured data using Excel and Python (Pandas), and performed in-depth exploratory data analysis (EDA) to evaluate location-based pricing variations.",
      bg: "/images/nature-photos/soft-dunes.webp",
      screenshot: "/images/project-screenshots/editor-plan.png",
      tags: ["Python", "Pandas", "NumPy", "EDA", "MS Excel"],
      featured: false
    },
    {
      id: "ats-resume-checker",
      title: "Resume Creator & ATS Score Checker",
      tagline: "Automated resume parsing, ATS scoring & skill matching in Python.",
      description: "Developed a Python-based Resume Checker to analyze resumes and evaluate overall quality. Implemented automated parsing, ATS compatibility verification, and skill matching to generate actionable improvement suggestions.",
      bg: "/images/nature-photos/sunlit-leaves.webp",
      screenshot: "/images/project-screenshots/automation.png",
      tags: ["Python", "NLP", "Resume Parsing", "ATS Scoring"],
      featured: false
    },
    {
      id: "customer-behavior",
      title: "Customer Behavior Analysis with SQL",
      tagline: "SQL analytics on transaction records for customer segmentation.",
      description: "Analyzed customer transaction data using advanced SQL queries, including GROUP BY, window functions, and multi-table JOIN operations. Derived quantitative insights related to customer segmentation and purchasing patterns.",
      bg: "/images/landscapes/home-by-the-lake.jpg",
      screenshot: "/images/project-screenshots/automation-neutral.png",
      tags: ["SQL", "Aggregation", "Joins", "Data Analysis"],
      featured: false
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker & CGPA Calculator",
      tagline: "Personal finance monitoring dashboard & Python academic tools.",
      description: "Developed an interactive expense tracking application to record, categorize, and monitor personal expenses with dashboard-style summaries. Also created a Python-based CGPA calculator with grade-to-point logic.",
      bg: "/images/landscapes/the-coming-storm.jpg",
      screenshot: "/images/project-screenshots/cli-agent.png",
      tags: ["Python", "Web Dashboard", "Analytics", "Algorithms"],
      featured: false
    }
  ],

  experiences: [
    {
      period: "Recent",
      role: "Machine Learning Intern",
      organization: "Sparwix",
      location: "India",
      points: [
        "Collected, cleaned, and analyzed structured datasets using Python and Excel.",
        "Performed exploratory data analysis (EDA) to identify trends and patterns.",
        "Created interactive dashboards using Power BI and Tableau for decision support.",
        "Wrote SQL queries involving filtering, aggregation, and joins for analysis and reporting."
      ]
    },
    {
      period: "2024 – Present",
      role: "AI Agent Developer",
      organization: "Self-Employed",
      location: "Projects & Freelance",
      points: [
        "Created AI-powered agents using Python, LLMs, prompt engineering, and APIs.",
        "Developed automation workflows and chatbots for practical use cases.",
        "Built AI-powered solutions to automate repetitive tasks and improve business workflows."
      ]
    },
    {
      period: "2024 – Present",
      role: "Data Warehouse Developer",
      organization: "Self-Employed",
      location: "Projects & Analytics",
      points: [
        "Designed and developed data warehouse solutions to organize and manage data from multiple sources.",
        "Used SQL and data transformation techniques for data processing, storage, and analysis.",
        "Structured data for efficient querying, reporting, and analytical use."
      ]
    },
    {
      period: "2023 – Present",
      role: "Web Developer",
      organization: "Self-Employed",
      location: "Frontend & Full Stack",
      points: [
        "Designed and developed responsive websites and web applications using HTML, CSS, JavaScript, and modern tools.",
        "Built business websites with responsive layouts, interactive interfaces, and performance-focused designs.",
        "Integrated APIs and customized web solutions based on project requirements."
      ]
    }
  ],

  education: [
    {
      period: "Expected 2027",
      degree: "B.Tech in Artificial Intelligence and Data Science",
      institution: "Tagore Engineering College",
      location: "Tamil Nadu, India",
      gpa: "CGPA: 8.0",
      courses: [
        "Data Structures",
        "Database Management Systems",
        "Statistics & Probability",
        "Machine Learning Fundamentals"
      ]
    }
  ],

  certifications: [
    {
      title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
      issuer: "Oracle"
    },
    {
      title: "Claude 101",
      issuer: "Anthropic"
    },
    {
      title: "Microsoft Learnathon '25: Learn AI and GenAI Basics",
      issuer: "Microsoft"
    },
    {
      title: "Big Data – 301",
      issuer: "Infosys"
    },
    {
      title: "Self-Presentation Micro Certificate",
      issuer: "Wadhwani Foundation"
    },
    {
      title: "Government Skill Development Program",
      issuer: "Infosys"
    }
  ]
};
