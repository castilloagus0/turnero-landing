import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../animations/gsap';

export function createLenis() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true, anchors: true });
  const update = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(update);
    lenis.destroy();
  };
}
