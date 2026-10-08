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
  /**
   * How the image is framed: 'artwork' (square illustration, shown as an
   * icon on the project page) or 'screenshot' (16:10 page capture, shown
   * large). Defaults to 'artwork'.
   */
  imageType?: 'artwork' | 'screenshot';
  description: string;
  /** Source repository. */
  link: string;
  /** Live, publicly reachable deployment, when one exists. */
  demo?: string;
  /** Shown first, with a "Featured" label. Keep to two or three projects. */
  featured?: boolean;
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

export interface Education {
  id: number;
  credential: string;
  institution: string;
  location: string;
  /** e.g. "2023 – 2026" */
  period: string;
  /** Short facts shown as tags, e.g. "Co-op", "GPA 3.9". */
  highlights: string[];
  /** Notable coursework or transferable skills. */
  details: string[];
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
