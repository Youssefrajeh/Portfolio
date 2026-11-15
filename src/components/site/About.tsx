'use client';

import { m } from 'motion/react';
import { fadeInUp, fadeInLeft, staggerContainer, staggerItem, viewportConfig } from '@/lib/motionVariants';
import { CV_PATH, IT_RESUME_PATH, withBasePath } from '@/lib/site';

const About = () => {
  return (
    <section id="about" className="about">
      <style>{`
        .about-layout {
          display: flex;
          align-items: flex-start;
          gap: 48px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .about-photo-frame {
          width: 240px;
          height: 240px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid var(--border);
        }

        .about-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .about-text-col {
          flex: 1;
        }

        .about-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: rgba(163, 230, 53, 0.08);
          border: 1px solid rgba(163, 230, 53, 0.2);
          border-radius: 6px;
          margin-bottom: 20px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: #a3e635;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .about-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a3e635;
        }

        .language-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
          margin-bottom: 16px;
        }

        .language-badge {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 6px;
          background: rgb(var(--accent-rgb) / 0.06);
          color: var(--text-dim);
          border: 1px solid var(--border);
          letter-spacing: 0.03em;
        }

        .about-highlights {
          margin-top: 24px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }

        .about-highlight-card {
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          text-align: left;
          transition: border-color 0.3s ease;
        }

        .about-highlight-card:hover {
          border-color: var(--border-strong);
        }

        .highlight-value {
          margin: 0 0 4px 0;
          font-family: var(--font-space), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          text-align: left;
        }

        .highlight-label {
          margin: 0;
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.82rem;
          color: var(--text-faint);
          text-align: left;
          line-height: 1.4;
        }

        .about-text p {
          font-family: var(--font-hanken), sans-serif;
          color: var(--text-dim);
          line-height: 1.75;
          font-size: 1rem;
          text-align: left;
        }

        .about-cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: var(--accent);
          color: var(--on-accent);
          border: none;
          border-radius: 8px;
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }

        .about-cv-btn:hover {
          background: var(--accent-strong);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
        }

        .cv-button {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .about-cv-btn-alt {
          background: transparent;
          color: var(--accent);
          box-shadow: inset 0 0 0 1px rgb(var(--accent-rgb) / 0.5);
        }

        .about-cv-btn-alt:hover {
          background: rgb(var(--accent-rgb) / 0.1);
          box-shadow: inset 0 0 0 1px var(--accent);
        }

        @media (max-width: 768px) {
          .about-layout {
            flex-direction: column;
            gap: 28px;
            text-align: center;
            align-items: center;
            padding: 0 10px;
          }
          .about-photo-frame {
            width: 160px;
            height: 160px;
            border-radius: 50%;
          }
          .about-status-badge {
            margin-bottom: 16px;
          }
          .about-text p {
            font-size: 0.92rem;
            text-align: center;
          }
          .about-highlight-card {
            text-align: center;
            padding: 14px 12px;
          }
          .highlight-value {
            text-align: center;
            font-size: 0.9rem;
          }
          .highlight-label {
            text-align: center;
            font-size: 0.78rem;
          }
          .about-highlights {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .language-badges {
            justify-content: center;
            gap: 8px;
          }
          .about-cv-btn {
            width: 100%;
            justify-content: center;
            padding: 14px 24px;
          }
          #about .section-title {
            margin-bottom: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .about-photo-frame {
            width: 130px;
            height: 130px;
          }
          .about-highlights {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .about-text p {
            font-size: 0.88rem;
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
        About
      </m.h2>

      <div className="about-layout">
        <m.div
          className="about-photo-col"
          style={{ flexShrink: 0 }}
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="about-photo-frame">
            <img
              src={withBasePath('/images/youssef.jpeg')}
              alt="Youssef Rajeh"
              className="about-photo-img"
              loading="lazy"
            />
          </div>
        </m.div>

        <m.div
          className="about-text-col"
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="about-text">
            <m.div className="about-status-badge" variants={staggerItem}>
              <span className="about-status-dot"></span>
              Available for Work
            </m.div>

            <m.p variants={staggerItem}>
              I’m a full-stack software developer and IT support specialist who builds web, enterprise, and mobile applications end to end—from database design to cloud deployment and DNS management in AWS—using C#, ASP.NET Core, Java, Spring Boot, Angular, React, Vue.js, Node.js, TypeScript, Kotlin (Android), Python, PHP, SQL Server, PostgreSQL, MySQL, MongoDB, and Docker. I’m completing the Computer Programming and Analysis advanced diploma (co-op) at Fanshawe College in December 2026.
            </m.p>
            <m.p variants={staggerItem}>
              Alongside software development, I bring 5 years of hands-on computer sales and service experience diagnosing hardware and OS problems, setting up Windows and drivers, and upgrading RAM and drives, plus 15+ years in manufacturing quality assurance and production leadership as a calm first responder who traces problems to their root cause, documents fixes, and explains them clearly in plain language.
            </m.p>

            <m.div className="about-highlights" variants={staggerContainer(0.08, 0.1)}>
              <m.article className="about-highlight-card" variants={staggerItem}>
                <p className="highlight-value">3.97 GPA</p>
                <p className="highlight-label">Dean’s Honour Roll, Fanshawe College</p>
              </m.article>
              <m.article className="about-highlight-card" variants={staggerItem}>
                <p className="highlight-value">Dec 2026</p>
                <p className="highlight-label">Graduating, advanced diploma (co-op)</p>
              </m.article>
              <m.article className="about-highlight-card" variants={staggerItem}>
                <p className="highlight-value">15+ years</p>
                <p className="highlight-label">IT support, QA & production leadership</p>
              </m.article>
            </m.div>

            <m.div
              className="language-badges"
              variants={staggerContainer(0.08, 0)}
            >
              <m.span className="language-badge" variants={staggerItem}>Arabic (Native / Fluent)</m.span>
              <m.span className="language-badge" variants={staggerItem}>English (Advanced)</m.span>
              <m.span className="language-badge" variants={staggerItem}>French (Beginner)</m.span>
            </m.div>

            <m.div className="cv-button" variants={staggerItem}>
              <a href={withBasePath(CV_PATH)} className="about-cv-btn" download>
                <i className="fas fa-download" aria-hidden="true"></i> Download CV
              </a>
              <a
                href={withBasePath(IT_RESUME_PATH)}
                className="about-cv-btn about-cv-btn-alt"
                download
              >
                <i className="fas fa-download" aria-hidden="true"></i> IT Support resume
              </a>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default About;
