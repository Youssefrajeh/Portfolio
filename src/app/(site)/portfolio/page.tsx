import type { Metadata } from 'next';
import PortfolioPage from '@/components/site/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio | Youssef Rajeh',
  description:
    "Explore Youssef Rajeh's software development portfolio — projects, skills, experience, and contact information.",
  alternates: { canonical: '/portfolio/' },
};

export default function PortfolioRoute() {
  return <PortfolioPage />;
}
