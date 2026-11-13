'use client';

import { m } from 'motion/react';
import { skillsData, skillCategories } from '@/data/skillsData';
import { fadeInUp, staggerContainer, staggerItem, viewportConfig } from '@/lib/motionVariants';

// One card per category, each listing its skills as compact chips - the same
// grouping the CV uses, so the section scans at a glance.
const groups = skillCategories
  .filter((category) => category.id !== 'all')
  .map((category) => ({
    ...category,
    skills: skillsData.filter((skill) => skill.category === category.id),
  }))
  .filter((group) => group.skills.length > 0);

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <style>{`
        .skills-groups {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
        }
        .skill-group {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px 26px 26px;
          text-align: left;
          transition: border-color 0.3s ease;
        }
        .skill-group:hover {
          border-color: var(--border-strong);
        }
        .skill-group-title {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 16px 0;
          text-align: left;
        }
        .skill-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .skill-chip {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px 8px 10px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface-2);
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
        }
        .skill-chip img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .skills-groups {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .skill-group {
            padding: 20px;
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
        Skills
      </m.h2>

      <m.div
        className="skills-groups"
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {groups.map((group) => (
          <m.article key={group.id} className="skill-card-modern skill-group" variants={staggerItem}>
            <h3 className="skill-group-title">{group.name}</h3>
            <ul className="skill-chips">
              {group.skills.map((skill) => (
                <li key={skill.id} className="skill-chip" title={skill.description}>
                  <img src={skill.icon} alt="" loading="lazy" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </m.article>
        ))}
      </m.div>
    </section>
  );
};

export default Skills;
