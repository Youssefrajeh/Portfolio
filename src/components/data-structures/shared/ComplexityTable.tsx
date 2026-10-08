'use client';

import type { ComplexityRow } from '@/data/dataStructuresMeta';

// Muted, desaturated per-complexity colors - same restrained-palette rule
// used across the rest of the site.
const COMPLEXITY_COLOR: Record<string, { text: string; bg: string }> = {
  'O(1)': { text: '#7fd8cb', bg: 'rgba(45, 212, 191, 0.12)' },
  'O(log n)': { text: '#a5b0ff', bg: 'rgba(110, 124, 255, 0.12)' },
  'O(n)': { text: '#f5b878', bg: 'rgba(251, 146, 60, 0.12)' },
  'O(n log n)': { text: '#c1c1ff', bg: 'rgba(163, 163, 255, 0.12)' },
  'O(n)*': { text: '#f5b878', bg: 'rgba(251, 146, 60, 0.12)' },
  'O(V + E)': { text: '#f5b878', bg: 'rgba(251, 146, 60, 0.12)' },
  'O(n²)': { text: '#f0a8cc', bg: 'rgba(244, 114, 182, 0.12)' }
};

function Badge({ value }: { value: string }) {
  const colors = COMPLEXITY_COLOR[value] || { text: 'var(--text-dim)', bg: 'var(--border)' };
  return (
    <span className="ds-complexity-badge" style={{ color: colors.text, background: colors.bg }}>
      {value}
    </span>
  );
}

export default function ComplexityTable({ rows }: { rows: ComplexityRow[] }) {
  return (
    <div className="ds-complexity-table">
      {rows.map((row) => (
        <div className="ds-complexity-row" key={row.op}>
          <span className="ds-complexity-op">{row.op}</span>
          <Badge value={row.value} />
        </div>
      ))}
    </div>
  );
}
