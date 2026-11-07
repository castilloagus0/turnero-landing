import { gsap } from './gsap';
import { motionConfig } from './motionConfig';

export function createScrollReveals(scope: ParentNode = document) {
  const tweens = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]')).map((element) => gsap.from(element, {
    y: 26, autoAlpha: 0, duration: motionConfig.duration.normal, ease: motionConfig.ease.reveal,
    scrollTrigger: { trigger: element, start: 'top 84%', once: true },
  }));
  return () => tweens.forEach((tween) => tween.kill());
}

export function createStepsTimeline(section: HTMLElement) {
  const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-step]'));
  const reveals = steps.map((step) => gsap.from(step.querySelectorAll('.step-number,.step-copy'), { y: 22, autoAlpha: 0, duration: motionConfig.duration.normal, stagger: motionConfig.stagger.fast, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: step, start: 'top 82%', once: true } }));
  return () => reveals.forEach((reveal) => reveal.kill());
}
