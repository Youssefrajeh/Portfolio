import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/retro.css';

export const metadata: Metadata = {
  title: 'Youssef Rajeh 95 | Retro Desktop Portfolio',
  description:
    "Youssef Rajeh's portfolio reimagined as a Windows 95 desktop - open windows, browse projects in Explorer, play Minesweeper and paint.",
  alternates: { canonical: '/retro/' },
};

export default function RetroLayout({ children }: { children: ReactNode }) {
  return children;
}
