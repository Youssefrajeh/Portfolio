'use client';

export default function CodeBlock({ code, label = 'JavaScript' }: { code: string; label?: string }) {
  return (
    <div className="ds-code-block">
      <div className="ds-code-label">{label}</div>
      <pre className="ds-code-pre"><code>{code}</code></pre>
    </div>
  );
}
