import { gsap, ScrollTrigger, registerMotionPlugins } from '../lib/animations/gsap';
import { createLenis } from '../lib/scroll/lenis';
import { createTextReveals } from '../lib/animations/textReveal';
import { createHorizontalScroll } from '../lib/animations/horizontalScroll';
import { createImageReveals } from '../lib/animations/imageReveal';
import { createParallax } from '../lib/animations/parallax';
import { createMagneticHovers } from '../lib/animations/magneticHover';
import { createScrollReveals, createStepsTimeline } from '../lib/animations/scrollReveals';

export function initMotion() {
  if (document.documentElement.dataset.motionReady) return;
  document.documentElement.dataset.motionReady = 'true';

  const header = document.querySelector<HTMLElement>('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  registerMotionPlugins();
  const destroyLenis = createLenis();
  const context = gsap.context(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      gsap.timeline().from(hero.querySelectorAll('.eyebrow,.hero-text,.hero-actions'), { y: 24, autoAlpha: 0, duration: 0.66, stagger: 0.11, delay: 0.08, ease: 'power3.out' }).from(hero.querySelector('.hero-visual'), { y: 38, autoAlpha: 0, scale: 0.94, duration: 0.95, ease: 'power3.out' }, 0.16);
    }

    const cleanups = [
      createTextReveals(),
      createImageReveals(),
      createParallax(),
      createMagneticHovers(),
      createScrollReveals(),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-horizontal-section]')).map(createHorizontalScroll),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-steps-section]')).map(createStepsTimeline),
    ];
    document.querySelectorAll<HTMLElement>('[data-product-scrub] .features-visual').forEach((visual) => {
      gsap.to(visual, { y: -22, rotate: -1.2, ease: 'none', scrollTrigger: { trigger: visual.closest('[data-product-scrub]') ?? visual, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    ScrollTrigger.refresh();
    return () => cleanups.forEach((cleanup) => cleanup());
  }, document.body);

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
  window.addEventListener('pagehide', () => { context.revert(); destroyLenis(); window.removeEventListener('scroll', updateHeader); }, { once: true });
}
