/* ═══════════════════════════════════════════
   NAVIGATION
   Scroll spy, mobile menu, smooth nav, bg
   ═══════════════════════════════════════════ */

function initNavigation(lenisInstance) {
  scrollSpy();
  mobileMenu();
  smoothNav(lenisInstance);
  navBackground();
}

// ── Scroll Spy ──
function scrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    const offset = window.innerHeight * 0.5;

    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init
}

// ── Mobile Menu ──
function mobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');

  if (!burger || !menu) return;

  const mobileLinks = menu.querySelectorAll('.mobile-menu__link');

  const toggle = () => {
    const isOpen = menu.classList.toggle('active');
    burger.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    menu.classList.remove('active');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', toggle);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      close();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      close();
    }
  });
}

// ── Smooth Scroll Nav Links ──
function smoothNav(lenisInstance) {
  const allNavLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

  allNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
        lenisInstance.scrollTo(target, { offset: 0, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── Nav Background on Scroll ──
function navBackground() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
