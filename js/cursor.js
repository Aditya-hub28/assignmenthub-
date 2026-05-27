/* ═══════════════════════════════════════════
   CUSTOM CURSOR
   Centered smooth-follow dot + ring.
   ═══════════════════════════════════════════ */

function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursorEl = document.getElementById('cursor');
  const dot = cursorEl?.querySelector('.cursor__dot');
  const ring = cursorEl?.querySelector('.cursor__ring');

  if (!cursorEl || !dot || !ring) return;

  const cursor = {
    pos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    target: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    ringPos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    visible: false,

  };

  // ── Lerp helper ──
  const lerp = (start, end, factor) => start + (end - start) * factor;

  // ── Mouse Move Tracking ──
  document.addEventListener('mousemove', (e) => {
    cursor.target.x = e.clientX;
    cursor.target.y = e.clientY;

    if (!cursor.visible) {
      cursor.visible = true;
      cursorEl.style.opacity = '1';
      // Snap instantly on initial entrance
      cursor.pos.x = e.clientX;
      cursor.pos.y = e.clientY;
      cursor.ringPos.x = e.clientX;
      cursor.ringPos.y = e.clientY;
    }
  });

  // ── Hover states for interactive elements ──
  const interactiveSelectors = 'a, button, .filter-btn, .project-card__link, .product-btn';
  let activeHoveredEl = null;

  document.addEventListener('mouseenter', (e) => {
    const target = e.target.closest ? e.target.closest(interactiveSelectors) : null;
    if (target) {
      activeHoveredEl = target;
      document.body.classList.add('cursor--hover');
      
      const rect = target.getBoundingClientRect();
      
      // Dynamically read the button's exact computed border radius so the pointer morphs perfectly to its shape!
      const computedStyle = window.getComputedStyle(target);
      const borderRadius = computedStyle.borderRadius;

      // Check if it is a product button to match the deep-red color theme
      const isProductBtn = target.classList.contains('product-btn') || target.closest('.products') !== null;
      const accentColor = isProductBtn ? '#820000' : 'var(--accent-blue)';
      const accentBg = isProductBtn ? 'rgba(130, 0, 0, 0.08)' : 'rgba(28, 134, 255, 0.08)';
      const accentShadow = isProductBtn ? '0 0 16px rgba(130, 0, 0, 0.45)' : '0 0 16px rgba(28, 134, 255, 0.45)';

      gsap.to(ring, {
        width: rect.width + 8,
        height: rect.height + 8,
        borderRadius: borderRadius,
        borderColor: accentColor,
        backgroundColor: accentBg,
        boxShadow: accentShadow,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    const target = e.target.closest ? e.target.closest(interactiveSelectors) : null;
    if (target && activeHoveredEl === target) {
      activeHoveredEl = null;
      document.body.classList.remove('cursor--hover');

      gsap.to(ring, {
        width: 22,
        height: 22,
        borderRadius: '50%',
        borderColor: 'rgba(255, 255, 255, 0.85)',
        backgroundColor: 'transparent',
        boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  }, true);

  // ── Reset cursor state helper ──
  const resetCursorHoverState = () => {
    if (activeHoveredEl) {
      activeHoveredEl = null;
      document.body.classList.remove('cursor--hover');

      gsap.to(ring, {
        width: 22,
        height: 22,
        borderRadius: '50%',
        borderColor: 'rgba(255, 255, 255, 0.85)',
        backgroundColor: 'transparent',
        boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
        duration: 0.25,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  // Reset when clicking any link/button (prevents stuck hover state after click scrolling)
  document.addEventListener('click', (e) => {
    const target = e.target.closest ? e.target.closest(interactiveSelectors) : null;
    if (target) {
      resetCursorHoverState();
    }
  });

  // Reset during any scrolling event (prevents stuck hover states when scroll occurs beneath mouse cursor)
  window.addEventListener('scroll', resetCursorHoverState, { passive: true });

  // ── Hide / show when leaving / entering window ──
  document.addEventListener('mouseleave', () => {
    cursor.visible = false;
    gsap.to(cursorEl, { opacity: 0, duration: 0.3, ease: 'power2.out' });
  });

  document.addEventListener('mouseenter', () => {
    cursor.visible = true;
    gsap.to(cursorEl, { opacity: 1, duration: 0.3, ease: 'power2.out' });
  });

  // ── Click pulse ──
  document.addEventListener('mousedown', () => {
    if (activeHoveredEl) {
      gsap.to(ring, { scale: 0.93, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
    } else {
      gsap.to(ring, { scale: 0.6, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
    }
  });

  document.addEventListener('mouseup', () => {
    gsap.to(ring, { scale: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
  });



  // ── Animation loop ──
  function render() {
    // Dot tracks very quickly
    cursor.pos.x = lerp(cursor.pos.x, cursor.target.x, 0.22);
    cursor.pos.y = lerp(cursor.pos.y, cursor.target.y, 0.22);

    // Ring lags behind smoothly
    const ringLerp = 0.09;
    cursor.ringPos.x = lerp(cursor.ringPos.x, cursor.target.x, ringLerp);
    cursor.ringPos.y = lerp(cursor.ringPos.y, cursor.target.y, ringLerp);

    // Perfect centering translation by appending translate(-50%, -50%)
    if (dot && ring) {
      dot.style.transform = `translate3d(${cursor.pos.x}px, ${cursor.pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${cursor.ringPos.x}px, ${cursor.ringPos.y}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
