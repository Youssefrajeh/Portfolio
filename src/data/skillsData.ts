import type { Skill, SkillCategoryFilter } from './types';

export const skillsData: Skill[] = [
  {
    id: 1,
    name: 'C#, .NET & ASP.NET Core',
    category: 'programming',
    level: 'Advanced',

    description: 'Developing full-stack web applications and RESTful APIs using modern .NET Core architecture.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg'
  },
  {
    id: 2,
    name: 'SQL Server',
    category: 'database',
    level: 'Advanced',

    description: 'Designing and managing relational databases with enforced validation rules and complex query optimization.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-original.svg'
  },
  {
    id: 3,
    name: 'Java',
    category: 'programming',
    level: 'Intermediate',

    description: 'Building robust, object-oriented applications, managing dependencies, and implementing interfaces.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
  },
  {
    id: 4,
    name: 'React',
    category: 'web',
    level: 'Intermediate',

    description: 'Building dynamic and responsive user interfaces that seamlessly consume backend REST APIs.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  {
    id: 5,
    name: 'TypeScript',
    category: 'programming',
    level: 'Intermediate',

    description: 'Writing typed React and Node.js code for front-end and API projects.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  },
  {
    id: 6,
    name: 'JavaScript',
    category: 'web',
    level: 'Advanced',

    description: 'Developing interactive frontend logic and cross-platform web applications.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    id: 7,
    name: 'HTML5 & CSS3',
    category: 'web',
    level: 'Advanced',

    description: 'Crafting semantically structured, accessible, and highly responsive web layouts.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'
  },
  {
    id: 8,
    name: 'Python',
    category: 'programming',
    level: 'Intermediate',

    description: 'Scripting, automation, and data processing tasks.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
  },
  {
    id: 9,
    name: 'Git & GitHub',
    category: 'tools',
    level: 'Intermediate',

    description: 'Managing source code, branching strategies, and collaborative development in Agile/Scrum environments.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
  },
  {
    id: 10,
    name: 'CI/CD Pipelines',
    category: 'tools',
    level: 'Intermediate',

    description: 'Automating build and deployment processes to streamline delivery and maintain code reliability.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg'
  },
  {
    id: 11,
    name: 'PowerShell',
    category: 'tools',
    level: 'Intermediate',

    description: 'Creating automation scripts and efficiently managing Windows OS environments and configurations.',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/PowerShell_5.0_icon.png'
  },
  {
    id: 12,
    name: 'Vue.js',
    category: 'web',
    level: 'Intermediate',

    description: 'Building single-page front ends that consume REST APIs.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
  },
  {
    id: 13,
    name: 'Node.js & Express',
    category: 'web',
    level: 'Intermediate',

    description: 'Building REST APIs and real-time services with Socket.IO.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
  },
  {
    id: 14,
    name: 'PostgreSQL',
    category: 'database',
    level: 'Intermediate',

    description: 'Relational data modelling accessed through Entity Framework Core.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
  },
  {
    id: 15,
    name: 'MongoDB',
    category: 'database',
    level: 'Intermediate',

    description: 'Document databases for Node.js applications, via Mongoose and Prisma.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'
  },
  {
    id: 16,
    name: 'Docker',
    category: 'tools',
    level: 'Intermediate',

    description: 'Packaging applications with multi-stage builds for cloud deployment.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
  }
];

export const skillCategories: SkillCategoryFilter[] = [
  { id: 'all', name: 'All Skills' },
  { id: 'programming', name: 'Languages' },
  { id: 'web', name: 'Web & Frameworks' },
  { id: 'database', name: 'Databases' },
  { id: 'tools', name: 'Tools & DevOps' }
];
