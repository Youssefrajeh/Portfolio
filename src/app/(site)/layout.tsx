import type { ReactNode } from 'react';
import MotionProvider from '@/components/site/MotionProvider';
import { ThemeProvider } from '@/lib/ThemeContext';
import '@/styles/globals.css';

// Layout for the modern site. Its stylesheet is scoped to this route group so
// it never loads on /retro (which has its own global CSS).
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Icon font. React 19 hoists this into <head>. */}
      <link
        rel="stylesheet"
        precedence="default"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ThemeProvider>
        <MotionProvider>
          <main id="main-content">{children}</main>
        </MotionProvider>
      </ThemeProvider>
    </>
  );
}
