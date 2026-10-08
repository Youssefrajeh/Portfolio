'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const randomVal = () => Math.floor(Math.random() * 90) + 10;
const parentOf = (i: number) => Math.floor((i - 1) / 2);
const childrenOf = (i: number) => [2 * i + 1, 2 * i + 2];

export default function HeapWidget() {
  const [items, setItems] = useState([8, 15, 12, 40, 25, 60, 33]);
  const { entries: log, pushEntry } = useOperationLog(6);
  const [highlight, setHighlight] = useState<number | null>(null);

  const handleInsert = () => {
    const v = randomVal();
    const arr = [...items, v];
    let i = arr.length - 1;
    let hops = 0;
    while (i > 0 && arr[parentOf(i)] > arr[i]) {
      [arr[i], arr[parentOf(i)]] = [arr[parentOf(i)], arr[i]];
      i = parentOf(i);
      hops += 1;
    }
    setItems(arr);
    setHighlight(i);
    pushEntry(`heap.insert(${v})`, hops > 0 ? `added at the end, bubbled up ${hops} level${hops === 1 ? '' : 's'}` : 'added at the end, already smaller than its parent');
  };

  const handleExtractMin = () => {
    if (items.length === 0) return;
    const min = items[0];
    const arr = [...items];
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      let i = 0;
      let hops = 0;
      while (true) {
        const [l, r] = childrenOf(i);
        let smallest = i;
        if (l < arr.length && arr[l] < arr[smallest]) smallest = l;
        if (r < arr.length && arr[r] < arr[smallest]) smallest = r;
        if (smallest === i) break;
        [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
        i = smallest;
        hops += 1;
      }
      setHighlight(i);
      pushEntry('heap.extractMin()', `removed ${min}, moved last element to the root and bubbled it down ${hops} level${hops === 1 ? '' : 's'}`);
    } else {
      setHighlight(null);
      pushEntry('heap.extractMin()', `removed ${min}, heap is now empty`);
    }
    setItems(arr);
  };

  return (
    <>
      <div className="ds-row" style={{ marginBottom: 6 }}>
        <AnimatePresence initial={false}>
          {items.map((val, i) => (
            <m.div
              key={`${i}-${val}`}
              className={`ds-cell ${i === 0 ? 'ds-cell-active' : ''} ${highlight === i ? 'ds-cell-flash' : ''}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
            >
              <span className="ds-cell-value">{val}</span>
              <span className="ds-cell-index">{i}</span>
              {i === 0 && <span className="ds-cell-tag">min</span>}
            </m.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <span className="ds-empty-note">empty heap</span>}
      </div>
      <p className="ds-heap-note">stored flat: index i’s children live at 2i+1 and 2i+2</p>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handleInsert}>Insert random</button>
        <button className="ds-btn" onClick={handleExtractMin} disabled={items.length === 0}>Extract min</button>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
