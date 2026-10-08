'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'motion/react';
import { fadeInDown, staggerContainer, staggerItem } from '@/lib/motionVariants';
import { useMediaQuery } from '@/lib/useMediaQuery';
import ThemeToggle from './ThemeToggle';

const portfolioNavItems = [
  { label: 'About', section: 'about' },
  { label: 'Experience', section: 'experience' },
  { label: 'Education', section: 'education' },
  { label: 'Skills', section: 'skills' },
  { label: 'Projects', section: 'projects' },
  { label: 'Contact', section: 'contact' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)'); // null = not yet hydrated
  const [activeSection, setActiveSection] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // tracks when drawer animation completes

  // Closing the menu also marks the drawer closed, which releases the scroll lock
  const setMenuOpen = (open: boolean) => {
    setIsMobileMenuOpen(open);
    if (!open) setIsDrawerOpen(false);
  };

  // Close the drawer when the viewport grows past the mobile breakpoint
  if (isMobile === false && isMobileMenuOpen) {
    setMenuOpen(false);
  }

  // Lock body scroll only after the drawer has finished animating open
  useEffect(() => {
    if (isDrawerOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        // Only restore if scrollToSection hasn't already done so
        if (document.body.style.position === 'fixed') {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.overflow = '';
          window.scrollTo(0, scrollY);
        }
      };
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextIsScrolled = window.scrollY > 50;
          setIsScrolled((prev) => (prev !== nextIsScrolled ? nextIsScrolled : prev));
          const sections = ['home', ...portfolioNavItems.map((i) => i.section)];
          let currentSec = 'home';
          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 140 && rect.bottom >= 140) {
                currentSec = id;
                break;
              }
            }
          }
          setActiveSection((prev) => (prev !== currentSec ? currentSec : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Capture the saved scroll position before closing the menu
    const savedScrollY = parseInt(document.body.style.top || '0', 10) * -1;

    // Immediately restore body scroll state (don't wait for effect cleanup)
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);

    setMenuOpen(false);

    // Use setTimeout to let the DOM settle after body unlock
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      <style>{`
        .nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1060;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .nav-bar.scrolled {
          background: var(--glass);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          padding: 10px 28px;
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-logo-name {
          font-family: var(--font-space), sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .nav-logo-dot {
          color: var(--accent);
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link {
          position: relative;
          color: var(--text-faint);
          text-decoration: none;
          font-size: 0.88rem;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 6px;
          transition: color 0.25s ease, background 0.25s ease;
          cursor: pointer;
          background: none;
          border: none;
        }
        .nav-link:hover {
          color: var(--text);
        }
        .nav-link.active {
          color: var(--text);
          background: rgb(var(--accent-rgb) / 0.08);
        }
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
        }

        .nav-hub-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-faint);
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 0.25s ease;
          margin-right: 8px;
          border: 1px solid var(--border);
        }
        .nav-hub-link:hover {
          color: var(--text);
          border-color: var(--border-strong);
        }

        .nav-feedback-btn {
          background: var(--accent);
          color: var(--on-accent);
          padding: 7px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.82rem;
          text-decoration: none;
          transition: all 0.25s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 12px;
        }
        .nav-feedback-btn:hover {
          background: var(--accent-strong);
          transform: translateY(-1px);
        }

        /* Hamburger Button */
        .hamburger-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1100;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .hamburger-box {
          position: relative;
          width: 22px;
          height: 14px;
        }
        .hamburger-line {
          position: absolute;
          left: 0;
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
          transform-origin: center;
          will-change: transform, opacity;
        }
        .line-1 { top: 0; }
        .line-2 { top: 6px; }
        .line-3 { top: 12px; }

        .hamburger-btn.open .line-1 {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger-btn.open .line-2 {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger-btn.open .line-3 {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Mobile drawer & overlay */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1040;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: min(290px, 82vw);
          height: 100vh;
          height: 100dvh;
          background: var(--bg);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 80px 24px 40px;
          gap: 8px;
          z-index: 1050;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-link {
          display: block;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          color: var(--text-faint);
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 500;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          transition: all 0.25s ease;
          cursor: pointer;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        .mobile-link:hover, .mobile-link.active {
          color: var(--text);
          padding-left: 8px;
          border-bottom-color: rgb(var(--accent-rgb) / 0.2);
        }
        .mobile-hub-btn {
          display: block;
          width: 100%;
          text-align: center;
          margin-top: 24px;
          padding: 12px;
          border-radius: 8px;
          background: rgb(var(--accent-rgb) / 0.06);
          border: 1px solid rgb(var(--accent-rgb) / 0.15);
          color: var(--text-dim);
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .mobile-hub-btn:hover {
          background: rgb(var(--accent-rgb) / 0.1);
          border-color: rgb(var(--accent-rgb) / 0.3);
          color: var(--text);
        }

        @media (max-width: 900px) {
          .nav-bar {
            padding: 12px 16px;
          }
          .nav-bar.scrolled {
            padding: 8px 16px;
          }
        }
      `}</style>

      <m.nav
        className={`nav-bar ${isScrolled ? 'scrolled' : ''}`}
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <Link href="/portfolio" className="nav-logo" onClick={() => scrollToSection('home')}>
          <span className="nav-logo-name">Youssef</span>
          <span className="nav-logo-dot">.</span>
        </Link>

        {isMobile === false && (
          <div className="nav-links">
            <Link href="/" className="nav-hub-link">
              <i className="fas fa-arrow-left" style={{ fontSize: '0.7rem' }}></i>
              Hub
            </Link>

            {portfolioNavItems.map((item) => (
              <button
                key={item.label}
                className={`nav-link ${activeSection === item.section ? 'active' : ''}`}
                onClick={() => scrollToSection(item.section)}
              >
                {item.label}
              </button>
            ))}

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSf_zNZ_TAJhpFpz-Aj-ARUDhseLQ90iGRfVeClJVOScad3uZg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-feedback-btn"
            >
              Feedback
            </a>

            <div style={{ marginLeft: 12 }}>
              <ThemeToggle />
            </div>
          </div>
        )}

        {isMobile === true && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <button
              className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="hamburger-box">
                <span className="hamburger-line line-1" />
                <span className="hamburger-line line-2" />
                <span className="hamburger-line line-3" />
              </div>
            </button>
          </div>
        )}
      </m.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            key="mobile-overlay"
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
        {isMobileMenuOpen && (
          <m.div
            key="mobile-drawer"
            className="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={(definition) => {
              // Lock body scroll only after the drawer finishes opening
              if (definition === "0%" || (typeof definition === "object" && !Array.isArray(definition) && "x" in definition && definition.x === "0%")) {
                setIsDrawerOpen(true);
              }
            }}
          >
            <m.div
              variants={staggerContainer(0.05, 0.1)}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}
            >
              {portfolioNavItems.map((item) => (
                <m.button
                  key={item.label}
                  className={`mobile-link ${activeSection === item.section ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.section)}
                  variants={staggerItem}
                >
                  {item.label}
                </m.button>
              ))}
              <m.div variants={staggerItem}>
                <Link
                  href="/"
                  className="mobile-hub-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  ← Back to Hub
                </Link>
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
