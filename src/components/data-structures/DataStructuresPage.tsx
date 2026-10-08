'use client';

import { useEffect, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { m } from 'motion/react';
import { dataStructures, getStructuresByCategory } from '@/data/dataStructuresMeta';
import { staggerContainer, staggerItem } from '@/lib/motionVariants';
import Section from './shared/Section';
import ThemeToggle from '@/components/site/ThemeToggle';
import ArrayWidget from './widgets/ArrayWidget';
import LinkedListWidget from './widgets/LinkedListWidget';
import StackWidget from './widgets/StackWidget';
import QueueWidget from './widgets/QueueWidget';
import HashTableWidget from './widgets/HashTableWidget';
import BSTWidget from './widgets/BSTWidget';
import HeapWidget from './widgets/HeapWidget';
import GraphWidget from './widgets/GraphWidget';

// Interactive demo for each structure, keyed by DataStructureMeta.id
const WIDGETS: Record<string, ComponentType> = {
  array: ArrayWidget,
  'linked-list': LinkedListWidget,
  stack: StackWidget,
  queue: QueueWidget,
  'hash-table': HashTableWidget,
  'binary-search-tree': BSTWidget,
  heap: HeapWidget,
  graph: GraphWidget
};

const HERO_PREVIEW = [12, 45, 7, 30, 91];

export default function DataStructuresPage() {
  const [activeId, setActiveId] = useState(dataStructures[0].id);
  const grouped = getStructuresByCategory();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    dataStructures.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="ds-page">
      <style>{`
        .ds-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-hanken), sans-serif;
        }

        /* ── Top bar ────────────────────────────────────────────── */
        .ds-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          padding: 14px 24px;
        }

        .ds-topbar-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .ds-brand {
          display: flex;
          align-items: baseline;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
        }

        .ds-brand-title {
          font-family: var(--font-space), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
        }

        .ds-back-link {
          color: var(--text-faint);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.15s ease;
        }

        .ds-back-link:hover {
          color: var(--text);
        }

        /* ── Mobile pill nav ────────────────────────────────────── */
        .ds-mobile-nav {
          display: none;
        }

        /* ── Layout ─────────────────────────────────────────────── */
        .ds-layout {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
          padding: 32px 24px 80px;
        }

        .ds-sidebar {
          position: sticky;
          top: 68px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: calc(100vh - 90px);
          overflow-y: auto;
        }

        .ds-sidebar-group {
          margin-bottom: 18px;
        }

        .ds-sidebar-group-label {
          display: block;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.68rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0 12px;
          margin-bottom: 6px;
        }

        .ds-sidebar-link {
          display: block;
          padding: 8px 12px;
          border-radius: 6px;
          color: var(--text-faint);
          text-decoration: none;
          font-size: 0.87rem;
          font-weight: 500;
          border-left: 2px solid transparent;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .ds-sidebar-link:hover {
          color: var(--text-dim);
        }

        .ds-sidebar-link.active {
          color: var(--accent-soft);
          background: rgb(var(--accent-rgb) / 0.08);
          border-left-color: var(--accent);
        }

        .ds-main {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        /* ── Hero ───────────────────────────────────────────────── */
        .ds-hero {
          padding: 20px 0 8px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 8px;
        }

        .ds-hero-eyebrow {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.78rem;
          color: var(--accent-soft);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 12px 0;
        }

        .ds-hero-title {
          font-family: var(--font-space), sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 16px 0;
          max-width: 640px;
        }

        .ds-hero-sub {
          font-size: 1rem;
          color: var(--text-dim);
          line-height: 1.65;
          max-width: 560px;
          margin: 0 0 28px 0;
        }

        .ds-hero-preview {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
        }

        /* ── Category grouping ──────────────────────────────────── */
        .ds-category-group {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .ds-category-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: -32px;
        }

        .ds-category-label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        .ds-category-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── Section ────────────────────────────────────────────── */
        .ds-section {
          scroll-margin-top: 88px;
        }

        .ds-section-head {
          margin-bottom: 18px;
        }

        .ds-eyebrow {
          display: inline-block;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: var(--accent-soft);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }

        .ds-section-title {
          font-family: var(--font-space), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.01em;
        }

        .ds-section-desc {
          font-size: 0.92rem;
          color: var(--text-dim);
          line-height: 1.65;
          max-width: 720px;
          margin: 0;
        }

        .ds-widget-shell {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .ds-section-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }

        .ds-meta-heading {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 10px 0;
        }

        .ds-use-when {
          font-size: 0.88rem;
          color: var(--text-dim);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Complexity table ───────────────────────────────────── */
        .ds-complexity-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ds-complexity-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.85rem;
        }

        .ds-complexity-op {
          color: var(--text-dim);
        }

        .ds-complexity-badge {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 5px;
          white-space: nowrap;
        }

        /* ── Code block ─────────────────────────────────────────── */
        .ds-code-block {
          background: var(--surface-inset);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }

        .ds-code-label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.7rem;
          color: var(--text-faint);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 8px 14px;
          border-bottom: 1px solid var(--border);
        }

        .ds-code-pre {
          margin: 0;
          padding: 14px 16px;
          overflow-x: auto;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.82rem;
          line-height: 1.65;
          color: var(--text-dim);
        }

        /* ── Widget primitives (shared across all structures) ──── */
        .ds-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ds-cell {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ds-cell-wide {
          width: 96px;
        }

        .ds-cell-value {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text);
        }

        .ds-cell-index {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.62rem;
          color: var(--text-faint);
          margin-top: 2px;
        }

        .ds-cell-active {
          border-color: rgb(var(--accent-rgb) / 0.5);
          background: rgb(var(--accent-rgb) / 0.12);
        }

        .ds-cell-active .ds-cell-value {
          color: var(--accent-soft);
        }

        .ds-cell-flash {
          border-color: rgba(45, 212, 191, 0.5);
          background: rgba(45, 212, 191, 0.12);
        }

        .ds-cell-tag {
          position: absolute;
          top: -9px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--accent-soft);
          background: var(--bg);
          padding: 0 5px;
        }

        .ds-empty-note {
          font-size: 0.85rem;
          color: var(--text-faint);
          font-style: italic;
          align-self: center;
        }

        .ds-endpoint-label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-faint);
        }

        .ds-null-node {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.78rem;
          color: var(--text-faint);
          display: flex;
          align-items: center;
        }

        .ds-arrow {
          color: var(--text-faint);
          flex-shrink: 0;
        }

        .ds-stack-frame {
          display: flex;
          justify-content: center;
          min-height: 220px;
          align-items: flex-end;
        }

        .ds-stack-column {
          display: flex;
          flex-direction: column-reverse;
          gap: 6px;
          align-items: center;
        }

        /* ── Hash table ─────────────────────────────────────────── */
        .ds-hash-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ds-hash-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid transparent;
        }

        .ds-hash-row-active {
          background: rgb(var(--accent-rgb) / 0.08);
          border-color: rgb(var(--accent-rgb) / 0.25);
        }

        .ds-hash-index {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.78rem;
          color: var(--text-faint);
          width: 16px;
          flex-shrink: 0;
        }

        .ds-hash-chain {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          min-height: 32px;
        }

        .ds-hash-entry {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          border-radius: 6px;
          padding: 5px 10px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.8rem;
        }

        .ds-hash-key {
          color: var(--accent-soft);
        }

        .ds-hash-val {
          color: var(--text-faint);
        }

        /* ── Tree / graph SVG ───────────────────────────────────── */
        .ds-tree-frame, .ds-graph-frame {
          display: flex;
          justify-content: center;
          overflow-x: auto;
        }

        .ds-tree-svg {
          overflow: visible;
        }

        .ds-tree-text {
          font-family: var(--font-jetbrains), monospace;
          font-size: 12px;
          fill: var(--text);
          pointer-events: none;
        }

        .ds-tree-node, .ds-graph-node-visited, .ds-tree-node-active {
          stroke-width: 1.5px;
        }

        .ds-tree-node {
          fill: var(--surface-2);
          stroke: var(--border-strong);
        }

        .ds-graph-node-visited {
          fill: rgb(var(--accent-rgb) / 0.18);
          stroke: rgb(var(--accent-rgb) / 0.4);
        }

        .ds-tree-node-active {
          fill: rgb(var(--accent-rgb) / 0.3);
          stroke: var(--accent);
        }

        .ds-heap-note {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.72rem;
          color: var(--text-faint);
          margin: 4px 0 0 0;
        }

        /* ── Controls ───────────────────────────────────────────── */
        .ds-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ds-btn {
          background: var(--border);
          border: 1px solid var(--border-strong);
          color: var(--text-dim);
          padding: 7px 14px;
          border-radius: 7px;
          font-family: var(--font-hanken), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ds-btn:hover:not(:disabled) {
          background: var(--border);
          border-color: var(--border-strong);
        }

        .ds-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ds-btn-primary {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--on-accent);
        }

        .ds-btn-primary:hover:not(:disabled) {
          background: var(--accent-strong);
          border-color: var(--accent-strong);
        }

        .ds-inline-input {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ds-input {
          background: var(--surface-inset);
          border: 1px solid var(--border-strong);
          color: var(--text);
          padding: 6px 8px;
          border-radius: 6px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.82rem;
          outline: none;
        }

        .ds-input:focus {
          border-color: var(--accent);
        }

        /* ── Operation log ──────────────────────────────────────── */
        .ds-log {
          background: var(--surface-inset);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          max-height: 130px;
          overflow-y: auto;
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.8rem;
        }

        .ds-log-empty {
          color: var(--text-faint);
        }

        .ds-log-line {
          padding: 2px 0;
          color: var(--text-dim);
        }

        .ds-log-arrow {
          color: var(--text-faint);
          margin-right: 6px;
        }

        .ds-log-call {
          color: var(--accent-soft);
        }

        .ds-log-result {
          color: var(--text-faint);
        }

        /* ── Responsive ─────────────────────────────────────────── */
        @media (max-width: 900px) {
          .ds-layout {
            grid-template-columns: 1fr;
            padding: 20px 16px 60px;
          }

          .ds-sidebar {
            display: none;
          }

          .ds-mobile-nav {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 10px 16px;
            border-bottom: 1px solid var(--border);
            -webkit-overflow-scrolling: touch;
          }

          .ds-mobile-nav-link {
            flex-shrink: 0;
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--text-faint);
            background: var(--border);
            border: 1px solid var(--border);
            padding: 6px 12px;
            border-radius: 999px;
            text-decoration: none;
            white-space: nowrap;
          }

          .ds-mobile-nav-link.active {
            color: var(--accent-soft);
            background: rgb(var(--accent-rgb) / 0.12);
            border-color: rgb(var(--accent-rgb) / 0.3);
          }

          .ds-section-meta {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .ds-topbar {
            padding: 12px 16px;
          }

          .ds-cell {
            width: 42px;
            height: 42px;
          }

          .ds-cell-wide {
            width: 84px;
          }
        }
      `}</style>

      <nav className="ds-topbar">
        <div className="ds-topbar-inner">
          <Link href="/" className="ds-brand">
            <span className="ds-brand-title">Data Structures</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" className="ds-back-link">← Back to site</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="ds-mobile-nav">
        {dataStructures.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`ds-mobile-nav-link ${activeId === s.id ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
          >
            {s.name}
          </a>
        ))}
      </div>

      <div className="ds-layout">
        <aside className="ds-sidebar">
          {grouped.map((cat) => (
            <div key={cat.id} className="ds-sidebar-group">
              <span className="ds-sidebar-group-label">{cat.label}</span>
              {cat.items.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`ds-sidebar-link ${activeId === s.id ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
                >
                  {s.name}
                </a>
              ))}
            </div>
          ))}
        </aside>

        <main className="ds-main">
          <div className="ds-hero">
            <p className="ds-hero-eyebrow">Reference & teaching notes</p>
            <h1 className="ds-hero-title">Data structures, explained by watching them work.</h1>
            <p className="ds-hero-sub">
              Every structure below is live — push, pop, insert, and search using the real
              operation, then read the trace underneath to see exactly what just happened
              and why it costs what it costs.
            </p>
            <m.div
              className="ds-hero-preview"
              variants={staggerContainer(0.06, 0.1)}
              initial="hidden"
              animate="visible"
            >
              {HERO_PREVIEW.map((v, i) => (
                <m.div key={i} className={`ds-cell ${i === 2 ? 'ds-cell-active' : ''}`} variants={staggerItem}>
                  <span className="ds-cell-value">{v}</span>
                  <span className="ds-cell-index">{i}</span>
                </m.div>
              ))}
            </m.div>
          </div>

          {grouped.map((cat) => (
            <div key={cat.id} className="ds-category-group">
              <div className="ds-category-divider">
                <span className="ds-category-label">{cat.label}</span>
                <span className="ds-category-line" />
              </div>
              {cat.items.map((meta) => {
                const Widget = WIDGETS[meta.id];
                return (
                  <Section key={meta.id} meta={meta}>
                    {Widget && <Widget />}
                  </Section>
                );
              })}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
