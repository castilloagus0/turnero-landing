import { gsap } from './gsap';

export function createParallax(scope: ParentNode = document) {
  const tweens = Array.from(scope.querySelectorAll<HTMLElement>('[data-parallax]')).map((element) => {
    const amount = Number(element.dataset.parallax || 42);
    return gsap.to(element, { y: amount, ease: 'none', scrollTrigger: { trigger: element.parentElement ?? element, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return () => tweens.forEach((tween) => tween.kill());
}
