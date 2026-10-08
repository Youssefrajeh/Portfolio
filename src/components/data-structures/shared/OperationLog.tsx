'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface LogEntry {
  call: string;
  result?: string;
}

/**
 * State for an OperationLog: keeps only the most recent `maxEntries` calls.
 * Every widget shares this so they all trace operations the same way.
 */
export function useOperationLog(maxEntries = 6) {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const pushEntry = useCallback(
    (call: string, result?: string) =>
      setEntries((prev) => [...prev.slice(-(maxEntries - 1)), { call, result }]),
    [maxEntries],
  );
  const clear = useCallback(() => setEntries([]), []);

  return { entries, pushEntry, clear };
}

// A terminal-style trace of what each widget just did - the throughline
// device used by every structure on the page: watch the picture change,
// then read the exact call that caused it.
export default function OperationLog({ entries }: { entries: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="ds-log" ref={scrollRef}>
      {entries.length === 0 ? (
        <div className="ds-log-empty">{'// try an operation above'}</div>
      ) : (
        entries.map((entry, i) => (
          <div key={i} className="ds-log-line">
            <span className="ds-log-arrow">{'>'}</span>
            <span className="ds-log-call">{entry.call}</span>
            {entry.result && <span className="ds-log-result"> → {entry.result}</span>}
          </div>
        ))
      )}
    </div>
  );
}
