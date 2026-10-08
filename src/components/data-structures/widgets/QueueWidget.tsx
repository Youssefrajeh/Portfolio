'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const randomVal = () => Math.floor(Math.random() * 90) + 10;

export default function QueueWidget() {
  const [items, setItems] = useState([9, 21, 5]);
  const { entries: log, pushEntry } = useOperationLog(6);

  const handleEnqueue = () => {
    const v = randomVal();
    setItems((prev) => [...prev, v]);
    pushEntry(`queue.enqueue(${v})`, 'joined the back');
  };

  const handleDequeue = () => {
    if (items.length === 0) return;
    const v = items[0];
    setItems((prev) => prev.slice(1));
    pushEntry('queue.dequeue()', `removed ${v} from the front`);
  };

  return (
    <>
      <div className="ds-row" style={{ marginBottom: 14, alignItems: 'center' }}>
        <span className="ds-endpoint-label">front</span>
        <AnimatePresence initial={false}>
          {items.map((val, i) => (
            <m.div
              key={`${i}-${val}`}
              className={`ds-cell ${i === 0 ? 'ds-cell-active' : ''}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              <span className="ds-cell-value">{val}</span>
            </m.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <span className="ds-empty-note">empty queue</span>}
        <span className="ds-endpoint-label">back</span>
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handleEnqueue}>Enqueue random</button>
        <button className="ds-btn" onClick={handleDequeue} disabled={items.length === 0}>Dequeue</button>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
