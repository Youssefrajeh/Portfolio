'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const BUCKET_COUNT = 7;
const NAME_POOL = ['sara', 'omar', 'lina', 'zaid', 'noor', 'kareem', 'maya', 'adam', 'rana', 'tariq'];

interface Entry {
  key: string;
  value: number;
}

function hashKey(key: string): number {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % BUCKET_COUNT;
}

export default function HashTableWidget() {
  const [buckets, setBuckets] = useState<Entry[][]>(() => Array.from({ length: BUCKET_COUNT }, () => []));
  const { entries: log, pushEntry } = useOperationLog(6);
  const [lookupKey, setLookupKey] = useState('sara');
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);

  const handleSet = () => {
    const key = NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
    const value = Math.floor(Math.random() * 90) + 10;
    const bucket = hashKey(key);
    setHighlightBucket(bucket);

    setBuckets((prev) => {
      const next = prev.map((b) => [...b]);
      const existingIdx = next[bucket].findIndex((e) => e.key === key);
      if (existingIdx >= 0) next[bucket][existingIdx] = { key, value };
      else next[bucket].push({ key, value });
      return next;
    });

    const collision = buckets[bucket].length > 0 && !buckets[bucket].some((e) => e.key === key);
    pushEntry(
      `table.set('${key}', ${value})`,
      collision ? `hash → bucket ${bucket} (collision, chained)` : `hash → bucket ${bucket}`
    );
  };

  const handleGet = () => {
    const bucket = hashKey(lookupKey);
    setHighlightBucket(bucket);
    const entry = buckets[bucket].find((e) => e.key === lookupKey);
    pushEntry(`table.get('${lookupKey}')`, entry ? `bucket ${bucket} → ${entry.value}` : `bucket ${bucket} → undefined`);
  };

  return (
    <>
      <div className="ds-hash-grid">
        {buckets.map((bucket, i) => (
          <div key={i} className={`ds-hash-row ${highlightBucket === i ? 'ds-hash-row-active' : ''}`}>
            <span className="ds-hash-index">{i}</span>
            <div className="ds-hash-chain">
              <AnimatePresence initial={false}>
                {bucket.map((entry) => (
                  <m.div
                    key={entry.key}
                    className="ds-hash-entry"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="ds-hash-key">{entry.key}</span>
                    <span className="ds-hash-val">{entry.value}</span>
                  </m.div>
                ))}
              </AnimatePresence>
              {bucket.length === 0 && <span className="ds-empty-note">empty</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handleSet}>Set random entry</button>
        <div className="ds-inline-input">
          <select className="ds-input" value={lookupKey} onChange={(e) => setLookupKey(e.target.value)}>
            {NAME_POOL.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button className="ds-btn" onClick={handleGet}>Get</button>
        </div>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
