'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const randomVal = () => Math.floor(Math.random() * 90) + 10;

function Arrow() {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" className="ds-arrow">
      <line x1="0" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" />
      <path d="M13 3 L19 8 L13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LinkedListWidget() {
  const [items, setItems] = useState([3, 8, 15]);
  const { entries: log, pushEntry } = useOperationLog(6);

  const handlePrepend = () => {
    const v = randomVal();
    setItems((prev) => [v, ...prev]);
    pushEntry(`prepend(${v})`, 'new head, one pointer rewired');
  };

  const handleAppend = () => {
    const v = randomVal();
    setItems((prev) => [...prev, v]);
    pushEntry(`append(${v})`, 'new tail, previous tail now points to it');
  };

  const handleRemoveHead = () => {
    if (items.length === 0) return;
    const v = items[0];
    setItems((prev) => prev.slice(1));
    pushEntry('removeHead()', `removed ${v}, head pointer moved to the next node`);
  };

  return (
    <>
      <div className="ds-row" style={{ marginBottom: 14 }}>
        <AnimatePresence initial={false}>
          {items.map((val, i) => (
            <m.div
              key={`${i}-${val}`}
              style={{ display: 'flex', alignItems: 'center' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
            >
              <div className={`ds-cell ${i === 0 ? 'ds-cell-active' : ''}`}>
                <span className="ds-cell-value">{val}</span>
                {i === 0 && <span className="ds-cell-tag">head</span>}
              </div>
              <Arrow />
            </m.div>
          ))}
        </AnimatePresence>
        <span className="ds-null-node">null</span>
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handlePrepend}>Prepend random</button>
        <button className="ds-btn" onClick={handleAppend}>Append random</button>
        <button className="ds-btn" onClick={handleRemoveHead} disabled={items.length === 0}>Remove head</button>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
