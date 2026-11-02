import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

export function registerMotionPlugins() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
    registered = true;
  }
}

export { gsap, ScrollTrigger, SplitText, Flip };
