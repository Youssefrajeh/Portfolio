'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { m } from 'motion/react';
import type { Project } from '@/data/types';
import { fadeInUp, fadeInLeft } from '@/lib/motionVariants';
import ProjectImage from './ProjectImage';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();

  const handleBackClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/portfolio#projects');
  };

  return (
    <section className="project-detail-page" style={{
      background: 'var(--bg)',
      minHeight: '100vh',
      padding: '120px 20px 80px',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <style>{`
        .detail-wrap {
          width: min(900px, 95%);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 50px;
          position: relative;
        }

        .back-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-faint);
          text-decoration: none;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 30px;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .back-nav-link:hover {
          color: var(--text);
          transform: translateX(-4px);
        }

        .detail-title {
          font-family: var(--font-space), sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 25px;
          text-align: left;
          line-height: 1.15;
        }

        .detail-hero-frame {
          width: 120px;
          height: 120px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          margin: 0 auto 35px;
        }

        .detail-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .detail-layout {
          display: flex;
          gap: 50px;
          align-items: flex-start;
        }

        .tech-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 80px;
          flex-shrink: 0;
          position: sticky;
          top: 100px;
          padding-top: 10px;
        }

        .tech-sidebar-logo {
          width: 50px;
          height: 50px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .tech-sidebar-logo:hover {
          transform: translateY(-2px);
          border-color: var(--border-strong);
        }

        .tech-sidebar-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .tech-tooltip {
          position: absolute;
          left: 65px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 6px 12px;
          border-radius: 6px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translateX(-5px);
        }

        .tech-sidebar-logo:hover .tech-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        .detail-content {
          flex: 1;
          color: var(--text-dim);
          font-family: var(--font-hanken), sans-serif;
          font-size: 1.05rem;
          line-height: 1.65;
          text-align: left;
        }

        .detail-meta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .meta-badge {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: 6px;
          background: rgb(var(--accent-rgb) / 0.08);
          color: var(--accent);
          border: 1px solid rgb(var(--accent-rgb) / 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-badge.secondary {
          background: rgba(163, 230, 53, 0.08);
          color: #a3e635;
          border: 1px solid rgba(163, 230, 53, 0.2);
        }

        .meta-badge.tertiary {
          background: var(--border);
          color: var(--text-dim);
          border: 1px solid var(--border);
        }

        .detail-section-title {
          font-family: var(--font-space), sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text);
          margin-top: 35px;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
          text-align: left;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          padding: 8px 0 8px 24px;
          position: relative;
          border-bottom: 1px solid var(--border);
        }

        .features-list li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
        }

        .detail-actions {
          margin-top: 40px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .detail-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .detail-btn.primary {
          background: var(--accent);
          color: var(--on-accent);
          border: none;
        }

        .detail-btn.primary:hover {
          background: var(--accent-strong);
          transform: translateY(-2px);
        }

        .detail-btn.secondary {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid var(--border-strong);
        }

        .detail-btn.secondary:hover {
          background: var(--border);
          color: var(--text);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .project-detail-page {
            padding: 80px 10px 40px !important;
          }

          .detail-wrap {
            padding: 24px 16px;
          }

          .back-nav-link {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 16px;
          }

          .detail-title {
            font-size: 2rem;
            margin-bottom: 16px;
            text-align: center;
          }

          .detail-hero-frame {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto 16px !important;
            border-radius: 12px !important;
          }

          .detail-layout {
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }

          .tech-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
            position: static;
            padding-top: 0;
            gap: 10px;
          }

          .tech-sidebar-logo {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            padding: 8px;
          }

          .tech-tooltip {
            top: -40px;
            left: 50%;
            transform: translateX(-50%) translateY(5px);
          }

          .tech-sidebar-logo:hover .tech-tooltip {
            transform: translateX(-50%) translateY(0);
          }

          .detail-meta-row {
            justify-content: center;
          }

          .detail-content {
            text-align: center;
          }

          .detail-section-title {
            text-align: center;
          }

          .features-list li {
            text-align: center;
            padding-left: 0;
          }

          .features-list li::before {
            position: static;
            margin-right: 8px;
            display: inline-block;
          }

          .detail-actions {
            justify-content: center;
            width: 100%;
          }

          .detail-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="detail-wrap">
        {/* Back navigation */}
        <Link href="/portfolio" onClick={handleBackClick} className="back-nav-link">
          &larr; Back to Portfolio
        </Link>

        {/* Title */}
        <m.h1
          className="detail-title"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {project.title}
        </m.h1>

        {/* Hero image */}
        <m.div
          className="detail-hero-frame"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <ProjectImage project={project} className="detail-hero-img" variant="icon" />
        </m.div>

        {/* Main layout */}
        <div className="detail-layout">
          {/* Tech sidebar - slides in from left */}
          <m.div
            className="tech-sidebar"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {project.techStack.map((tech, idx) => (
              <div key={idx} className="tech-sidebar-logo">
                <img src={tech.icon} alt={tech.name} />
                <span className="tech-tooltip">{tech.name}</span>
              </div>
            ))}
          </m.div>

          {/* Details content */}
          <m.div
            className="detail-content"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Metadata badges */}
            <div className="detail-meta-row">
              <span className="meta-badge">{project.category}</span>
              <span className="meta-badge secondary">{project.duration}</span>
              <span className="meta-badge tertiary">{project.role}</span>
            </div>

            {/* Overview */}
            <h2 className="detail-section-title">Project Overview</h2>
            <p>{project.detailedDescription}</p>

            {/* Features */}
            <h2 className="detail-section-title">Key Features</h2>
            <ul className="features-list">
              {project.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            {/* Challenges & Solutions */}
            <h2 className="detail-section-title">Technical Challenges & Solutions</h2>
            <p>{project.challenges}</p>

            {/* Actions */}
            <div className="detail-actions">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-btn primary"
              >
                <i className="fab fa-github"></i> Visit Repository
              </a>
              <Link href="/portfolio" onClick={handleBackClick} className="detail-btn secondary">
                Back to Projects
              </Link>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
