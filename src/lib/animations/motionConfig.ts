export const motionConfig = {
  duration: { fast: 0.25, normal: 0.62, slow: 0.95 },
  ease: { reveal: 'power3.out', smooth: 'power2.inOut', linear: 'none' },
  stagger: { fast: 0.06, normal: 0.12, slow: 0.18 },
  breakpoints: { desktop: 1024 },
} as const;
