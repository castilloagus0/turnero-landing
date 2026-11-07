import { gsap } from './gsap';
import { motionConfig } from './motionConfig';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

/** One trigger per element or group; content remains visible when motion is disabled. */
export function createScrollReveals(scope: ParentNode = document) {
  const media = gsap.matchMedia();
  media.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (context) => {
    const mobile = Boolean(context.conditions?.mobile);
    const fromVars = (element: HTMLElement) => {
      const direction = (element.dataset.revealDirection || 'up') as Direction;
      const requested = Number(element.dataset.revealDistance || 52);
      const distance = Number.isFinite(requested) ? Math.max(0, Math.min(requested, 100)) : 52;
      const amount = mobile ? Math.min(distance, 24) : distance;
      const vars: gsap.TweenVars = { autoAlpha: 0 };
      if (direction === 'up') vars.y = amount;
      if (direction === 'down') vars.y = -amount;
      // Keep horizontal entrances inside the layout gutters, including tablet widths.
      if (direction === 'left') mobile ? vars.y = amount : vars.x = -Math.min(amount, 30);
      if (direction === 'right') mobile ? vars.y = amount : vars.x = Math.min(amount, 30);
      if (direction === 'scale') vars.scale = mobile ? .98 : .96;
      return vars;
    };
    const tweens: Array<gsap.core.Tween | gsap.core.Timeline> = [];
    scope.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'));
      if (!items.length) return;
      // A single trigger builds the group, with each direction set by its own item.
      const timeline = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 82%', once: true } });
      const stagger = Math.max(0, Math.min(Number(group.dataset.stagger) || .1, .25));
      items.forEach((item, index) => timeline.from(item, { ...fromVars(item), duration: .75, ease: motionConfig.ease.reveal }, index * stagger));
      tweens.push(timeline);
    });
    scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-item])').forEach((element) => {
      const delay = Math.max(0, Math.min(Number(element.dataset.revealDelay) || 0, .5));
      tweens.push(gsap.from(element, { ...fromVars(element), duration: .8, delay, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: element, start: 'top 82%', once: true } }));
    });
    return () => tweens.forEach((tween) => { tween.scrollTrigger?.kill(); tween.kill(); });
  });
  return () => media.revert();
}

export function createStepsTimeline(section: HTMLElement) {
  const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-step]'));
  const reveals = steps.map((step) => gsap.from(step.querySelectorAll('.step-number,.step-copy'), { y: 22, autoAlpha: 0, duration: motionConfig.duration.normal, stagger: motionConfig.stagger.fast, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: step, start: 'top 82%', once: true } }));
  return () => reveals.forEach((reveal) => reveal.kill());
}
