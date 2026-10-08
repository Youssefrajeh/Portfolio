import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/site/ProjectDetail';
import { getProjectById, projectsData } from '@/data/projectsData';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

// Static export: every project page is pre-rendered; unknown ids 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projectsData.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(Number(id));
  if (!project) {
    return { title: 'Project Not Found | Youssef Rajeh' };
  }
  return {
    title: `${project.title} | Youssef Rajeh`,
    description: project.description,
    alternates: { canonical: `/project/${project.id}/` },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(Number(id));
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
