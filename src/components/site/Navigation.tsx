'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence } from 'motion/react';
import { fadeInDown, staggerContainer, staggerItem } from '@/lib/motionVariants';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { withBasePath } from '@/lib/site';
import ThemeToggle from './ThemeToggle';

const portfolioNavItems = [
  { label: 'About', section: 'about', icon: 'fas fa-user' },
  { label: 'Experience', section: 'experience', icon: 'fas fa-briefcase' },
  { label: 'Education', section: 'education', icon: 'fas fa-graduation-cap' },
  { label: 'Skills', section: 'skills', icon: 'fas fa-code' },
  { label: 'Projects', section: 'projects', icon: 'fas fa-folder-open' },
  { label: 'Contact', section: 'contact', icon: 'fas fa-envelope' },
];

const FEEDBACK_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf_zNZ_TAJhpFpz-Aj-ARUDhseLQ90iGRfVeClJVOScad3uZg/viewform?usp=header';

/** Outline of the sidebar panel: rounded corners with sides that pinch inward. */
const curvedPanelPath = (w: number, h: number) => {
  const r = Math.min(24, w / 2, h / 2);
  const pinch = Math.min(7, w * 0.05) * 2; // control-point offset; the edge moves in by half of it
  return [
    `M${r},0 H${w - r} Q${w},0 ${w},${r}`,
    `Q${w - pinch},${h / 2} ${w},${h - r}`,
    `Q${w},${h} ${w - r},${h} H${r} Q0,${h} 0,${h - r}`,
    `Q${pinch},${h / 2} 0,${r} Q0,0 ${r},0 Z`,
  ].join(' ');
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)'); // null = not yet hydrated
  const [activeSection, setActiveSection] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // tracks when drawer animation completes
  // The sidebar always starts collapsed (icons only); the toggle expands it.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<SVGPathElement>(null);
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  // Keep the curved outline matched to the sidebar's size, including mid-transition.
  // Written straight to the DOM so the width animation never re-renders React.
  useLayoutEffect(() => {
    const el = sidebarRef.current;
    if (!el) return undefined;
    const draw = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const d = curvedPanelPath(w, h);
      if (glassRef.current) glassRef.current.style.clipPath = `path('${d}')`;
      edgeRef.current?.setAttribute('d', d);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      } else {
        // Not on the portfolio page (e.g. a project page): go there and jump to the section
        router.push(`/portfolio#${sectionId}`);
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

        /* ── Curved glass sidebar (desktop) ── */
        .side-nav {
          --sn-open: 0;
          position: fixed;
          left: 20px;
          top: 20px;
          bottom: 20px;
          margin-block: auto;
          height: min(calc(100dvh - 40px), 720px);
          width: calc(72px + var(--sn-open) * 184px);
          z-index: 1060;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          box-sizing: border-box;
          font-family: var(--font-hanken), sans-serif;
          color: var(--text);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .side-nav[data-state='open'] { --sn-open: 1; }

        .sn-shadow, .sn-glass, .sn-edge {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .sn-shadow {
          inset: 14px 10px 6px;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgb(0 0 0 / 0.38);
        }
        .sn-glass {
          border-radius: 24px; /* until the curved clip-path is applied */
          background:
            linear-gradient(155deg, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 42%),
            linear-gradient(to top, rgb(var(--accent-rgb) / 0.10), rgb(var(--accent-rgb) / 0) 45%),
            var(--glass);
          backdrop-filter: blur(22px) saturate(170%);
          -webkit-backdrop-filter: blur(22px) saturate(170%);
        }
        .sn-edge {
          width: 100%;
          height: 100%;
          overflow: visible;
          filter: drop-shadow(0 0 6px rgb(var(--accent-rgb) / 0.3));
        }
        .sn-edge path {
          fill: none;
          stroke: url(#sn-edge-gradient);
          stroke-width: 1.25;
        }
        .sn-edge .sn-stop-top { stop-color: var(--text); stop-opacity: 0.5; }
        .sn-edge .sn-stop-mid { stop-color: var(--accent); stop-opacity: 0.6; }
        .sn-edge .sn-stop-end { stop-color: var(--text); stop-opacity: 0.14; }

        .side-nav > :not(.sn-shadow, .sn-glass, .sn-edge) {
          position: relative;
        }

        /* Text that collapses away when the sidebar is closed */
        .sn-label {
          display: block;
          min-width: 0;
          max-width: calc(var(--sn-open) * 170px);
          opacity: var(--sn-open);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }

        .sn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 36px;
          flex-shrink: 0;
        }
        .sn-header .nav-logo {
          display: flex;
          padding-left: calc(var(--sn-open) * 4px);
        }
        .sn-toggle {
          width: 40px;
          height: 36px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgb(var(--accent-rgb) / 0.06);
          border: 1px solid var(--border);
          color: var(--text-dim);
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .sn-toggle:hover {
          color: var(--text);
          border-color: var(--border-strong);
          background: rgb(var(--accent-rgb) / 0.12);
        }
        .sn-toggle svg {
          /* points right (expand) when closed, flips to point left (collapse) when open */
          transform: scaleX(calc(1 - 2 * var(--sn-open)));
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sn-profile {
          display: flex;
          align-items: center;
          gap: calc(var(--sn-open) * 12px);
          padding: 6px 0 14px;
          border: none;
          border-bottom: 1px solid var(--border);
          background: none;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
          flex-shrink: 0;
          transition: gap 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sn-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }
        .sn-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgb(var(--accent-rgb) / 0.55);
          box-sizing: border-box;
          display: block;
        }
        .sn-avatar::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg);
        }
        .sn-name {
          font-family: var(--font-space), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .sn-role {
          font-size: 0.72rem;
          color: var(--text-faint);
          line-height: 1.3;
        }

        .sn-menu {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .sn-menu::-webkit-scrollbar { display: none; }
        .sn-menu-title {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          color: var(--text-faint);
          padding: 4px 4px 2px;
          text-align: left;
          flex-shrink: 0;
        }

        .sn-item {
          display: flex;
          align-items: center;
          gap: calc(var(--sn-open) * 12px);
          width: 100%;
          padding: 4px;
          box-sizing: border-box;
          border-radius: 12px;
          border: 1px solid transparent;
          background: none;
          color: var(--text-dim);
          font: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease,
            gap 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sn-icon {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          border: 1px solid var(--border);
          background: rgb(var(--accent-rgb) / 0.05);
          font-size: 0.8rem;
          box-sizing: border-box;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .sn-item:hover {
          color: var(--text);
          background: rgb(var(--accent-rgb) / 0.07);
        }
        .sn-item.active {
          color: var(--text);
          background: rgb(var(--accent-rgb) / 0.12);
          border-color: rgb(var(--accent-rgb) / 0.28);
        }
        .sn-item.active .sn-icon {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--on-accent);
        }

        .sn-footer {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 10px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .side-nav .nav-feedback-btn {
          background: var(--accent);
          color: var(--on-accent);
          font-weight: 600;
        }
        .side-nav .nav-feedback-btn:hover {
          background: var(--accent-strong);
        }
        .side-nav .nav-feedback-btn .sn-icon {
          background: none;
          border-color: transparent;
        }
        .sn-theme-row {
          display: flex;
          align-items: center;
          gap: calc(var(--sn-open) * 10px);
          padding: 2px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-dim);
          transition: gap 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* The theme menu opens beside the sidebar instead of below the button */
        .side-nav .theme-picker .theme-menu {
          top: auto;
          bottom: 0;
          right: auto;
          left: calc(100% + 22px);
        }

        .side-nav :is(button, a):focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* Desktop: sidebar replaces the top bar and the page makes room for it */
        @media (min-width: 901px) {
          .nav-bar { display: none; }
          #main-content {
            padding-left: 108px;
            transition: padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          :root:has(.side-nav[data-state='open']) #main-content { padding-left: 292px; }
        }
        @media (max-width: 900px) {
          .side-nav { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .side-nav, .side-nav *, #main-content { transition: none !important; }
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

      <m.aside
        ref={sidebarRef}
        className="side-nav"
        data-state={isSidebarOpen ? 'open' : 'closed'}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="sn-shadow" aria-hidden="true" />
        <div className="sn-glass" ref={glassRef} aria-hidden="true" />
        <svg className="sn-edge" aria-hidden="true">
          <defs>
            <linearGradient id="sn-edge-gradient" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" className="sn-stop-top" />
              <stop offset="0.5" className="sn-stop-mid" />
              <stop offset="1" className="sn-stop-end" />
            </linearGradient>
          </defs>
          <path ref={edgeRef} />
        </svg>

        <div className="sn-header">
          <Link href="/portfolio" className="nav-logo sn-label" onClick={() => scrollToSection('home')}>
            <span className="nav-logo-name">Youssef</span>
            <span className="nav-logo-dot">.</span>
          </Link>
          <button
            type="button"
            className="sn-toggle"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isSidebarOpen}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h13" />
              <path d="m11 7 5 5-5 5" />
              <path d="M21 5v14" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="sn-profile"
          onClick={() => scrollToSection('home')}
          aria-label="Youssef Rajeh, back to top"
          title="Back to top"
        >
          <span className="sn-avatar">
            <img src={withBasePath('/images/youssef.jpeg')} alt="" width={40} height={40} />
          </span>
          <span className="sn-label">
            <span className="sn-name">Youssef Rajeh</span>
            <br />
            <span className="sn-role">Software Developer</span>
          </span>
        </button>

        <nav className="sn-menu" aria-label="Sections">
          <span className="sn-menu-title sn-label" aria-hidden="true">MENU</span>
          {portfolioNavItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sn-item ${activeSection === item.section ? 'active' : ''}`}
              aria-current={activeSection === item.section ? 'true' : undefined}
              title={item.label}
              onClick={() => scrollToSection(item.section)}
            >
              <span className="sn-icon" aria-hidden="true">
                <i className={item.icon}></i>
              </span>
              <span className="sn-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sn-footer">
          <Link href="/" className="sn-item" title="Back to Hub">
            <span className="sn-icon" aria-hidden="true">
              <i className="fas fa-arrow-left"></i>
            </span>
            <span className="sn-label">Back to Hub</span>
          </Link>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sn-item nav-feedback-btn"
            title="Feedback"
          >
            <span className="sn-icon" aria-hidden="true">
              <i className="fas fa-comment-dots"></i>
            </span>
            <span className="sn-label">Feedback</span>
          </a>
          <div className="sn-theme-row">
            <ThemeToggle />
            <span className="sn-label" aria-hidden="true">Theme</span>
          </div>
        </div>
      </m.aside>

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
