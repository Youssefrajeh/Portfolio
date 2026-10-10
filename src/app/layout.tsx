import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';
import { SITE_URL, withBasePath } from '@/lib/site';
import { DEFAULT_THEME, THEME_IDS } from '@/lib/themes';

// Runs before hydration so the page never flashes the wrong theme.
// Defaults to DEFAULT_THEME for first-time visitors; a stored choice always wins.
const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var theme = ${JSON.stringify(THEME_IDS)}.indexOf(stored) !== -1 ? stored : ${JSON.stringify(DEFAULT_THEME)};
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', ${JSON.stringify(DEFAULT_THEME)});
    }
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Youssef Rajeh - Software Developer Platform',
  description:
    'Youssef Rajeh - Software Developer platform featuring portfolio projects, case studies, GEO-ready technical summaries, C#, .NET Core, SQL Server, React, REST APIs, and future software tools.',
  keywords:
    'Youssef Rajeh, software developer, developer platform, GEO, generative engine optimization, web developer, C# developer, .NET Core developer, React developer, SQL database, C++, Systems Support, London Ontario, portfolio, full stack developer',
  authors: [{ name: 'Youssef Rajeh' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'Youssef Rajeh | Software Developer Platform',
    description:
      'Software Developer platform for portfolio projects, technical case studies, GEO-ready summaries, and future software tools.',
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: 'Youssef Rajeh Portfolio',
    // Preview image comes from app/opengraph-image.tsx
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@youssefrajeh',
    creator: '@youssefrajeh',
    title: 'Youssef Rajeh | Software Developer Platform',
    description:
      'Software developer platform featuring portfolio projects, technical case studies, and future software tools.',
  },
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      'en-ca': `${SITE_URL}/`,
      en: `${SITE_URL}/`,
    },
  },
  icons: {
    icon: withBasePath('/images/favicon.svg'),
  },
  manifest: withBasePath('/manifest.json'),
  other: {
    'geo.region': 'CA-ON',
    'geo.placename': 'London, Ontario, Canada',
    'geo.position': '42.9849;-81.2453',
    ICBM: '42.9849, -81.2453',
  },
};

export const viewport: Viewport = {
  themeColor: '#e0e5ec',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Youssef Rajeh',
  jobTitle: 'Software Developer',
  description:
    'Software Developer specializing in C#, .NET Core, React, and SQL Server.',
  url: `${SITE_URL}/`,
  mainEntityOfPage: `${SITE_URL}/`,
  email: 'youssefrrajeh@gmail.com',
  telephone: '+1-548-388-4360',
  image: `${SITE_URL}/images/youssef.jpeg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London',
    addressRegion: 'Ontario',
    addressCountry: 'Canada',
    postalCode: 'N6A',
  },
  knowsAbout: [
    'Software Development',
    'Generative Engine Optimization',
    'C#',
    '.NET Core',
    'REST APIs',
    'SQL Server',
    'React',
    'Web Development',
    'HTML5',
    'CSS3',
    'Systems Troubleshooting',
    'CI/CD Pipelines',
    'Full Stack Development',
  ],
  seeks: {
    '@type': 'JobPosting',
    title: 'Software Developer Position',
    description:
      'Seeking software development roles focusing on .NET Core, React, and robust client-server architectures.',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance Software Developer',
  },
  hasPart: [
    {
      '@type': 'WebPage',
      name: 'Portfolio',
      url: `${SITE_URL}/portfolio`,
      description:
        'Portfolio, work experience, technical skills, and project case studies for Youssef Rajeh.',
    },
    {
      '@type': 'WebPage',
      name: 'AI-readable site summary',
      url: `${SITE_URL}/llms.txt`,
      description:
        'Plain-text summary for AI assistants and generative search systems.',
    },
  ],
  sameAs: [
    'https://github.com/Youssefrajeh',
    'https://www.linkedin.com/in/youssefrajeh',
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
