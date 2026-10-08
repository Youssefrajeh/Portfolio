'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domMax } from 'motion/react';

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
