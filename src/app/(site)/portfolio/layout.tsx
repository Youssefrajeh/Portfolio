import type { ReactNode } from 'react';
import Link from 'next/link';
import Navigation from '@/components/site/Navigation';
import ScrollToTop from '@/components/site/ScrollToTop';

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Link href="/" className="mobile-floating-hub-btn" aria-label="Back to Hub">
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
        <span>Hub</span>
      </Link>
      {children}
    </>
  );
}
