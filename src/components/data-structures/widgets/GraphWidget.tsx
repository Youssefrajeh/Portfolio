'use client';

import { useState, useRef } from 'react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

type NodeId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

const ADJACENCY: Record<NodeId, NodeId[]> = {
  A: ['B', 'C'],
  B: ['A', 'D', 'F'],
  C: ['A', 'E', 'F'],
  D: ['B', 'F'],
  E: ['C', 'F'],
  F: ['B', 'C', 'D', 'E']
};

const POSITIONS: Record<NodeId, { x: number; y: number }> = {
  A: { x: 140, y: 20 },
  B: { x: 50, y: 95 },
  C: { x: 230, y: 95 },
  D: { x: 50, y: 175 },
  E: { x: 230, y: 175 },
  F: { x: 140, y: 135 }
};

const EDGES: [NodeId, NodeId][] = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'F'], ['C', 'E'], ['C', 'F'], ['D', 'F'], ['E', 'F']
];

const NODES = Object.keys(ADJACENCY) as NodeId[];

function bfsOrder(start: NodeId): NodeId[] {
  const seen = new Set<NodeId>([start]);
  const queue: NodeId[] = [start];
  const order: NodeId[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of ADJACENCY[node]) {
      if (!seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return order;
}

function dfsOrder(start: NodeId): NodeId[] {
  const seen = new Set<NodeId>();
  const order: NodeId[] = [];
  function visit(node: NodeId) {
    seen.add(node);
    order.push(node);
    for (const next of ADJACENCY[node]) {
      if (!seen.has(next)) visit(next);
    }
  }
  visit(start);
  return order;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function GraphWidget() {
  const [startNode, setStartNode] = useState<NodeId>('A');
  const [visited, setVisited] = useState<NodeId[]>([]);
  const [current, setCurrent] = useState<NodeId | null>(null);
  const { entries: log, pushEntry, clear: clearLog } = useOperationLog(7);
  const [running, setRunning] = useState(false);
  const runId = useRef(0);

  const run = async (mode: 'bfs' | 'dfs') => {
    const id = ++runId.current;
    setRunning(true);
    setVisited([]);
    setCurrent(null);
    clearLog();

    const order = mode === 'bfs' ? bfsOrder(startNode) : dfsOrder(startNode);
    pushEntry(`${mode}(${startNode})`, `visit order will be ${order.join(' → ')}`);

    for (const node of order) {
      if (runId.current !== id) return; // a newer run started, abandon this one
      await sleep(420);
      setCurrent(node);
      setVisited((prev) => [...prev, node]);
      pushEntry(`visit('${node}')`, `neighbors: ${ADJACENCY[node].join(', ')}`);
    }
    if (runId.current === id) setRunning(false);
  };

  return (
    <>
      <div className="ds-graph-frame">
        <svg width="280" height="200" className="ds-tree-svg">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={POSITIONS[a].x} y1={POSITIONS[a].y}
              x2={POSITIONS[b].x} y2={POSITIONS[b].y}
              stroke="var(--border-strong)" strokeWidth="1.5"
            />
          ))}
          {NODES.map((n) => {
            const isCurrent = current === n;
            const isVisited = visited.includes(n);
            return (
              <g key={n} transform={`translate(${POSITIONS[n].x}, ${POSITIONS[n].y})`}>
                <circle
                  r={18}
                  className={isCurrent ? 'ds-tree-node-active' : isVisited ? 'ds-graph-node-visited' : 'ds-tree-node'}
                />
                <text y={5} textAnchor="middle" className="ds-tree-text">{n}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="ds-controls">
        <div className="ds-inline-input">
          <span className="ds-endpoint-label" style={{ marginRight: 2 }}>start</span>
          <select className="ds-input" value={startNode} onChange={(e) => setStartNode(e.target.value as NodeId)} disabled={running}>
            {NODES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button className="ds-btn ds-btn-primary" onClick={() => run('bfs')} disabled={running}>Run BFS</button>
        <button className="ds-btn" onClick={() => run('dfs')} disabled={running}>Run DFS</button>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
