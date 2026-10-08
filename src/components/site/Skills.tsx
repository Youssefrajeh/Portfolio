'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { skillsData, skillCategories } from '@/data/skillsData';
import { fadeInUp, scaleStaggerItem, staggerContainer, viewportConfig } from '@/lib/motionVariants';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? skillsData
    : skillsData.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="skills">
      <style>{`
        .skills-section-title {
          font-family: var(--font-space), sans-serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--text);
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: -0.5px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }
        .skill-card-modern {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.3s ease;
        }
        .skill-card-modern:hover {
          border-color: var(--border-strong);
        }
        .skill-card-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .skill-icon-box {
          width: 40px;
          height: 40px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          flex-shrink: 0;
        }
        .skill-icon-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .skill-card-info {
          flex: 1;
          min-width: 0;
        }
        .skill-card-name {
          font-family: var(--font-space), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 2px 0;
          text-align: left;
        }
        .skill-card-level {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.68rem;
          color: var(--text-faint);
          font-weight: 500;
          text-align: left;
          margin: 0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .skill-card-desc {
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.83rem;
          color: var(--text-faint);
          line-height: 1.5;
          margin: 0;
          text-align: left;
        }
        @media (max-width: 768px) {
          .skills-section-title {
            font-size: 1.6rem;
            margin-bottom: 25px;
          }
          .skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 12px;
            padding: 0 16px;
          }
          .skill-card-modern {
            padding: 18px;
            gap: 10px;
          }
        }
      `}</style>

      <m.h2
        className="skills-section-title"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        Skills
      </m.h2>

      {/* Skills Categories Filter */}
      <div className="skills-categories">
        <style>{`
          .skills-categories {
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
            .skills-categories {
              justify-content: flex-start;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              margin-bottom: 28px;
              padding-bottom: 8px;
            }
            .skills-categories::-webkit-scrollbar {
              display: none;
            }
            .skills-categories .category-filter {
              white-space: nowrap;
              flex-shrink: 0;
              font-size: 0.82rem;
              padding: 7px 16px;
            }
          }
        `}</style>
        {skillCategories.map((category) => (
          <m.button
            key={category.id}
            className={`category-filter ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            whileTap={{ scale: 0.97 }}
            style={{
              background: activeCategory === category.id ? 'rgb(var(--accent-rgb) / 0.1)' : 'transparent',
              border: activeCategory === category.id ? '1px solid rgb(var(--accent-rgb) / 0.3)' : '1px solid var(--border)',
              color: activeCategory === category.id ? 'var(--text)' : 'var(--text-faint)',
              fontFamily: 'var(--font-hanken), sans-serif',
              fontWeight: activeCategory === category.id ? '600' : '500'
            }}
          >
            {category.name}
          </m.button>
        ))}
      </div>

      {/* Skills Grid */}
      <m.div
        className="skills-grid"
        variants={staggerContainer(0.04, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        key={activeCategory}
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <m.div
              key={skill.id}
              className="skill-card-modern"
              variants={scaleStaggerItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className="skill-card-top">
                <div className="skill-icon-box">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <div className="skill-card-info">
                  <h3 className="skill-card-name">{skill.name}</h3>
                  <p className="skill-card-level">{skill.level}</p>
                </div>
              </div>
              <p className="skill-card-desc">{skill.description}</p>
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
    </section>
  );
};

export default Skills;
