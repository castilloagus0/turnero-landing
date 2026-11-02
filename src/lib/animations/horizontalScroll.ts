import { gsap, ScrollTrigger } from './gsap';
import { motionConfig } from './motionConfig';

export function createHorizontalScroll(section: HTMLElement) {
  const viewport = section.querySelector<HTMLElement>('[data-horizontal-viewport]');
  const track = section.querySelector<HTMLElement>('[data-horizontal-track]');
  const current = section.querySelector<HTMLElement>('[data-horizontal-current]');
  const progress = section.querySelector<HTMLElement>('[data-horizontal-progress]');
  if (!viewport || !track) return () => undefined;

  const media = gsap.matchMedia();
  const updateProgress = (value: number, panels: HTMLElement[]) => {
    const index = Math.min(panels.length - 1, Math.floor(value * panels.length));
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    if (progress) progress.style.transform = `scaleX(${value})`;
  };

  media.add(`(min-width: ${motionConfig.breakpoints.desktop}px)`, () => {
    const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-horizontal-panel]'));
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (!panels.length || distance() <= 0) return undefined;

    gsap.set(track, { x: 0 });
    updateProgress(0, panels);

    const movement = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateProgress(self.progress, panels),
      },
    });

    const panelTweens = panels.flatMap((panel) => {
      const inner = panel.querySelector<HTMLElement>('.industry-panel__inner');
      const visual = panel.querySelector<HTMLElement>('.industry-panel__visual');
      const tweens = [];
      if (inner) tweens.push(gsap.from(inner, { opacity: 0.45, y: 30, duration: 0.7, ease: motionConfig.ease.reveal, scrollTrigger: { trigger: panel, containerAnimation: movement, start: 'left 78%', toggleActions: 'play none none reverse' } }));
      if (visual) tweens.push(gsap.to(visual, { scale: 1.05, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: movement, start: 'left right', end: 'right left', scrub: true } }));
      return tweens;
    });

    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      panelTweens.forEach((tween) => tween.kill());
      movement.scrollTrigger?.kill();
      movement.kill();
      gsap.set(track, { clearProps: 'transform' });
      updateProgress(0, panels);
    };
  });

  return () => media.revert();
}
