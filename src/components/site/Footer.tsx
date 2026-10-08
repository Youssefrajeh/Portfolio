'use client';

import { m } from 'motion/react';
import Link from 'next/link';
import { fadeInUp, viewportConfig } from '@/lib/motionVariants';

const Footer = () => {
  return (
    <m.footer
      className="footer"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <style>{`
        .footer {
          padding: 40px 20px 30px;
          text-align: center;
          border-top: 1px solid var(--border);
        }
        .footer-socials {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .footer-social-link {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--border);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-faint);
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .footer-social-link:hover {
          color: var(--text);
          border-color: var(--border-strong);
        }
        .footer-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-faint);
          text-decoration: none;
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.85rem;
          margin-bottom: 16px;
          transition: color 0.3s ease;
        }
        .footer-back-link:hover {
          color: var(--text);
        }
        .footer-copy {
          font-family: var(--font-hanken), sans-serif;
          color: var(--text-faint);
          font-size: 0.82rem;
          margin: 0;
        }
      `}</style>

      <Link href="/" className="footer-back-link">
        <i className="fas fa-arrow-left"></i>
        Back to Hub
      </Link>

      <div className="footer-socials">
        <a href="https://github.com/Youssefrajeh" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/youssefrajeh" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="https://wa.me/15483884360" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
          <i className="fab fa-whatsapp"></i>
        </a>
        <a href="mailto:youssefrrajeh@gmail.com" className="footer-social-link" aria-label="Email">
          <i className="fas fa-envelope"></i>
        </a>
      </div>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Youssef Rajeh
      </p>
    </m.footer>
  );
};

export default Footer;
