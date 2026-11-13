'use client';

import { m } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/motionVariants";
import { CONTACT } from "@/lib/site";

const socialLinks = [
  { icon: "fab fa-github", url: CONTACT.github, label: "GitHub" },
  { icon: "fab fa-linkedin-in", url: CONTACT.linkedin, label: "LinkedIn" },
  { icon: "fas fa-envelope", url: `mailto:${CONTACT.email}`, label: "Email" },
];

const Hero = () => {
  return (
    <section id="home">
      <style>{`
        #home {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          width: 100%;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .hero-greeting {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.85rem;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin: 0 0 16px 0;
        }
        .hero-name {
          font-family: var(--font-space), sans-serif;
          font-size: clamp(2.6rem, 7vw, 4.5rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.08;
          margin: 0 0 16px 0;
          letter-spacing: -0.03em;
        }
        .hero-role {
          font-family: var(--font-space), sans-serif;
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          color: var(--text-dim);
          font-weight: 500;
          letter-spacing: 0.02em;
          margin: 0 0 16px 0;
        }
        .hero-role-sep {
          color: var(--accent);
          margin: 0 0.5em;
        }
        .hero-tagline {
          font-family: var(--font-hanken), sans-serif;
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          color: var(--text-faint);
          max-width: 600px;
          line-height: 1.7;
          margin: 0 0 36px 0;
        }
        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 32px;
          background: var(--accent);
          color: var(--on-accent);
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }
        .hero-btn-primary:hover {
          background: var(--accent-strong);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
        }
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 32px;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-dim);
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }
        .hero-btn-secondary:hover {
          border-color: var(--border-strong);
          color: var(--text);
          transform: translateY(-2px);
        }
        .hero-social {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 32px;
        }
        .hero-social a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid var(--border);
          border-radius: 50%;
          color: var(--text-dim);
          font-size: 1rem;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .hero-social a:hover,
        .hero-social a:focus-visible {
          color: var(--accent);
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          #home {
            height: auto;
            padding-top: 112px;
            padding-bottom: 0;
          }
          /* site.css enlarges every hero paragraph on phones; keep these two readable */
          .hero-content p.hero-tagline {
            font-size: 1rem !important;
            margin-bottom: 28px;
          }
          .hero-content p.hero-greeting {
            font-size: 0.85rem !important;
          }
          .hero-buttons {
            flex-direction: row;
            gap: 12px;
          }
          .hero-btn-primary, .hero-btn-secondary {
            padding: 12px 24px;
            font-size: 0.9rem;
          }
        }
        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            max-width: 280px;
            margin: 0 auto;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
            padding: 13px 20px;
            font-size: 0.9rem;
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="hero-content">
        <m.p
          className="hero-greeting"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Hello, I’m
        </m.p>

        <m.h1
          className="hero-name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Youssef Rajeh
        </m.h1>

        <m.div
          className="hero-role"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Software Developer
          <span className="hero-role-sep" aria-hidden="true">/</span>
          Full-Stack
          <span className="hero-role-sep" aria-hidden="true">/</span>
          London, ON
        </m.div>

        <m.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          I build full-stack web applications with C#, ASP.NET Core, React and SQL, from database design
          to cloud deployment. Graduating from Fanshawe College in December 2026, with over a decade of
          quality assurance experience behind me.
        </m.p>

        <m.div
          className="hero-buttons"
          variants={staggerContainer(0.1, 0.6)}
          initial="hidden"
          animate="visible"
        >
          <m.a href="#projects" className="hero-btn-primary" variants={staggerItem}>
            View My Work
          </m.a>
          <m.a href="#contact" className="hero-btn-secondary" variants={staggerItem}>
            Contact Me
          </m.a>
        </m.div>

        <m.div
          className="hero-social"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              aria-label={link.label}
              title={link.label}
              {...(link.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <i className={link.icon} aria-hidden="true"></i>
            </a>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default Hero;
