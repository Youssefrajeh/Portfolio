import type { Skill, SkillCategoryFilter } from './types';

export const skillsData: Skill[] = [
  {
    id: 1,
    name: 'C# & .NET Core',
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
    name: 'Angular',
    category: 'web',
    level: 'Beginner',

    description: 'Building component-based web applications with TypeScript.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
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
    name: 'Git, GitHub & GitLab',
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
  }
];

export const skillCategories: SkillCategoryFilter[] = [
  { id: 'all', name: 'All Skills' },
  { id: 'programming', name: 'Programming' },
  { id: 'web', name: 'Web Dev' },
  { id: 'database', name: 'Database' },
  { id: 'tools', name: 'Tools & DevOps' }
];
