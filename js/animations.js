/* ═══════════════════════════════════════════
   CINEMATIC ANIMATIONS (GSAP & ScrollTrigger)
   Hero Character entrance · Parallax Orbs · Marquees
   Scroll Reveals · Pinned Horizontal Testimonials
   ═══════════════════════════════════════════ */

function initAnimations() {
  heroEntranceAnimation();
  revealAnimations();
  parallaxOrbs();
  sectionLabelLines();
}

// ── Hero Cinematic Character Entrance ──
function heroEntranceAnimation() {
  if (typeof gsap === 'undefined') return;

  const badge = document.querySelector('.hero__badge');
  const nameLines = document.querySelectorAll('.hero__name-line');
  const subtitle = document.querySelector('.hero__subtitle');
  const tagline = document.querySelector('.hero__tagline');

  // Dynamic character splitting for staggered fly-in
  nameLines.forEach((line) => {
    const text = line.textContent.trim();
    line.textContent = '';
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.classList.add('char');
      // Use non-breaking space if it's a whitespace character
      span.textContent = char === ' ' ? '\u00A0' : char;
      line.appendChild(span);
    });
  });

  const chars = document.querySelectorAll('.hero__name-line .char');

  // Set initial states
  gsap.set([badge, subtitle, tagline], { opacity: 0, y: 30 });
  gsap.set(chars, { opacity: 0, y: 100, rotateX: -90 });

  // Main Timeline
  const tl = gsap.timeline({
    delay: 0.4,
    defaults: { ease: 'power4.out' }
  });

  if (badge) {
    tl.to(badge, { y: 0, opacity: 1, duration: 1 });
  }

  if (chars.length > 0) {
    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.05,
      transformOrigin: '0% 50% -50'
    }, '-=0.6');
  }

  if (subtitle) {
    tl.to(subtitle, { y: 0, opacity: 1, duration: 0.8 }, '-=0.8');
  }

  if (tagline) {
    tl.to(tagline, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6');
  }
}

// ── Section Reveals ──
function revealAnimations() {
  if (typeof gsap === 'undefined') return;

  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  reveals.forEach((el) => {
    // Set initial hidden state in JS dynamically to avoid CSS clashing
    gsap.set(el, { opacity: 0, y: 30 });

    const staggerChildren = el.querySelectorAll(
      '.stat-card, .service-card, .project-card, .filter-btn, .contact__info-block, .product-card'
    );

    if (staggerChildren.length > 0) {
      // Set children hidden state to prevent instant pops
      gsap.set(staggerChildren, { opacity: 0, y: 30 });

      // Create a coordinated reveal timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .to(staggerChildren, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out'
        }, '-=0.35');
    } else {
      // Single element reveal
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    }
  });
}

// ── Parallax Drifting Orbs on Scroll ──
function parallaxOrbs() {
  if (typeof gsap === 'undefined') return;

  const globalOrbs = document.querySelectorAll('.global-bg__orb');

  globalOrbs.forEach((orb, i) => {
    // Alternate direction for an organic floating effect
    const dir = i % 2 === 0 ? 1 : -1;
    const speed = 10 + i * 8; // gentle parallax offset speed

    gsap.to(orb, {
      y: () => dir * speed * window.innerHeight * 0.08,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });
  });
}


// ── Section Label Lines Growing ──
function sectionLabelLines() {
  if (typeof gsap === 'undefined') return;

  const lines = document.querySelectorAll('.section-label__line');
  lines.forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: line,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });
}

