'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'motion/react';
import { projectsData, projectFilters } from '@/data/projectsData';
import type { ProjectFilter } from '@/data/types';
import { fadeInUp, scaleStaggerItem, viewportConfig } from '@/lib/motionVariants';
import { withBasePath } from '@/lib/site';
import ProjectImage from './ProjectImage';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter['id']>('all');

  // Featured projects lead; the rest keep their data-file order.
  const filteredProjects = [...(activeFilter === 'all'
    ? projectsData
    : projectsData.filter(project => project.category === activeFilter)
  )].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return (
    <section id="projects" className="projects" style={{ paddingInline: '20px' }}>
      <style>{`
        .project-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(12, 12, 14, 0.97), rgba(12, 12, 14, 0.2));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          transition: opacity 0.3s ease;
        }
        .project-card-title {
          font-family: var(--font-space), sans-serif;
          font-size: 1.35rem;
          margin-bottom: 8px;
          /* The overlay is always dark, so its text is light in both themes */
          color: #e8e8ed;
          font-weight: 600;
        }
        .project-card-desc {
          font-family: var(--font-hanken), sans-serif;
          color: #a1a1aa;
          margin-bottom: 18px;
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
        }
        .view-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 22px;
          background: var(--accent);
          color: var(--on-accent);
          border-radius: 6px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          align-self: flex-start;
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
        }
        .project-demo-link {
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          color: #e8e8ed;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgb(232 232 237 / 0.4);
        }
        .project-demo-link:hover {
          text-decoration-color: currentColor;
        }
        .project-featured-badge {
          position: absolute;
          top: 16px;
          left: 16px;
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
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 10px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .project-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 16px !important;
            padding: 0 16px !important;
          }
          .glass-card {
            height: 340px !important;
          }
          .project-card-overlay {
            padding: 22px !important;
            background: linear-gradient(to top, rgba(12, 12, 14, 0.98), rgba(12, 12, 14, 0.35)) !important;
          }
          .project-card-title {
            font-size: 1.2rem !important;
          }
          .project-card-desc {
            font-size: 0.85rem !important;
            -webkit-line-clamp: 2 !important;
            margin-bottom: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .project-card-overlay {
            padding: 16px !important;
          }
          .project-card-title {
            font-size: 1.1rem !important;
          }
          .project-card-desc {
            font-size: 0.8rem !important;
            -webkit-line-clamp: 2 !important;
          }
          .glass-card {
            height: 300px !important;
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
          {filteredProjects.map((project) => (
            <m.div
              key={project.id}
              className="glass-card"
              variants={scaleStaggerItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                height: 'clamp(280px, 50vw, 380px)',
                position: 'relative',
                border: '1px solid var(--border)',
                transition: 'border-color 0.3s ease',
              }}
              whileHover={{
                y: -4,
                borderColor: 'var(--border-strong)',
                transition: { duration: 0.25 }
              }}
            >
              <div className="project-image" style={{ height: '100%', width: '100%', position: 'relative' }}>
                {project.image ? (
                  <m.img
                    src={withBasePath(project.image)}
                    alt={project.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <ProjectImage project={project} variant="backdrop" />
                )}
                {project.featured && <span className="project-featured-badge">Featured</span>}
                <div className="project-card-overlay">
                  <h3 className="project-card-title">
                    {project.title}
                  </h3>
                  <p className="project-card-desc">
                    {project.description}
                  </p>
                  <div className="project-card-actions">
                    <Link
                      href={`/project/${project.id}`}
                      className="view-project-btn"
                    >
                      View Details →
                    </Link>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-demo-link"
                      >
                        Live demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
