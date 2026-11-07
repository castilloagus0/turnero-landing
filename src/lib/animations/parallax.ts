import { gsap } from './gsap';

/** Decorative parallax is limited to wider, fine-pointer layouts. */
export function createParallax(scope: ParentNode = document) {
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (pointer: fine)', () => {
    const tweens = Array.from(scope.querySelectorAll<HTMLElement>('[data-parallax]')).map((element) => {
      const requested = Number(element.dataset.parallax || 42);
      const amount = Number.isFinite(requested) ? Math.max(-100, Math.min(100, requested)) : 42;
      return gsap.to(element, { y: amount, ease: 'none', scrollTrigger: { trigger: element.parentElement ?? element, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    return () => tweens.forEach((tween) => { tween.scrollTrigger?.kill(); tween.kill(); });
  });
  return () => media.revert();
}
