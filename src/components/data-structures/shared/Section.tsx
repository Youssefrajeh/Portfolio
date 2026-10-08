'use client';

import type { ReactNode } from 'react';
import { m } from 'motion/react';
import type { DataStructureMeta } from '@/data/dataStructuresMeta';
import ComplexityTable from './ComplexityTable';
import CodeBlock from './CodeBlock';

export default function Section({ meta, children }: { meta: DataStructureMeta; children: ReactNode }) {
  return (
    <m.section
      id={meta.id}
      className="ds-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ds-section-head">
        <span className="ds-eyebrow">{meta.eyebrow}</span>
        <h2 className="ds-section-title">{meta.name}</h2>
        <p className="ds-section-desc">{meta.description}</p>
      </div>

      <div className="ds-widget-shell">{children}</div>

      <div className="ds-section-meta">
        <div className="ds-meta-col">
          <h3 className="ds-meta-heading">Time complexity</h3>
          <ComplexityTable rows={meta.complexity} />
        </div>
        <div className="ds-meta-col">
          <h3 className="ds-meta-heading">Use it when</h3>
          <p className="ds-use-when">{meta.useWhen}</p>
        </div>
      </div>

      <CodeBlock code={meta.code} />
    </m.section>
  );
}
