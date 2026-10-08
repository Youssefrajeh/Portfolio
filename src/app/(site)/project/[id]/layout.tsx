import type { ReactNode } from 'react';
import Footer from '@/components/site/Footer';
import Navigation from '@/components/site/Navigation';
import ScrollToTop from '@/components/site/ScrollToTop';

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
