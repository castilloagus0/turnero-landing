import { gsap, ScrollTrigger, registerMotionPlugins } from '../lib/animations/gsap';
import { createLenis } from '../lib/scroll/lenis';

export function initMotion() {
  if (document.documentElement.dataset.motionReady) return;
  document.documentElement.dataset.motionReady = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideo = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  if (reducedMotion && heroVideo) {
    heroVideo.autoplay = false;
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    heroVideo.hidden = true;
  }
  const header = document.querySelector<HTMLElement>('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const overlay = document.querySelector<HTMLElement>('[data-menu-overlay]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const close = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const menuLinks = Array.from(menu?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
  let menuOpen = false;

  registerMotionPlugins();
  const openMenu = () => {
    if (!menu || !overlay || !toggle || menuOpen) return;
    menuOpen = true;
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    gsap.timeline()
      .to(overlay, { autoAlpha: 1, duration: reducedMotion ? 0 : .2 })
      .to(menu, { x: '0%', duration: reducedMotion ? 0 : .48, ease: 'power4.out' }, 0)
      .fromTo(menuLinks, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: reducedMotion ? 0 : .32, stagger: reducedMotion ? 0 : .06, ease: 'power3.out' }, reducedMotion ? 0 : .13);
  };
  const closeMenu = () => {
    if (!menu || !overlay || !toggle || !menuOpen) return;
    menuOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    gsap.timeline({
      onComplete: () => {
        menu.classList.remove('is-open');
        overlay.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
      },
    })
      .to(menu, { x: '105%', duration: reducedMotion ? 0 : .3, ease: 'power3.in' })
      .to(overlay, { autoAlpha: 0, duration: reducedMotion ? 0 : .18 }, 0);
  };

  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

  if (reducedMotion) return;

  const destroyLenis = createLenis();
  const context = gsap.context(() => {
    const ecosystem = document.querySelector<HTMLElement>('[data-ecosystem]');
    if (ecosystem) {
      gsap.from(ecosystem.querySelector('h2'), {
        y: 48,
        autoAlpha: 0,
        duration: .85,
        ease: 'power3.out',
        scrollTrigger: { trigger: ecosystem, start: 'top 70%' },
      });
      gsap.from(ecosystem.querySelector('.ecosystem-copy'), {
        y: 24,
        autoAlpha: 0,
        duration: .65,
        delay: .12,
        scrollTrigger: { trigger: ecosystem, start: 'top 70%' },
      });
      gsap.to(ecosystem.querySelector('[data-eco-particles]'), {
        y: -115,
        ease: 'none',
        scrollTrigger: { trigger: ecosystem, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to(ecosystem.querySelector('[data-eco-grid]'), {
        y: -64,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: ecosystem, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to(ecosystem.querySelector('[data-eco-glow]'), {
        y: -90,
        x: -70,
        ease: 'none',
        scrollTrigger: { trigger: ecosystem, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.from(ecosystem.querySelectorAll('.floating-card'), {
        y: 38,
        autoAlpha: 0,
        stagger: .15,
        duration: .65,
        ease: 'power3.out',
        scrollTrigger: { trigger: ecosystem, start: 'top 52%' },
      });
    }

    const product = document.querySelector<HTMLElement>('[data-product-section]');
    if (product) {
      gsap.from(product.querySelectorAll('.product-head,.product-points article,.closing-line'), {
        y: 32,
        autoAlpha: 0,
        duration: .55,
        stagger: .08,
        ease: 'power3.out',
        scrollTrigger: { trigger: product, start: 'top 72%' },
      });
    }

    gsap.utils.toArray<HTMLElement>('[data-social-proof], [data-experience], [data-demo-contact]').forEach((section) => {
      gsap.from(section.querySelectorAll('[data-reveal-item]'), {
        y: 34,
        autoAlpha: 0,
        duration: .65,
        stagger: .12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 76%' },
      });
    });

    ScrollTrigger.refresh();
  }, document.body);

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
  window.addEventListener('pagehide', () => {
    context.revert();
    destroyLenis();
    window.removeEventListener('scroll', updateHeader);
    toggle?.removeEventListener('click', openMenu);
    close?.removeEventListener('click', closeMenu);
    overlay?.removeEventListener('click', closeMenu);
    menuLinks.forEach((link) => link.removeEventListener('click', closeMenu));
  }, { once: true });
}
