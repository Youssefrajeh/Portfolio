import type { MetadataRoute } from 'next';
import { projectsData } from '@/data/projectsData';
import { SITE_URL } from '@/lib/site';

// Generated at build time from the same data the pages render, so new
// projects are listed automatically.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/portfolio/`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/data-structures/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/retro/`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    ...projectsData.map((project) => ({
      url: `${SITE_URL}/project/${project.id}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
