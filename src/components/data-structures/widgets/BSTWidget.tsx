'use client';

import { useState, useMemo } from 'react';
import OperationLog, { useOperationLog } from '@/components/data-structures/shared/OperationLog';

const NODE_R = 20;
const X_GAP = 52;
const Y_GAP = 64;

interface Point {
  x: number;
  y: number;
  value: number;
}

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  _pos?: Point;
}

interface Edge {
  from: Point;
  to: Point;
}

function insert(node: TreeNode | null, value: number): TreeNode {
  if (!node) return { value, left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node;
}

function buildTree(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) root = insert(root, v);
  return root;
}

// In-order x assignment gives a left-to-right layout matching the BST
// invariant (small values left, large values right) with zero overlap.
// Two passes: first assign every node's (x, y) via in-order walk, then
// walk again to build edges now that every node knows its own position.
function layout(root: TreeNode | null) {
  const nodes: Point[] = [];
  const edges: Edge[] = [];
  let counter = 0;

  function assignPositions(node: TreeNode | null, depth: number) {
    if (!node) return;
    assignPositions(node.left, depth + 1);
    node._pos = { x: counter * X_GAP, y: depth * Y_GAP, value: node.value };
    counter += 1;
    nodes.push(node._pos);
    assignPositions(node.right, depth + 1);
  }

  function collectEdges(node: TreeNode | null) {
    if (!node) return;
    if (node.left) edges.push({ from: node._pos!, to: node.left._pos! });
    if (node.right) edges.push({ from: node._pos!, to: node.right._pos! });
    collectEdges(node.left);
    collectEdges(node.right);
  }

  assignPositions(root, 0);
  collectEdges(root);

  const maxX = Math.max(0, ...nodes.map((n) => n.x));
  return { nodes, edges, width: maxX + X_GAP, height: (nodes.length ? Math.max(...nodes.map((n) => n.y)) : 0) + Y_GAP };
}

const randomVal = () => Math.floor(Math.random() * 90) + 10;

export default function BSTWidget() {
  const [values, setValues] = useState([42, 21, 65, 8, 30, 54, 80]);
  const { entries: log, pushEntry } = useOperationLog(6);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('30');

  const root = useMemo(() => buildTree(values), [values]);
  const { nodes, edges, width, height } = useMemo(() => layout(root), [root]);

  const handleInsert = () => {
    const v = randomVal();
    if (values.includes(v)) {
      pushEntry(`bst.insert(${v})`, 'already present, ignored');
      return;
    }
    setValues((prev) => [...prev, v]);
    setHighlight(v);
    pushEntry(`bst.insert(${v})`, 'walked from the root, comparing at each node');
  };

  const handleSearch = () => {
    const target = Number(searchInput);
    let node = root;
    let steps = 0;
    let found = false;
    while (node) {
      steps += 1;
      if (target === node.value) { found = true; break; }
      node = target < node.value ? node.left : node.right;
    }
    setHighlight(found ? target : null);
    pushEntry(`bst.search(${target})`, found ? `found in ${steps} step${steps === 1 ? '' : 's'}` : `not found (${steps} step${steps === 1 ? '' : 's'})`);
  };

  return (
    <>
      <div className="ds-tree-frame">
        {nodes.length === 0 ? (
          <span className="ds-empty-note">empty tree</span>
        ) : (
          <svg width={width} height={height} className="ds-tree-svg">
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.from.x + NODE_R} y1={e.from.y + NODE_R}
                x2={e.to.x + NODE_R} y2={e.to.y + NODE_R}
                stroke="var(--border-strong)" strokeWidth="1.5"
              />
            ))}
            {nodes.map((n) => (
              <g key={n.value} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  cx={NODE_R} cy={NODE_R} r={NODE_R}
                  className={highlight === n.value ? 'ds-tree-node-active' : 'ds-tree-node'}
                />
                <text x={NODE_R} y={NODE_R + 4} textAnchor="middle" className="ds-tree-text">{n.value}</text>
              </g>
            ))}
          </svg>
        )}
      </div>

      <div className="ds-controls">
        <button className="ds-btn ds-btn-primary" onClick={handleInsert}>Insert random</button>
        <div className="ds-inline-input">
          <input
            className="ds-input"
            type="number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 64 }}
          />
          <button className="ds-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      <OperationLog entries={log} />
    </>
  );
}
