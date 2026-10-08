'use client';

import { m } from "motion/react";
import Link from "next/link";
import { CONTACT, CV_PATH, RETRO_PATH, withBasePath } from "@/lib/site";
import { staggerContainer, scaleIn } from "@/lib/motionVariants";
import ThemeToggle from "./ThemeToggle";

const socialLinks = [
  {
    icon: "fab fa-github",
    url: "https://github.com/YoussefRajeh",
    label: "GitHub"
  },
  {
    icon: "fab fa-linkedin-in",
    url: "https://linkedin.com/in/youssefrajeh",
    label: "LinkedIn"
  },
  {
    icon: "fab fa-whatsapp",
    url: "https://wa.me/15483884360",
    label: "WhatsApp"
  },
  {
    icon: "fas fa-envelope",
    url: "mailto:youssefrrajeh@gmail.com",
    label: "Email"
  }
];

/**
 * - route:    a page of this app, navigated client-side with <Link>
 * - document: a standalone page (static app in /public, or a route with its
 *             own global stylesheet like /retro) that needs a full page load
 */
type HubLinkKind = "route" | "document";

const otherProjects: { label: string; href: string; kind: HubLinkKind }[] = [
  { label: "Retro Desktop (Win95)", href: RETRO_PATH, kind: "document" },
  { label: "SQL 3D Odyssey", href: "/3D/", kind: "document" },
  { label: "Data Structures Reference", href: "/data-structures/", kind: "route" },
];

const LandingPage = () => {
  return (
    <section id="home" className="hub-hero">
      <div className="hub-theme-toggle">
        <ThemeToggle />
      </div>

      <style>{`
        .hub-hero {
          height: 100vh;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: clamp(20px, 4vh, 40px) 20px clamp(16px, 3vh, 24px);
          text-align: center;
          position: relative;
          box-sizing: border-box;
        }

        .hub-theme-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 3;
        }

        .hub-hero-container {
          width: min(560px, 100%);
          margin: auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hub-avatar-wrapper {
          width: clamp(96px, 16vw, 128px);
          height: clamp(96px, 16vw, 128px);
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid var(--border-strong);
          margin-bottom: clamp(16px, 3vh, 28px);
        }

        .hub-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .hub-eyebrow {
          font-family: var(--font-jetbrains), monospace;
          font-size: clamp(0.72rem, 1.4vw, 0.8rem);
          color: var(--text-faint);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: clamp(8px, 1.4vh, 14px);
          font-weight: 500;
        }

        .hub-title {
          font-family: var(--font-space), sans-serif;
          font-size: clamp(2.1rem, 5.5vw, 3.6rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.08;
          margin: 0 0 clamp(10px, 2vh, 16px) 0;
          letter-spacing: -0.03em;
        }

        .hub-tagline {
          font-family: var(--font-hanken), sans-serif;
          font-size: clamp(0.9rem, 1.6vw, 1.02rem);
          color: var(--text-dim);
          max-width: 460px;
          line-height: 1.65;
          margin: 0 auto clamp(28px, 4.5vh, 40px) auto;
        }

        .hub-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 30px;
          background: var(--accent);
          color: var(--on-accent);
          border-radius: 6px;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: clamp(0.9rem, 1.6vw, 0.98rem);
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .hub-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: clamp(24px, 4vh, 36px);
        }
        .hub-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          color: var(--text);
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: clamp(0.9rem, 1.6vw, 0.98rem);
          text-decoration: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .hub-cta-secondary:hover {
          border-color: var(--text-faint);
          background: var(--surface);
        }
        .hub-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 clamp(20px, 3vh, 28px);
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.78rem;
          color: var(--text-dim);
        }
        .hub-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgb(34 197 94 / 0.18);
        }

        .hub-cta:hover {
          background: var(--accent-strong);
        }

        .hub-cta i {
          font-size: 0.8rem;
          transition: transform 0.15s ease;
        }

        .hub-cta:hover i {
          transform: translateX(2px);
        }

        .hub-more {
          margin-bottom: clamp(28px, 4.5vh, 40px);
        }

        .hub-more-label {
          display: block;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.68rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .hub-more-links {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.82rem;
        }

        .hub-more-link {
          color: var(--text-dim);
          text-decoration: none;
          padding-bottom: 1px;
          border-bottom: 1px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .hub-more-link:hover {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        .hub-more-sep {
          color: var(--border-strong);
        }

        .hub-socials {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .hub-social-btn {
          width: clamp(36px, 6.5vw, 40px);
          height: clamp(36px, 6.5vw, 40px);
          border-radius: 6px;
          background: transparent;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-faint);
          font-size: clamp(0.88rem, 1.7vw, 1rem);
          text-decoration: none;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .hub-social-btn:hover {
          color: var(--text);
          border-color: var(--border-strong);
        }

        .hub-copyright {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: var(--text-faint);
          letter-spacing: 0.02em;
          z-index: 2;
        }
      `}</style>

      <div className="hub-hero-container">
        <m.div
          className="hub-avatar-wrapper"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={withBasePath('/images/youssef.jpeg')}
            alt="Youssef Rajeh"
            className="hub-avatar-img"
          />
        </m.div>

        <m.p
          className="hub-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Personal Website
        </m.p>

        <m.h1
          className="hub-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Youssef Rajeh
        </m.h1>

        <m.p
          className="hub-tagline"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Computer Programming & Analysis student building practical web, database, and software projects.
        </m.p>

        <m.p
          className="hub-status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <span className="hub-status-dot" aria-hidden="true" />
          Open to software development roles · {CONTACT.location.split(',')[0]}, ON
        </m.p>

        <m.div
          className="hub-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/portfolio" className="hub-cta">
            <span>View Portfolio</span>
            <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </Link>
          <a href={withBasePath(CV_PATH)} className="hub-cta-secondary" download>
            <i className="fas fa-file-arrow-down" aria-hidden="true"></i>
            <span>Download CV</span>
          </a>
        </m.div>

        <m.div
          className="hub-more"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
        >
          <span className="hub-more-label">Also on this site</span>
          <div className="hub-more-links">
            {otherProjects.map((p, i) => (
              <span key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {p.kind === "route" ? (
                  <Link href={p.href} className="hub-more-link">{p.label}</Link>
                ) : (
                  <a href={withBasePath(p.href)} className="hub-more-link">{p.label}</a>
                )}
                {i < otherProjects.length - 1 && <span className="hub-more-sep">/</span>}
              </span>
            ))}
          </div>
        </m.div>

        <m.div
          className="hub-socials"
          variants={staggerContainer(0.08, 0.68)}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.map((item) => (
            <m.a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hub-social-btn"
              aria-label={item.label}
              variants={scaleIn}
            >
              <i className={item.icon}></i>
            </m.a>
          ))}
        </m.div>
      </div>

      <footer className="hub-copyright">
        © {new Date().getFullYear()} Youssef Rajeh
      </footer>
    </section>
  );
};

export default LandingPage;
