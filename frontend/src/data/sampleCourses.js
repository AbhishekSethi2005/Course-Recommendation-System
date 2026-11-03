// Predefined suggestions and metadata for CourseIQ Discover Courses

export const INTEREST_CATEGORIES = {
  "Artificial Intelligence": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Natural Language Processing",
    "Computer Vision",
    "Large Language Models",
    "AI Agents"
  ],
  "Programming": [
    "Python Programming",
    "Java Programming",
    "C++",
    "JavaScript",
    "Data Structures & Algorithms",
    "Object-Oriented Programming"
  ],
  "Web Development": [
    "HTML & CSS",
    "React.js",
    "Node.js",
    "Full Stack Development",
    "Next.js",
    "Backend Development"
  ],
  "Data & Analytics": [
    "Data Science",
    "Data Analytics",
    "Power BI",
    "SQL",
    "Data Engineering",
    "Big Data"
  ],
  "Cloud & Security": [
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "DevOps",
    "Cybersecurity",
    "Ethical Hacking"
  ]
};

export const INITIAL_INTEREST_SUGGESTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Full Stack Development",
  "Python Programming",
  "Cloud Computing"
];

export const ALL_SKILL_SUGGESTIONS = [
  "Python", "Java", "C++", "JavaScript", "React", "Node.js",
  "HTML", "CSS", "SQL", "MongoDB", "MySQL", "Machine Learning",
  "Deep Learning", "Data Analysis", "Power BI", "Excel", "AWS",
  "Azure", "Docker", "Git", "GitHub", "TensorFlow", "PyTorch", "Linux"
];

export const INITIAL_POPULAR_SKILLS = [
  "Java", "JavaScript", "Node.js", "HTML", "CSS", "Git", "AWS", "Docker"
];

export const ALL_COMPLETED_COURSES = [
  "Python for Everybody",
  "Machine Learning Specialization",
  "Deep Learning Specialization",
  "Google Data Analytics Professional Certificate",
  "IBM Data Science Professional Certificate",
  "CS50's Introduction to Computer Science",
  "Meta Front-End Developer Professional Certificate",
  "AWS Cloud Practitioner Essentials",
  "Introduction to Cybersecurity",
  "SQL for Data Science",
  "Generative AI Fundamentals",
  "Full Stack Web Development"
];

export const INITIAL_COMMON_COURSES = [
  "Machine Learning Specialization",
  "Deep Learning Specialization",
  "CS50",
  "AWS Essentials"
];

export const DIFFICULTY_OPTIONS = [
  {
    id: "any",
    label: "Any Level",
    description: "Find courses across all difficulty levels."
  },
  {
    id: "beginner",
    label: "Beginner",
    description: "For users who are new to a subject."
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "For users with some existing knowledge."
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "For users seeking deeper technical knowledge."
  }
];

export const PRESET_COUNTS = [5, 10, 15, 20];

export const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Machine Learning with Python",
    provider: "Coursera",
    university: "IBM",
    matchPercentage: 96,
    rating: 4.8,
    reviews: "128k",
    difficulty: "Intermediate",
    duration: "~ 22 hours",
    certificateType: "Course",
    contentScore: 97,
    skillsScore: 95,
    description: "Learn key machine learning concepts and build models using Python, including data preprocessing, model training and evaluation.",
    whyMatches: "Perfect fit for your interest in machine learning and Python, and aligns with your selected intermediate level.",
    skills: ["Python", "Machine Learning", "Data Analysis", "Scikit-Learn"],
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    url: "https://www.coursera.org/learn/machine-learning-with-python",
    icon: "ai"
  },
  {
    id: 2,
    title: "Deep Learning Specialization",
    provider: "Coursera",
    university: "DeepLearning.AI",
    matchPercentage: 94,
    rating: 4.7,
    reviews: "42k",
    difficulty: "Advanced",
    duration: "~ 3 months",
    certificateType: "Specialization",
    contentScore: 95,
    skillsScore: 92,
    description: "A comprehensive specialization covering neural networks, deep learning, hyperparameter tuning, and real-world AI applications.",
    whyMatches: "Recommended because of your strong interest in AI and machine learning, and it extends your existing skills to a deeper level.",
    skills: ["Deep Learning", "Neural Networks", "Computer Vision", "TensorFlow"],
    gradient: "from-purple-600 via-pink-600 to-rose-600",
    url: "https://www.coursera.org/specializations/deep-learning",
    icon: "brain"
  },
  {
    id: 3,
    title: "AWS Cloud Practitioner Essentials",
    provider: "AWS",
    university: "Amazon Web Services",
    matchPercentage: 91,
    rating: 4.6,
    reviews: "85k",
    difficulty: "Beginner",
    duration: "~ 12 hours",
    certificateType: "Professional",
    contentScore: 92,
    skillsScore: 89,
    description: "Learn the fundamentals of AWS, including core services, cloud concepts, security and compliance, and real-world use cases.",
    whyMatches: "Aligns with your interest in cloud computing and adds a valuable industry-relevant skill to your profile.",
    skills: ["AWS", "Cloud Computing", "Cloud Fundamentals", "DevOps"],
    gradient: "from-amber-600 via-orange-600 to-yellow-600",
    url: "https://www.coursera.org/learn/aws-cloud-practitioner-essentials",
    icon: "cloud"
  },
  {
    id: 4,
    title: "Python for Everybody",
    provider: "Coursera",
    university: "University of Michigan",
    matchPercentage: 90,
    rating: 4.8,
    reviews: "120k",
    difficulty: "Beginner",
    duration: "~ 8 weeks",
    certificateType: "Specialization",
    contentScore: 91,
    skillsScore: 88,
    description: "Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data.",
    whyMatches: "Great foundational course matching your Python interest with high student ratings.",
    skills: ["Python", "Data Structures", "SQL", "Web Scraping"],
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    url: "https://www.coursera.org/specializations/python",
    icon: "python"
  },
  {
    id: 5,
    title: "The Complete Web Development Bootcamp",
    provider: "Udemy",
    university: "The App Brewery",
    matchPercentage: 88,
    rating: 4.7,
    reviews: "250k",
    difficulty: "Beginner",
    duration: "~ 12 weeks",
    certificateType: "Course",
    contentScore: 89,
    skillsScore: 86,
    description: "Master modern full-stack web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
    whyMatches: "Covers front-to-back engineering practices matching your web development interests.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    gradient: "from-purple-600 via-indigo-600 to-cyan-600",
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    icon: "web"
  },
  {
    id: 6,
    title: "Google Data Analytics Professional Certificate",
    provider: "Google",
    university: "Google",
    matchPercentage: 87,
    rating: 4.8,
    reviews: "95k",
    difficulty: "Beginner",
    duration: "~ 6 months",
    certificateType: "Professional Certificate",
    contentScore: 88,
    skillsScore: 85,
    description: "Gain in-demand skills in data cleaning, problem solving, critical thinking, data ethics, and data visualization with tools like spreadsheets, SQL, Tableau, and R.",
    whyMatches: "Provides high industry relevance with hands-on labs matching your data analytics goals.",
    skills: ["Data Analysis", "SQL", "Tableau", "R Programming"],
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
    icon: "data"
  }
];

export const CATEGORIES = [
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    shortName: "Artificial Intelligence",
    description: "Neural networks, deep learning, NLP, computer vision, and predictive AI models.",
    coursesCount: "420+ courses",
    query: "Artificial Intelligence Machine Learning Deep Learning neural networks",
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "NLP"],
    color: "#8055FF"
  },
  {
    id: "data-science",
    name: "Data Science & Analytics",
    shortName: "Data Science & Analytics",
    description: "Statistical modeling, data wrangling, SQL analytics, visualization, and big data.",
    coursesCount: "380+ courses",
    query: "Data Science Data Analysis SQL Pandas Statistics Visualization",
    skills: ["Python", "SQL", "Pandas", "Tableau", "PowerBI"],
    color: "#23D18B"
  },
  {
    id: "web-dev",
    name: "Web Development",
    shortName: "Web Development",
    description: "Modern frontend and backend architectures, full-stack frameworks, and RESTful APIs.",
    coursesCount: "510+ courses",
    query: "Web Development Full Stack React JavaScript HTML CSS Node.js",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Next.js"],
    color: "#6366F1"
  },
  {
    id: "software-eng",
    name: "Programming & Software Engineering",
    shortName: "Software Engineering",
    description: "Core algorithms, data structures, design patterns, and systems programming.",
    coursesCount: "640+ courses",
    query: "Software Engineering Object Oriented Programming Data Structures Algorithms Python Java C++",
    skills: ["Python", "Java", "C++", "Algorithms", "Git"],
    color: "#38BDF8"
  },
  {
    id: "cloud-devops",
    name: "Cloud Computing & DevOps",
    shortName: "Cloud Computing",
    description: "Containerization, CI/CD pipelines, Kubernetes, AWS, GCP, and cloud architecture.",
    coursesCount: "290+ courses",
    query: "Cloud Computing AWS Azure DevOps Docker Kubernetes CI/CD",
    skills: ["AWS", "Docker", "Kubernetes", "Linux", "Terraform"],
    color: "#06B6D4"
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    shortName: "Cyber Security",
    description: "Ethical hacking, network defense, threat intelligence, and digital cryptography.",
    coursesCount: "190+ courses",
    query: "Cybersecurity Network Security Ethical Hacking Information Security Cryptography",
    skills: ["Network Security", "Penetration Testing", "Linux", "Wireshark", "SOC"],
    color: "#EC4899"
  },
  {
    id: "database",
    name: "Database Management",
    shortName: "Database Management",
    description: "Relational database design, NoSQL datastores, optimization, and database administration.",
    coursesCount: "220+ courses",
    query: "Database Management SQL PostgreSQL MongoDB NoSQL Database Design",
    skills: ["SQL", "PostgreSQL", "MongoDB", "MySQL", "Redis"],
    color: "#F59E0B"
  },
  {
    id: "business",
    name: "Business & Management",
    shortName: "Business & Management",
    description: "Product management, strategic leadership, quantitative business analysis, and operations.",
    coursesCount: "340+ courses",
    query: "Business Management Project Management Leadership Strategic Planning Entrepreneurship",
    skills: ["Project Management", "Leadership", "Agile", "Strategy", "Finance"],
    color: "#F43F5E"
  }
];

export const POPULAR_SKILLS = ALL_SKILL_SUGGESTIONS;
