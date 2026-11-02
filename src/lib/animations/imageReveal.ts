import { gsap } from './gsap';
import { motionConfig } from './motionConfig';

export function createImageReveals(scope: ParentNode = document) {
  const tweens = Array.from(scope.querySelectorAll<HTMLElement>('[data-image-reveal]')).map((element) => {
    const image = element.querySelector<HTMLElement>('img') ?? element;
    return gsap.fromTo(element, { clipPath: 'inset(12% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: motionConfig.duration.slow, ease: motionConfig.ease.reveal,
      scrollTrigger: { trigger: element, start: 'top 82%', once: true },
      onStart: () => gsap.fromTo(image, { scale: 1.1 }, { scale: 1, duration: motionConfig.duration.slow + 0.15, ease: motionConfig.ease.reveal }),
    });
  });
  return () => tweens.forEach((tween) => tween.kill());
}
