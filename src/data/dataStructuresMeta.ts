// Reference content for /data-structures. Kept separate from the widgets
// so the explanations can be reviewed and edited without touching any
// interaction logic.

export type StructureCategoryId =
  | 'linear'
  | 'lifo'
  | 'fifo'
  | 'keyvalue'
  | 'hierarchical'
  | 'networked';

export interface StructureCategory {
  id: StructureCategoryId;
  label: string;
}

export interface ComplexityRow {
  op: string;
  value: string;
}

export interface DataStructureMeta {
  id: string;
  category: StructureCategoryId;
  eyebrow: string;
  name: string;
  description: string;
  complexity: ComplexityRow[];
  useWhen: string;
  code: string;
}

export interface StructureGroup extends StructureCategory {
  items: DataStructureMeta[];
}

export const categories: StructureCategory[] = [
  { id: 'linear', label: 'Linear' },
  { id: 'lifo', label: 'LIFO' },
  { id: 'fifo', label: 'FIFO' },
  { id: 'keyvalue', label: 'Key → Value' },
  { id: 'hierarchical', label: 'Hierarchical' },
  { id: 'networked', label: 'Networked' }
];

export const dataStructures: DataStructureMeta[] = [
  {
    id: 'array',
    category: 'linear',
    eyebrow: 'Fixed-size, contiguous slots',
    name: 'Array',
    description:
      "A block of slots sitting next to each other in memory, numbered from 0. Because every slot is the same size, the computer can jump straight to index i with math (start address + i × slot size) instead of walking through it - that's why reading by index is instant, but inserting in the middle means shifting everything after it over by one.",
    complexity: [
      { op: 'Access by index', value: 'O(1)' },
      { op: 'Search (unsorted)', value: 'O(n)' },
      { op: 'Insert / remove at end', value: 'O(1)' },
      { op: 'Insert / remove at start or middle', value: 'O(n)' }
    ],
    useWhen:
      "You know how you'll look items up (by position) and mostly add or remove from the end - a list of the last 50 log lines, a game's frame buffer, a lookup table.",
    code: `const scores = [72, 88, 91];

scores[1];          // 88        - O(1), direct address math
scores.push(100);   // O(1) amortized - end has room
scores.unshift(0);  // O(n) - every element shifts right`
  },
  {
    id: 'linked-list',
    category: 'linear',
    eyebrow: 'Nodes scattered in memory, linked by pointers',
    name: 'Linked List',
    description:
      "Instead of sitting next to each other, each node lives wherever memory finds room and just holds a pointer to the next one. You give up instant indexing - to reach node 5 you have to walk nodes 1 through 4 - but inserting or removing a node is just rewiring two pointers, no shifting required.",
    complexity: [
      { op: 'Access by index', value: 'O(n)' },
      { op: 'Search', value: 'O(n)' },
      { op: 'Insert / remove at head', value: 'O(1)' },
      { op: 'Insert / remove at tail (with tail pointer)', value: 'O(1)' }
    ],
    useWhen:
      "You're constantly adding and removing from the ends and don't need random access - the undo history in an editor, a playlist you reorder often, the underlying structure for a stack or queue.",
    code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// insert at head - O(1), no shifting
function prepend(head, value) {
  const node = new Node(value);
  node.next = head;
  return node; // node is the new head
}`
  },
  {
    id: 'stack',
    category: 'lifo',
    eyebrow: 'Last in, first out',
    name: 'Stack',
    description:
      'One end only. You can push a new item on top or pop the top item off - that\'s the whole interface. Whatever went on last comes off first, the same way you can only take a plate off the top of a stack of plates.',
    complexity: [
      { op: 'Push', value: 'O(1)' },
      { op: 'Pop', value: 'O(1)' },
      { op: 'Peek (read top)', value: 'O(1)' },
      { op: 'Search', value: 'O(n)' }
    ],
    useWhen:
      'The most recent thing needs to be handled first - undo/redo, the call stack itself, matching brackets, "back" navigation in a browser.',
    code: `const stack = [];

stack.push(3);
stack.push(7);
stack.pop();   // 7 - removes and returns the top
stack.at(-1);  // 3 - peek without removing`
  },
  {
    id: 'queue',
    category: 'fifo',
    eyebrow: 'First in, first out',
    name: 'Queue',
    description:
      "Two ends: items join at the back and leave from the front. Whoever got in line first gets served first - same rule as a line at a checkout counter. A plain array can do this, but shifting the front element out is O(n); real queues use a linked list or a ring buffer so both ends stay O(1).",
    complexity: [
      { op: 'Enqueue', value: 'O(1)' },
      { op: 'Dequeue', value: 'O(1)' },
      { op: 'Peek (read front)', value: 'O(1)' },
      { op: 'Search', value: 'O(n)' }
    ],
    useWhen:
      'Work needs to happen in the order it arrived - a print queue, task scheduling, breadth-first search\'s frontier, requests waiting on a server.',
    code: `class Queue {
  #items = [];
  enqueue(v) { this.#items.push(v); }        // join the back
  dequeue()  { return this.#items.shift(); } // leave the front
  peek()     { return this.#items[0]; }
}`
  },
  {
    id: 'hash-table',
    category: 'keyvalue',
    eyebrow: 'A key, hashed to a bucket',
    name: 'Hash Table',
    description:
      "A key gets run through a hash function that turns it into a number, and that number picks which bucket the value lands in - so looking a key up means hashing it and going straight to that bucket instead of scanning everything. Two different keys can hash to the same bucket (a collision); most implementations just keep a small list at that bucket and check each one.",
    complexity: [
      { op: 'Get / set / delete (average)', value: 'O(1)' },
      { op: 'Get / set / delete (worst case, many collisions)', value: 'O(n)' }
    ],
    useWhen:
      "You look things up by a meaningful key instead of a position - caching API responses by URL, counting word frequency, a dictionary, deduplicating a list.",
    code: `const ages = new Map();

ages.set('sara', 29);   // hash('sara') picks a bucket - O(1)
ages.get('sara');       // 29 - hash again, same bucket
ages.has('marco');      // false`
  },
  {
    id: 'binary-search-tree',
    category: 'hierarchical',
    eyebrow: 'Ordered, branching, self-referential',
    name: 'Binary Search Tree',
    description:
      "Every node has at most two children, and the tree keeps an invariant: everything in the left subtree is smaller than the node, everything in the right subtree is bigger. That invariant is what makes search fast - at each node you learn which half the value must be in and throw the other half away, the same trick as binary search on a sorted array.",
    complexity: [
      { op: 'Search / insert / delete (balanced)', value: 'O(log n)' },
      { op: 'Search / insert / delete (worst case, unbalanced)', value: 'O(n)' },
      { op: 'In-order traversal (visits every node, sorted)', value: 'O(n)' }
    ],
    useWhen:
      "You need fast lookup and the data sorted at the same time - autocomplete, a database index, anything where you'll repeatedly ask \"is X in here\" and also want to walk the values in order. A skewed insert order can degrade it to a linked list, which is why production trees usually self-balance (AVL, red-black).",
    code: `function insert(node, value) {
  if (!node) return { value, left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node; // duplicates are ignored here
}`
  },
  {
    id: 'heap',
    category: 'hierarchical',
    eyebrow: 'Priority order only, packed into an array',
    name: 'Heap (Min-Heap)',
    description:
      "A binary tree with one weaker, cheaper invariant than a BST: every parent is smaller than its children - nothing is said about left versus right. That's looser than a full sort, but it's enough to guarantee the smallest element is always sitting at the root, ready in O(1). Because every level is filled before the next starts, the whole tree can be packed into a plain array with no pointers at all: a node at index i has children at 2i+1 and 2i+2.",
    complexity: [
      { op: 'Find min / max', value: 'O(1)' },
      { op: 'Insert', value: 'O(log n)' },
      { op: 'Extract min / max', value: 'O(log n)' },
      { op: 'Build heap from n items', value: 'O(n)' }
    ],
    useWhen:
      "You only ever need the current smallest (or largest) item, not a full sort - a priority queue, Dijkstra's shortest path, scheduling the next-soonest task, top-k elements streaming past.",
    code: `class MinHeap {
  #a = [];
  insert(v) {
    this.#a.push(v);
    this.#bubbleUp(this.#a.length - 1); // O(log n)
  }
  extractMin() {
    const min = this.#a[0];
    const last = this.#a.pop();
    if (this.#a.length) { this.#a[0] = last; this.#bubbleDown(0); }
    return min; // O(log n)
  }
}`
  },
  {
    id: 'graph',
    category: 'networked',
    eyebrow: 'Arbitrary connections between nodes',
    name: 'Graph',
    description:
      "Nodes with connections between them that don't have to form a hierarchy - any node can connect to any other. Usually stored as an adjacency list: each node keeps a list of the nodes it's directly connected to. Breadth-first search explores level by level using a queue (nearest neighbours first); depth-first search commits to one path and backtracks, using a stack (or recursion, which is a stack in disguise).",
    complexity: [
      { op: 'Add edge', value: 'O(1)' },
      { op: 'BFS / DFS traversal', value: 'O(V + E)' },
      { op: 'Check if edge exists (adjacency list)', value: 'O(n)' }
    ],
    useWhen:
      "Relationships matter more than order - social networks, road maps and routing, dependency resolution (build systems, package managers), recommendation engines.",
    code: `const graph = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] };

function bfs(start) {
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) {
      if (!seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return order;
}`
  }
];

export function getStructureById(id: string): DataStructureMeta | null {
  return dataStructures.find((s) => s.id === id) || null;
}

export function getStructuresByCategory(): StructureGroup[] {
  return categories.map((cat) => ({
    ...cat,
    items: dataStructures.filter((s) => s.category === cat.id)
  }));
}
