'use client';

import { m } from 'motion/react';
import { educationData } from '@/data/educationData';
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '@/lib/motionVariants';

// Same card language as Experience (styles in globals.css: .exp-*).
const Education = () => {
  return (
    <section id="education" className="education">
      <style>{`
        .education {
          padding-inline: 20px;
          background: var(--bg);
        }
        .edu-highlight {
          color: var(--accent);
          border-color: rgb(var(--accent-rgb) / 0.3);
        }
      `}</style>

      <m.h2
        className="section-title"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        Education
      </m.h2>

      <m.div
        className="timeline-container"
        variants={staggerContainer(0.12, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {educationData.map((edu) => (
          <m.article key={edu.id} className="exp-card" variants={staggerItem}>
            <div className="exp-header">
              <div>
                <h3 className="exp-title">{edu.credential}</h3>
                <p className="exp-company">
                  {edu.institution} · {edu.location}
                </p>
              </div>
              <span className="exp-duration">{edu.period}</span>
            </div>

            <ul className="exp-list">
              {edu.details.map((detail) => (
                <li key={detail} className="exp-list-item">
                  {detail}
                </li>
              ))}
            </ul>

            {edu.highlights.length > 0 && (
              <div className="exp-tech-stack">
                {edu.highlights.map((highlight) => (
                  <span key={highlight} className="tech-tag edu-highlight">
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </m.article>
        ))}
      </m.div>
    </section>
  );
};

export default Education;
