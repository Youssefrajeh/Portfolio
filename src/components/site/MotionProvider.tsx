'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domMax } from 'motion/react';

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {/* Honour the OS "reduce motion" setting: skip transform animations */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
