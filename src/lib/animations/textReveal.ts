import { gsap, SplitText } from './gsap';
import { motionConfig } from './motionConfig';

export function createTextReveals(scope: ParentNode = document) {
  const cleanups: Array<() => void> = [];

  scope.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    if (window.scrollY > 0 && element.getBoundingClientRect().top <= window.innerHeight * .82) return;
    const split = SplitText.create(element, { type: 'lines', mask: 'lines', aria: 'auto' });
    const isHero = element.closest('[data-hero]');
    const tween = gsap.from(split.lines, {
      yPercent: 105,
      autoAlpha: 0,
      duration: motionConfig.duration.slow,
      stagger: motionConfig.stagger.normal,
      delay: isHero ? 0.2 : 0,
      ease: motionConfig.ease.reveal,
      scrollTrigger: isHero ? undefined : { trigger: element, start: 'top 82%', once: true },
    });

    cleanups.push(() => { tween.kill(); split.revert(); });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
