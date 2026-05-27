/* ═══════════════════════════════════════════
   MAIN — App Bootstrap
   Lenis smooth scroll + GSAP + modules sync
   ═══════════════════════════════════════════ */

// Force browser scroll restoration behavior to manual as early as possible
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// Reset standard window scroll immediately on execution if no hash exists in URL
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

// Register GSAP ScrollTrigger plugin and clear scroll memory
gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.clearScrollMemory) {
  ScrollTrigger.clearScrollMemory();
}

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

// Bind Lenis to global window object for cross-module controls (e.g. modals)
window.lenis = lenis;

// Connect Lenis to GSAP ScrollTrigger updates
lenis.on('scroll', ScrollTrigger.update);

// Sync GSAP ticker with Lenis requestAnimationFrame
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing to prevent scroll jumping
gsap.ticker.lagSmoothing(0);

// Force scroll to top on load and beforeunload if no hash is present
window.addEventListener('beforeunload', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      // Let layout settle, then scroll directly to target section
      setTimeout(() => {
        lenis.scrollTo(target, { immediate: true });
        ScrollTrigger.refresh();
      }, 100);
      return;
    }
  }

  window.scrollTo(0, 0);
  lenis.scrollTo(0, { immediate: true });
  setTimeout(() => {
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, 50);
});

// Bootstrap all modules in sequential order
initNavigation(lenis);
initComponents();
initAnimations();

console.log(
  '%c Portfolio Rebuilt Successfully ✨',
  'color: #1c86ff; font-size: 14px; font-weight: bold;'
);
