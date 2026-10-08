'use client';

import type { ComplexityRow } from '@/data/dataStructuresMeta';

// Muted, desaturated per-complexity colors, ordered cool (fast) to warm
// (slow) so the cost of an operation reads at a glance.
const COMPLEXITY_COLOR: Record<string, { text: string; bg: string }> = {
  'O(1)': { text: '#7fd8cb', bg: 'rgba(45, 212, 191, 0.12)' },
  'O(log n)': { text: '#7dd3fc', bg: 'rgba(56, 189, 248, 0.12)' },
  'O(n)': { text: '#f5b878', bg: 'rgba(251, 146, 60, 0.12)' },
  'O(n log n)': { text: '#fcd34d', bg: 'rgba(250, 204, 21, 0.12)' },
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
