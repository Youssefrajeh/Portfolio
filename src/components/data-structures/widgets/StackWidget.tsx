'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const randomVal = () => Math.floor(Math.random() * 90) + 10;

export default function StackWidget() {
  const [items, setItems] = useState([4, 12, 7]);
  const { entries: log, pushEntry } = useOperationLog(6);

  const handlePush = () => {
    const v = randomVal();
    setItems((prev) => [...prev, v]);
    pushEntry(`stack.push(${v})`, `top is now ${v}`);
  };

  const handlePop = () => {
    if (items.length === 0) return;
    const v = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    pushEntry('stack.pop()', `removed ${v}`);
  };

  const handlePeek = () => {
    if (items.length === 0) {
      pushEntry('stack.peek()', 'empty');
      return;
    }
    pushEntry('stack.peek()', `${items[items.length - 1]}`);
  };

  return (
    <>
      <div className="ds-stack-frame">
        <div className="ds-stack-column">
          <AnimatePresence initial={false}>
            {[...items].reverse().map((val, i) => {
              const isTop = i === 0;
              return (
                <m.div
                  key={`${items.length - i}-${val}`}
                  className={`ds-cell ds-cell-wide ${isTop ? 'ds-cell-active' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="ds-cell-value">{val}</span>
                  {isTop && <span className="ds-cell-tag">top</span>}
                </m.div>
              );
            })}
          </AnimatePresence>
          {items.length === 0 && <span className="ds-empty-note">empty stack</span>}
        </div>
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handlePush}>Push random</button>
        <button className="ds-btn" onClick={handlePop} disabled={items.length === 0}>Pop</button>
        <button className="ds-btn" onClick={handlePeek}>Peek</button>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
