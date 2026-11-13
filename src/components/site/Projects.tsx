'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'motion/react';
import { projectsData, projectFilters } from '@/data/projectsData';
import type { Project, ProjectFilter } from '@/data/types';
import { fadeInUp, scaleStaggerItem, viewportConfig } from '@/lib/motionVariants';
import { DEMO_WAKE_NOTE, demoMaySleep } from '@/data/demoHosting';
import ProjectImage from './ProjectImage';

/** Cards shown under "All" before the visitor asks for the rest. */
const INITIAL_COUNT = 6;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** Sortable number from a duration such as "Oct 2025" or "Sep 2026 – Present". */
function startedAt(project: Project): number {
  const match = /([A-Za-z]{3})[a-z]*\s+(\d{4})/.exec(project.duration);
  if (!match) return 0;
  return Number(match[2]) * 12 + Math.max(0, MONTHS.indexOf(match[1].toLowerCase()));
}

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter['id']>('all');
  const [showAll, setShowAll] = useState(false);

  // Featured projects lead; the rest run newest first.
  const sortedProjects = [...(activeFilter === 'all'
    ? projectsData
    : projectsData.filter(project => project.category === activeFilter)
  )].sort((a, b) =>
    Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || startedAt(b) - startedAt(a)
  );

  const isCollapsed = activeFilter === 'all' && !showAll && sortedProjects.length > INITIAL_COUNT;
  const visibleProjects = isCollapsed ? sortedProjects.slice(0, INITIAL_COUNT) : sortedProjects;

  return (
    <section id="projects" className="projects" style={{ paddingInline: '20px' }}>
      <style>{`
        .project-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          text-align: left;
        }
        .project-card:hover {
          border-color: var(--border-strong);
        }
        .project-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .project-thumb img,
        .project-thumb .project-image-placeholder {
          width: 100%;
          height: 100%;
          min-height: 0;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .project-thumb img.is-screenshot {
          object-position: top center;
        }
        .project-card:hover .project-thumb img {
          transform: scale(1.04);
        }
        .project-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 22px 24px 24px;
        }
        .project-card-meta {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin: 0 0 8px 0;
          text-align: left;
        }
        .project-card-title {
          font-family: var(--font-space), sans-serif;
          font-size: 1.2rem;
          margin: 0 0 8px 0;
          color: var(--text);
          font-weight: 600;
          text-align: left;
        }
        .project-card-desc {
          font-family: var(--font-hanken), sans-serif;
          color: var(--text-dim);
          margin: 0 0 16px 0;
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
          text-align: left;
        }
        .project-card-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .view-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          background: var(--accent);
          color: var(--on-accent);
          border-radius: 6px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .view-project-btn:hover {
          background: var(--accent-strong);
          transform: translateY(-1px);
        }
        .project-card-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: auto;
        }
        .project-demo-link {
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--border-strong);
        }
        .project-demo-link:hover {
          color: var(--accent);
          text-decoration-color: currentColor;
        }
        .project-featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          background: var(--accent);
          color: var(--on-accent);
        }
        .project-filters {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
          padding: 4px 16px;
          box-sizing: border-box;
          max-width: 100%;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
          gap: 24px;
          align-items: stretch;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 10px;
          box-sizing: border-box;
        }
        .project-more {
          display: flex;
          justify-content: center;
          margin-top: 36px;
        }
        .project-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          border: 1px solid var(--border-strong);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .project-more-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgb(var(--accent-rgb) / 0.06);
        }
        @media (max-width: 768px) {
          .project-filters {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            margin-bottom: 28px !important;
            padding-bottom: 8px !important;
          }
          .project-filters::-webkit-scrollbar {
            display: none !important;
          }
          .filter-btn {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            padding: 7px 16px !important;
            font-size: 0.82rem !important;
          }
          .project-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
            gap: 16px;
            padding: 0;
          }
          .project-card-body {
            padding: 18px 18px 20px;
          }
        }
      `}</style>

      <m.h2
        className="section-title"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        Projects
      </m.h2>

      {/* Filter Buttons */}
      <div className="project-filters">
        {projectFilters.map((filter) => (
          <m.button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
            aria-pressed={activeFilter === filter.id}
            whileTap={{ scale: 0.97 }}
            style={{
              border: activeFilter === filter.id ? '1px solid rgb(var(--accent-rgb) / 0.3)' : '1px solid var(--border)',
              background: activeFilter === filter.id ? 'rgb(var(--accent-rgb) / 0.1)' : 'transparent',
              color: activeFilter === filter.id ? 'var(--text)' : 'var(--text-faint)',
              fontWeight: activeFilter === filter.id ? '600' : '500'
            }}
          >
            {filter.name}
          </m.button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="project-grid">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <m.article
              key={project.id}
              className="glass-card project-card"
              variants={scaleStaggerItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <div className="project-thumb">
                <ProjectImage
                  project={project}
                  variant="backdrop"
                  className={project.imageType === 'screenshot' ? 'is-screenshot' : ''}
                />
                {project.featured && <span className="project-featured-badge">Featured</span>}
              </div>

              <div className="project-card-body">
                <p className="project-card-meta">
                  {project.role} · {project.duration}
                </p>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>

                <div className="project-card-tech">
                  {project.techStack.map((tech) => (
                    <span key={tech.name} className="tech-tag">
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div className="project-card-actions">
                  <Link href={`/project/${project.id}`} className="view-project-btn">
                    View Details →
                  </Link>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-demo-link"
                      title={demoMaySleep(project.demo) ? DEMO_WAKE_NOTE : undefined}
                    >
                      Live demo ↗
                    </a>
                  )}
                  {project.video && (
                    <a
                      href={project.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-demo-link"
                    >
                      Demo video ↗
                    </a>
                  )}
                </div>
              </div>
            </m.article>
          ))}
        </AnimatePresence>
      </div>

      {isCollapsed && (
        <div className="project-more">
          <button type="button" className="project-more-btn" onClick={() => setShowAll(true)}>
            Show all {sortedProjects.length} projects
            <i className="fas fa-chevron-down" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
