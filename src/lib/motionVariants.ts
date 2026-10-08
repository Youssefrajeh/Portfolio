/**
 * Centralized Framer Motion variants for the portfolio.
 * All components import from here for consistent animation language.
 * 
 * The `motion` package (v12) re-exports everything from `framer-motion`.
 */

import type { Variants } from 'motion/react';

type CubicBezier = [number, number, number, number];

// ─── Easing curves ───────────────────────────────────────────────
export const easings: Record<'smooth' | 'bounce' | 'snappy', CubicBezier> = {
  smooth: [0.16, 1, 0.3, 1],       // cubic-bezier for smooth decel
  bounce: [0.68, -0.55, 0.265, 1.55], // overshoot bounce
  snappy: [0.4, 0, 0.2, 1],        // material-style
};

// ─── Fade In Up (default section reveal) ─────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
      delay,
    },
  }),
};

// ─── Fade In Down (navbar entrance) ──────────────────────────────
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
};

// ─── Fade In Left ────────────────────────────────────────────────
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
      delay,
    },
  }),
};

// ─── Fade In Right ───────────────────────────────────────────────
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easings.smooth,
      delay,
    },
  }),
};

// ─── Scale In (cards, badges, icons) ─────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
      delay,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.3, ease: easings.snappy },
  },
};

// ─── Stagger Container ──────────────────────────────────────────
export const staggerContainer = (staggerDelay = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// ─── Stagger Item (child of staggerContainer) ───────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: easings.snappy },
  },
};

// ─── Scale Stagger Item (for grid cards with filter) ────────────
export const scaleStaggerItem: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25, ease: easings.snappy },
  },
};

// ─── Hero Scale In (logo entrance — spring for organic feel) ────
export const heroScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 14,
      mass: 1.5,
      opacity: { duration: 1.2, ease: easings.smooth },
    },
  },
};

// ─── Slide In From Right (mobile menu) ──────────────────────────
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: "0%",
    transition: {
      duration: 0.35,
      ease: easings.smooth,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.3,
      ease: easings.snappy,
    },
  },
};

// ─── Modal Backdrop ─────────────────────────────────────────────
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

// ─── Modal Content ──────────────────────────────────────────────
export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 10,
    transition: { duration: 0.25, ease: easings.snappy },
  },
};

// ─── Progress Bar ───────────────────────────────────────────────
export const progressBar = (percentage: number): Variants => ({
  hidden: { width: "0%" },
  visible: {
    width: `${percentage}%`,
    transition: {
      duration: 1,
      ease: easings.smooth,
      delay: 0.2,
    },
  },
});

// ─── Common whileInView config ──────────────────────────────────
export const viewportConfig = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -50px 0px",
} as const;
