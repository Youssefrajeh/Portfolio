'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const randomVal = () => Math.floor(Math.random() * 90) + 10;

export default function ArrayWidget() {
  const [items, setItems] = useState([12, 45, 7, 30]);
  const { entries: log, pushEntry } = useOperationLog(6);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [indexInput, setIndexInput] = useState('1');

  const handlePush = () => {
    const v = randomVal();
    setItems((prev) => [...prev, v]);
    setHighlight(items.length);
    pushEntry(`array.push(${v})`, `length is now ${items.length + 1}`);
  };

  const handlePop = () => {
    if (items.length === 0) return;
    const v = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    setHighlight(null);
    pushEntry('array.pop()', `removed ${v}`);
  };

  const handleAccess = () => {
    const i = Number(indexInput);
    if (!Number.isInteger(i) || i < 0 || i >= items.length) {
      pushEntry(`array[${indexInput}]`, 'out of bounds');
      setHighlight(null);
      return;
    }
    setHighlight(i);
    pushEntry(`array[${i}]`, `${items[i]}`);
  };

  return (
    <>
      <div className="ds-row" style={{ marginBottom: 14 }}>
        <AnimatePresence initial={false}>
          {items.map((val, i) => (
            <m.div
              key={`${i}-${val}`}
              className={`ds-cell ${highlight === i ? 'ds-cell-active' : ''}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
            >
              <span className="ds-cell-value">{val}</span>
              <span className="ds-cell-index">{i}</span>
            </m.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <span className="ds-empty-note">empty array</span>}
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handlePush}>Push random</button>
        <button className="ds-btn" onClick={handlePop} disabled={items.length === 0}>Pop</button>
        <div className="ds-inline-input">
          <input
            className="ds-input"
            type="number"
            value={indexInput}
            onChange={(e) => setIndexInput(e.target.value)}
            style={{ width: 56 }}
          />
          <button className="ds-btn" onClick={handleAccess}>Access index</button>
        </div>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
