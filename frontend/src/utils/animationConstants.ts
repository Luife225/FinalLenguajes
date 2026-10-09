/**
 * Animation Constants
 * Centralized configuration for all GSAP animations.
 * Only transform and opacity are animated for GPU performance.
 */

// ─── Durations ───────────────────────────────────────────────
export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  medium: 0.5,
  slow: 0.6,
} as const;

// ─── Easings ─────────────────────────────────────────────────
export const EASE = {
  out: 'power2.out',
  inOut: 'power2.inOut',
  gentle: 'power1.out',
} as const;

// ─── Stagger ─────────────────────────────────────────────────
export const STAGGER = {
  grid: 0.08,
  list: 0.06,
} as const;

// ─── Offsets (px) ────────────────────────────────────────────
export const OFFSET = {
  cardEnter: 16,
  sectionReveal: 20,
} as const;

// ─── Scale values ────────────────────────────────────────────
export const SCALE = {
  cardHover: 1.04,
  buttonPress: 0.97,
} as const;

// ─── ScrollTrigger defaults ──────────────────────────────────
export const SCROLL = {
  start: 'top 88%',
  once: true,
} as const;

// ─── Reduced motion helper ──────────────────────────────────
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
