'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { THEMES } from '@/lib/themes';

// Palette button that opens a menu of every theme. Shared across every page's
// nav - each page wraps it with its own positioning class, the styling below
// is self-contained so it drops into any surface cleanly.
export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <style>{`
        .theme-picker {
          position: relative;
          display: inline-flex;
          flex-shrink: 0;
        }

        .theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-dim);
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
          flex-shrink: 0;
        }

        .theme-toggle-btn:hover {
          color: var(--text);
          border-color: var(--border-strong);
        }

        .theme-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 2000;
          min-width: 170px;
          padding: 6px;
          margin: 0;
          list-style: none;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
          text-align: left;
        }

        .theme-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-dim);
          font: inherit;
          font-size: 0.88rem;
          cursor: pointer;
          text-align: left;
        }

        .theme-menu-item:hover,
        .theme-menu-item:focus-visible {
          background: var(--surface-2);
          color: var(--text);
          outline: none;
        }

        .theme-menu-item[aria-checked='true'] {
          color: var(--text);
          font-weight: 600;
        }

        .theme-swatch {
          position: relative;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 1px solid var(--border-strong);
        }

        .theme-swatch::after {
          content: '';
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--swatch-accent);
          border: 1px solid var(--border-strong);
        }

        .theme-check {
          margin-left: auto;
          font-size: 0.8rem;
        }
      `}</style>
      <div className="theme-picker" ref={rootRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Choose theme"
          aria-haspopup="menu"
          aria-expanded={open}
          title="Choose theme"
          className={`theme-toggle-btn ${className}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="1" />
            <circle cx="17.5" cy="10.5" r="1" />
            <circle cx="8.5" cy="7.5" r="1" />
            <circle cx="6.5" cy="12.5" r="1" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.5-.7-.5-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-9-10-9Z" />
          </svg>
        </button>
        {open && (
          <ul className="theme-menu" role="menu" aria-label="Theme">
            {THEMES.map((t) => (
              <li key={t.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === t.id}
                  className="theme-menu-item"
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                >
                  <span
                    className="theme-swatch"
                    style={{ background: t.swatch[0], '--swatch-accent': t.swatch[1] } as CSSProperties}
                  />
                  {t.label}
                  {theme === t.id && <span className="theme-check">✓</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
