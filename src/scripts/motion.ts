import { gsap, ScrollTrigger, registerMotionPlugins } from '../lib/animations/gsap';
import { createLenis } from '../lib/scroll/lenis';
import { createTextReveals } from '../lib/animations/textReveal';
import { createHorizontalScroll } from '../lib/animations/horizontalScroll';
import { createImageReveals } from '../lib/animations/imageReveal';
import { createParallax } from '../lib/animations/parallax';
import { createMagneticHovers } from '../lib/animations/magneticHover';
import { createScrollReveals, createStepsTimeline } from '../lib/animations/scrollReveals';

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
  const desktop = window.matchMedia('(min-width: 781px)');
  let menuOpen = false;
  let menuAnimation: gsap.core.Timeline | undefined;

  registerMotionPlugins();
  const openMenu = () => {
    if (!menu || !overlay || !toggle || menuOpen) return;
    menuOpen = true;
    menuAnimation?.kill();
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    document.documentElement.classList.add('mobile-menu-open');
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    close?.focus({ preventScroll: true });
    menuAnimation = gsap.timeline()
      .to(overlay, { autoAlpha: 1, duration: reducedMotion ? 0 : .2 })
      .to(menu, { x: '0%', duration: reducedMotion ? 0 : .48, ease: 'power4.out' }, 0)
      .fromTo(menuLinks, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: reducedMotion ? 0 : .32, stagger: reducedMotion ? 0 : .06, ease: 'power3.out' }, reducedMotion ? 0 : .13);
  };
  const closeMenu = (restoreFocus = true, immediate = false) => {
    if (!menu || !overlay || !toggle || !menuOpen) return;
    menuOpen = false;
    menuAnimation?.kill();
    if (restoreFocus) toggle.focus({ preventScroll: true });
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.documentElement.classList.remove('mobile-menu-open');
    menuAnimation = gsap.timeline({
      onComplete: () => {
        menu.classList.remove('is-open');
        overlay.classList.remove('is-open');
      },
    })
      .to(menu, { x: '105%', duration: reducedMotion || immediate ? 0 : .3, ease: 'power3.in' })
      .to(overlay, { autoAlpha: 0, duration: reducedMotion || immediate ? 0 : .18 }, 0);
  };

  const handleClose = () => closeMenu();
  const handleDesktop = () => { if (desktop.matches) closeMenu(false, true); };
  const handleKeydown = (event: KeyboardEvent) => {
    if (!menuOpen || !menu) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };
  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', handleClose);
  overlay?.addEventListener('click', handleClose);
  menuLinks.forEach((link) => link.addEventListener('click', handleClose));
  document.addEventListener('keydown', handleKeydown);
  desktop.addEventListener('change', handleDesktop);

  const cleanupNavigation = () => {
    closeMenu(false, true);
    menuAnimation?.kill();
    window.removeEventListener('scroll', updateHeader);
    toggle?.removeEventListener('click', openMenu);
    close?.removeEventListener('click', handleClose);
    overlay?.removeEventListener('click', handleClose);
    menuLinks.forEach((link) => link.removeEventListener('click', handleClose));
    document.removeEventListener('keydown', handleKeydown);
    desktop.removeEventListener('change', handleDesktop);
  };

  if (reducedMotion) {
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) cleanupNavigation();
    });
    return;
  }

  // Touch devices retain their native scrolling and avoid a continuous RAF loop.
  const destroyLenis = window.matchMedia('(pointer: coarse)').matches ? () => {} : createLenis();
  let mainCleanups: Array<() => void> = [];
  const context = gsap.context(() => {
    mainCleanups = [
      createTextReveals(),
      createImageReveals(),
      createParallax(),
      createMagneticHovers(),
      createScrollReveals(),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-horizontal-section]')).map(createHorizontalScroll),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-steps-section]')).map(createStepsTimeline),
    ];
    const hero = document.querySelector<HTMLElement>('[data-hero-content]');
    if (hero) {
      // One restrained introduction; the hero is already in view and needs no ScrollTrigger.
      gsap.from(hero.querySelectorAll('.hero-kicker, h1, .hero-description, .hero-actions'), {
        y: 18, autoAlpha: 0, duration: .8, stagger: .1, ease: 'power3.out',
      });
    }

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
      const ecoMedia = gsap.matchMedia();
      ecoMedia.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (media) => {
        const mobile = Boolean(media.conditions?.mobile);
        gsap.to(ecosystem.querySelector('[data-eco-particles]'), {
          y: mobile ? -30 : -85,
          ease: 'none',
          scrollTrigger: { trigger: ecosystem, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
      mainCleanups.push(() => ecoMedia.revert());
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
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return;
    mainCleanups.forEach((cleanup) => cleanup());
    context.revert();
    destroyLenis();
    cleanupNavigation();
  });
}
