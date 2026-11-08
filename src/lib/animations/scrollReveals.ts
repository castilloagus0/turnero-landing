import { gsap } from './gsap';
import { motionConfig } from './motionConfig';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

/** One trigger per element or group; content remains visible when motion is disabled. */
export function createScrollReveals(scope: ParentNode = document) {
  const mobile = window.matchMedia('(max-width: 767px)');
  const fromVars = (element: HTMLElement) => {
    const direction = (element.dataset.revealDirection || 'up') as Direction;
    const requested = Number(element.dataset.revealDistance || 52);
    const distance = Number.isFinite(requested) ? Math.max(0, Math.min(requested, 100)) : 52;
    const vars: gsap.TweenVars = { autoAlpha: 0 };
    if (direction === 'up') vars.y = () => mobile.matches ? Math.min(distance, 24) : distance;
    if (direction === 'down') vars.y = () => mobile.matches ? -Math.min(distance, 24) : -distance;
    // Keep horizontal entrances inside the layout gutters, including tablet widths.
    if (direction === 'left' || direction === 'right') {
      vars.x = () => mobile.matches ? 0 : Math.min(distance, 30) * (direction === 'left' ? -1 : 1);
      vars.y = () => mobile.matches ? Math.min(distance, 24) : 0;
    }
    if (direction === 'scale') vars.scale = () => mobile.matches ? .98 : .96;
    return vars;
  };
  const tweens: Array<gsap.core.Tween | gsap.core.Timeline> = [];
  scope.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    // Restored scroll positions should show earlier content immediately rather
    // than creating already-completed one-shot triggers during initialization.
    if (window.scrollY > 0 && group.getBoundingClientRect().top <= window.innerHeight * .82) return;
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'));
    if (!items.length) return;
    // A single trigger builds the group, with each direction set by its own item.
    const timeline = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 82%', once: true, invalidateOnRefresh: true } });
    const stagger = Math.max(0, Math.min(Number(group.dataset.stagger) || .1, .25));
    items.forEach((item, index) => timeline.from(item, { ...fromVars(item), duration: .75, ease: motionConfig.ease.reveal }, index * stagger));
    tweens.push(timeline);
  });
  scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-item])').forEach((element) => {
    if (window.scrollY > 0 && element.getBoundingClientRect().top <= window.innerHeight * .82) return;
    const delay = Math.max(0, Math.min(Number(element.dataset.revealDelay) || 0, .5));
    tweens.push(gsap.from(element, { ...fromVars(element), duration: .8, delay, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: element, start: 'top 82%', once: true, invalidateOnRefresh: true } }));
  });
  return () => {
    tweens.forEach((tween) => { tween.scrollTrigger?.kill(); tween.kill(); });
  };
}

export function createStepsTimeline(section: HTMLElement) {
  const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-step]')).filter((step) => window.scrollY === 0 || step.getBoundingClientRect().top > window.innerHeight * .82);
  const reveals = steps.map((step) => gsap.from(step.querySelectorAll('.step-number,.step-copy'), { y: 22, autoAlpha: 0, duration: motionConfig.duration.normal, stagger: motionConfig.stagger.fast, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: step, start: 'top 82%', once: true } }));
  return () => reveals.forEach((reveal) => reveal.kill());
}
