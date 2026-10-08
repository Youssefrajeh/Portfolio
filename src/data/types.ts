// Shared content model. Both the modern site and the retro desktop render
// from these same data files, so content only ever needs editing once.

export type ProjectCategory = 'web' | 'fullstack' | 'cpp' | 'java' | 'csharp' | 'android';

export interface TechItem {
  name: string;
  icon: string;
}

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  /** Screenshot under /public. Omitted when none exists yet - UIs render a placeholder. */
  image?: string;
  description: string;
  link: string;
  duration: string;
  role: string;
  detailedDescription: string;
  techStack: TechItem[];
  features: string[];
  challenges: string;
}

export interface ProjectFilter {
  id: ProjectCategory | 'all';
  name: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
}

export type SkillCategory = 'programming' | 'web' | 'database' | 'tools';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description: string;
  icon: string;
}

export interface SkillCategoryFilter {
  id: SkillCategory | 'all';
  name: string;
}
