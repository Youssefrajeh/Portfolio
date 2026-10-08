import type { Project } from '@/data/types';

interface ProjectImageProps {
  project: Pick<Project, 'title' | 'image'>;
  className?: string;
  /**
   * - card:     full title (standalone use)
   * - icon:     initials, for small square frames
   * - backdrop: large faded initials, for cards that overlay their own title
   */
  variant?: 'card' | 'icon' | 'backdrop';
}

function initials(title: string): string {
  // Split on spaces, hyphens and camelCase humps: "CamCounter" -> "CC"
  const words = title.split(/[\s-]+|(?=[A-Z][a-z])/).filter(Boolean);
  const letters = words.length > 1 ? words.slice(0, 2).map((w) => w[0]) : [title.slice(0, 2)];
  return letters.join('').toUpperCase();
}

/**
 * Project screenshot, or a styled title card for projects that don't have a
 * screenshot yet (so the layout never shows a broken image).
 */
export default function ProjectImage({ project, className = '', variant = 'card' }: ProjectImageProps) {
  if (project.image) {
    return <img src={project.image} alt={project.title} className={className} loading="lazy" />;
  }

  return (
    <div
      className={`${className} project-image-placeholder project-image-placeholder--${variant}`}
      role="img"
      aria-label={project.title}
    >
      <span>{variant === 'card' ? project.title : initials(project.title)}</span>
    </div>
  );
}
