import { gsap } from './gsap';

export function createMagneticHovers(scope: ParentNode = document) {
  const cleanups: Array<() => void> = [];
  const media = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!media.matches) return () => undefined;

  scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
    const xTo = gsap.quickTo(element, 'x', { duration: 0.38, ease: 'power3.out' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.38, ease: 'power3.out' });
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      xTo(((event.clientX - rect.left) / rect.width - 0.5) * 12);
      yTo(((event.clientY - rect.top) / rect.height - 0.5) * 10);
    };
    const onLeave = () => { xTo(0); yTo(0); };
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    cleanups.push(() => { element.removeEventListener('pointermove', onMove); element.removeEventListener('pointerleave', onLeave); gsap.set(element, { clearProps: 'transform' }); });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
