import type { Metadata } from 'next';
import DataStructuresPage from '@/components/data-structures/DataStructuresPage';

export const metadata: Metadata = {
  title: 'Data Structures Reference | Youssef Rajeh',
  description:
    'An interactive reference for core data structures - arrays, linked lists, stacks, queues, hash tables, trees, heaps, and graphs - with live operations, time complexity, and code.',
  alternates: { canonical: '/data-structures/' },
};

export default function Page() {
  return <DataStructuresPage />;
}
