'use client';

import { m } from 'motion/react';
import { experienceData } from '@/data/experienceData';
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '@/lib/motionVariants';

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <style>{`
        .experience {
          padding-inline: 20px;
          background: var(--bg);
        }
        .experience-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .exp-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px 32px;
          transition: border-color 0.3s ease;
          text-align: left;
        }
        .exp-card:hover {
          border-color: var(--border-strong);
        }
        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .exp-title {
          font-family: var(--font-space), sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px 0;
          text-align: left;
        }
        .exp-company {
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.88rem;
          color: var(--accent);
          margin: 0;
          text-align: left;
          font-weight: 500;
        }
        .exp-duration {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
          padding: 4px 12px;
          background: var(--border);
          border-radius: 6px;
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .exp-list {
          list-style: none;
          padding: 0;
          margin: 0 0 18px 0;
        }
        .exp-list-item {
          padding: 6px 0 6px 16px;
          border-left: 2px solid var(--border);
          color: var(--text-dim);
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.93rem;
          line-height: 1.6;
          text-align: left;
        }
        .exp-tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tech-tag {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.7rem;
          padding: 3px 10px;
          border-radius: 4px;
          background: rgb(var(--accent-rgb) / 0.06);
          color: var(--text-faint);
          border: 1px solid var(--border);
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }
        .tech-tag:hover {
          color: var(--text-dim);
        }
        @media (max-width: 768px) {
          .exp-card {
            padding: 22px 20px;
          }
          .exp-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .exp-list-item {
            font-size: 0.9rem;
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
        Experience
      </m.h2>

      <m.div
        className="experience-container"
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {experienceData.map((exp) => (
          <m.div key={exp.id} className="exp-card" variants={staggerItem}>
            <div className="exp-header">
              <div>
                <h3 className="exp-title">{exp.title}</h3>
                <p className="exp-company">{exp.company}</p>
              </div>
              <span className="exp-duration">{exp.duration}</span>
            </div>

            <ul className="exp-list">
              {exp.responsibilities.map((responsibility, index) => (
                <li key={index} className="exp-list-item">
                  {responsibility}
                </li>
              ))}
            </ul>

            <div className="exp-tech-stack">
              {exp.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </m.div>
        ))}
      </m.div>
    </section>
  );
};

export default Experience;
