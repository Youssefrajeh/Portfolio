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
