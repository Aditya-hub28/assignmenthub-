/* ═══════════════════════════════════════════
   INTERACTIVE COMPONENTS
   Counters · Bento Grid Glow/Tilt · Filters
   Project Detail Modal · Form Success Feedback
   ═══════════════════════════════════════════ */

function initComponents() {
  counterAnimation();
  projectCarouselNavigation();
  testimonialCarousel();
  cardTilt();
  typewriter();
  formInteraction();
  projectModalInit();
  testimonialCarouselNavigation();
  callbackModalInit();
}

// ── Stats Counter ──
function counterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || typeof gsap === 'undefined') return;

  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        el.textContent = Math.round(obj.val);
      },
    });
  });
}

// ── Project Carousel & Filter system ──
function projectCarouselNavigation() {
  const stack     = document.getElementById('projectStack');
  const prevBtn   = document.getElementById('projectPrev');
  const nextBtn   = document.getElementById('projectNext');
  const currentEl = document.getElementById('projectCurrent');
  const totalEl   = document.getElementById('projectTotal');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!stack || !prevBtn || !nextBtn) return;

  let current = 0;
  let activeCards = Array.from(stack.querySelectorAll('.project-card'));

  function getCardsPerView() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function updateCarousel() {
    const total = activeCards.length;
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, total - cardsPerView);

    // Keep current index in safe boundary bounds
    current = Math.min(current, maxIndex);

    if (totalEl) totalEl.textContent = total;
    if (currentEl) currentEl.textContent = total > 0 ? current + 1 : 0;

    // Reset all cards styling
    const allCards = Array.from(stack.querySelectorAll('.project-card'));
    allCards.forEach((card) => {
      card.classList.remove('active');
      card.style.pointerEvents = 'none';
    });

    // Make visible viewport cards active and interactive
    activeCards.forEach((card, i) => {
      const isVisible = i >= current && i < current + cardsPerView;
      if (isVisible) {
        card.classList.add('active');
        card.style.pointerEvents = 'auto';
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
      } else {
        gsap.to(card, { opacity: 0.25, scale: 0.97, duration: 0.5, ease: 'power3.out' });
      }
    });

    // Translate the stack horizontally based on viewport view settings
    const gap = 1.5; // Gap in rem
    const isMobile = window.innerWidth <= 768;
    const translatePct = isMobile ? 100 : 50;
    const translateGap = isMobile ? gap : (gap / 2);

    stack.style.transform = `translateX(calc(-${current} * (${translatePct}% + ${translateGap}rem)))`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex || total === 0;
  }

  function applyFilter(filter) {
    const allCards = Array.from(stack.querySelectorAll('.project-card'));
    
    // Animate all cards out first or change display dynamically
    allCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.removeAttribute('data-hidden');
        card.style.display = 'block';
      } else {
        card.setAttribute('data-hidden', '');
        card.style.display = 'none';
      }
    });

    // Re-collect active cards
    activeCards = allCards.filter(card => !card.hasAttribute('data-hidden'));
    current = 0; // reset to first card of filtered list
    
    updateCarousel();
  }

  // Bind navigation buttons
  nextBtn.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, activeCards.length - cardsPerView);
    if (current >= maxIndex) return;
    current++;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    if (current <= 0) return;
    current--;
    updateCarousel();
  });

  // Bind filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      applyFilter(btn.dataset.filter);
    });
  });

  // Window resize handler to maintain exact boundary coordinates
  window.addEventListener('resize', () => {
    updateCarousel();
  });

  // Init
  applyFilter('all');
}

// ── Testimonial Carousel ──
function testimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const progressBar = document.getElementById('testimonialProgress');

  if (!track) return;

  // Let the browser handle standard scroll overlay/wheel scroll smoothly,
  // while we sync the progress bar based on horizontal position.
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  // Sync scroll progress bar
  function updateProgress() {
    if (!progressBar) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Basic drag scroll functionality
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    track.classList.add('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    track.scrollLeft = scrollStart - walk;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      track.classList.remove('dragging');
    }
  });

  // Touch support is native with momentum, which is beautiful under Lenis
}

// ── Bento Card 3D Tilt & Center Glow ──
function cardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  // Hover play on card videos
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const video = card.querySelector('.project-card__video');
    if (video) {
      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });

  cards.forEach((card) => {
    const glow = card.querySelector('.service-card__glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate perspective tilts (limit to 10 deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.15s cubic-bezier(0.1, 1, 0.3, 1)';

      if (glow) {
        // Since CSS uses translate(-50%, -50%), this centers the glow perfectly on the cursor!
        glow.style.opacity = '1';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });
}

// ── Typewriter Effect ──
function typewriter() {
  const el = document.getElementById('heroTyper');
  if (!el) return;

  const strings = [
    'innovative water purification systems',
    'industrial reverse osmosis plants',
    'sustainable wastewater management',
    'next-generation fluid engineering'
  ];

  let stringIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const TYPING_SPEED = 70;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_TYPE = 2500;
  const PAUSE_AFTER_DELETE = 450;

  function tick() {
    const current = strings[stringIdx];

    if (!isDeleting) {
      charIdx++;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === current.length) {
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      charIdx--;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        stringIdx = (stringIdx + 1) % strings.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  // Delay starting to let the entrance animation finish
  setTimeout(tick, 2200);
}

// ── Form Interaction ──
function formInteraction() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const btnText = btn.querySelector('.btn__text');
    const btnIcon = btn.querySelector('.btn__icon');
    const originalText = btnText ? btnText.textContent : 'Send Message';
    const originalIcon = btnIcon ? btnIcon.textContent : '→';

    // Success state feedback
    btn.disabled = true;
    btn.classList.add('btn--success');
    if (btnText) btnText.textContent = 'Sent Successfully! ✓';
    if (btnIcon) btnIcon.textContent = '✓';

    // Reset after 3 seconds
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove('btn--success');
      if (btnText) btnText.textContent = originalText;
      if (btnIcon) btnIcon.textContent = originalIcon;
      form.reset();
    }, 3500);
  });
}

// ── Project Modal Detail System ──
const projectsData = {
  "1": {
    title: "Metro RO Treatment Plant",
    category: "Water Engineering",
    desc: "A multi-million liter municipal reverse osmosis facility supplying ultra-pure drinking water to regional residential grids. Features multi-stage filtration chambers, automated chemical dosing grids, and continuous high-pressure membrane arrays built for high capacity.",
    tags: ["Reverse Osmosis", "Municipal Supply", "Ultrafiltration", "RO Arrays", "Automation"],
    video: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054273b98f90a1bdf5b35c0&profile_id=139&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  },
  "2": {
    title: "AquaRecycle ZLD Facility",
    category: "Wastewater Loop",
    desc: "An eco-friendly wastewater recycling plant engineered for a leading manufacturing hub to achieve complete zero liquid discharge (ZLD). Employs high-efficiency vacuum evaporators, biological reactors, and automated salinity tracking to safely recycle 100% of factory discharge.",
    tags: ["Wastewater", "Zero Discharge", "Biological Reactors", "Eco-Responsible"],
    video: "https://player.vimeo.com/external/477028775.sd.mp4?s=d3bc7e0545f470559eb412678602b9e2&profile_id=164&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  },
  "3": {
    title: "DeepSea Desalination Grid",
    category: "Desalination",
    desc: "State-of-the-art seawater desalination plant providing high-purity water to coastal municipal regions. Built using robust anti-corrosive titanium piping systems, automated energy recovery devices (ERDs), and clean sand filtration grids for continuous duty cycles.",
    tags: ["Desalination", "Seawater Intake", "Corrosion Resistant", "Energy Recovery"],
    video: "https://player.vimeo.com/external/409228945.sd.mp4?s=b3f946ed712613d7890ec1b4b20465a3&profile_id=164&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  },
  "4": {
    title: "IoT HydroMonitor System",
    category: "Smart Telemetry",
    desc: "Real-time water quality tracking dashboard integrated with cellular smart sensors across 50+ distribution channels. Features continuous pH tracking, turbidity metrics, flow rates, and automated SMS alerts to keep operators fully informed of grid status.",
    tags: ["Smart Grid", "IoT Sensors", "Real-Time Telemetry", "Automated Alerts"],
    video: "https://player.vimeo.com/external/517602284.sd.mp4?s=bf78f44ff57d425c2763af4b360dfab4&profile_id=164&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  },
  "5": {
    title: "Industrial Cooling Loop",
    category: "Heavy Filtration",
    desc: "High-pressure cooling loop and chemical purification system built for a massive petrochemical plant. Architected with dual-compartment carbon filters, automated backwashing triggers, and variable-frequency drives to reduce power overhead by 30%.",
    tags: ["Heavy Industry", "Filtration Grid", "High Pressure", "VFD Drives"],
    video: "https://player.vimeo.com/external/538569542.sd.mp4?s=db527d2c3dfb83b6fbf285f5e27a7c13&profile_id=164&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  },
  "6": {
    title: "HydroScaffold Pipelines",
    category: "Fluid Dynamics",
    desc: "Advanced municipal water distribution pipelines scaffolded across rugged mountain terrain for high-elevation supply. Features custom booster pump grids, air-release valves, and surge protection tanks to completely eliminate pressure drops.",
    tags: ["Piping Grid", "Booster Pumps", "Surge Tanks", "Municipal"],
    video: "https://player.vimeo.com/external/459389137.sd.mp4?s=88fb6647242a1705ccbd4e877e849889&profile_id=164&oauth2_token_id=57447761",
    live: "#",
    source: "#"
  }
};

function projectModalInit() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');
  
  if (!modal || !closeBtn || !backdrop) return;

  const triggerButtons = document.querySelectorAll('[data-open-modal]');
  
  // Modal DOM fields
  const mVideo = document.getElementById('modalVideo');
  const mCategory = document.getElementById('modalCategory');
  const mTitle = document.getElementById('modalTitle');
  const mDesc = document.getElementById('modalDesc');
  const mTags = document.getElementById('modalTags');
  const mLiveLink = document.getElementById('modalLiveLink');
  const mSourceLink = document.getElementById('modalSourceLink');

  const openModal = (id) => {
    const data = projectsData[id];
    if (!data) return;

    // Populate contents
    if (mCategory) mCategory.textContent = data.category;
    if (mTitle) mTitle.textContent = data.title;
    if (mDesc) mDesc.textContent = data.desc;
    
    // Video
    if (mVideo) {
      mVideo.src = data.video;
      mVideo.load();
      mVideo.play().catch(() => {});
    }

    // Populate tags
    if (mTags) {
      mTags.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        mTags.appendChild(span);
      });
    }

    // Setup links
    if (mLiveLink) mLiveLink.href = data.live;
    if (mSourceLink) {
      mSourceLink.href = data.source;
      mSourceLink.style.display = data.source === '#' ? 'none' : 'inline-block';
    }

    // Show modal and disable scrolling
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop(); // Stop Lenis scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start(); // Restart Lenis scroll
    
    // Pause and clear video after visual transitions finish
    setTimeout(() => {
      if (mVideo) {
        mVideo.pause();
        mVideo.src = '';
      }
    }, 500);
  };

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project-id');
      openModal(id);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Esc key closure
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ── Testimonials Horizontal Slider ──
function testimonialCarouselNavigation() {
  const stack     = document.getElementById('testimonialStack');
  const prevBtn   = document.getElementById('testimonialPrev');
  const nextBtn   = document.getElementById('testimonialNext');
  const currentEl = document.getElementById('testimonialCurrent');
  const totalEl   = document.getElementById('testimonialTotal');

  if (!stack || !prevBtn || !nextBtn) return;

  const cards = Array.from(stack.querySelectorAll('.testimonial-card'));
  const total = cards.length;
  if (!total) return;

  let current = 0;
  if (totalEl) totalEl.textContent = total;

  function setPositions() {
    cards.forEach((card, i) => {
      if (i === current) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Translate the track horizontally by the card width + gap (1.5rem)
    stack.style.transform = `translateX(calc(-${current} * (100% + 1.5rem)))`;

    if (currentEl) currentEl.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function goNext() {
    if (current >= total - 1) return;
    current++;
    setPositions();
    stopAutoplay();
  }

  function goPrev() {
    if (current <= 0) return;
    current--;
    setPositions();
    stopAutoplay();
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);

  // Autoplay — wraps around
  let autoplayTimer;
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (current < total - 1) {
        current++;
      } else {
        current = 0;
      }
      setPositions();
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  setPositions();
  startAutoplay();
}

// ── Callback Modal Detail System ──
function callbackModalInit() {
  const modal = document.getElementById('callbackModal');
  const openBtn = document.getElementById('btnCallback');
  const closeBtn = document.getElementById('callbackModalClose');
  const backdrop = document.getElementById('callbackModalBackdrop');
  const form = document.getElementById('callbackForm');

  if (!modal || !openBtn || !closeBtn || !backdrop) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop(); // Stop Lenis scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start(); // Restart Lenis scroll
  };

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Esc key closure
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const btnText = btn.querySelector('.btn__text');
      const btnIcon = btn.querySelector('.btn__icon');
      const originalText = btnText ? btnText.textContent : 'Request Callback';
      const originalIcon = btnIcon ? btnIcon.innerHTML : '';

      // Success state feedback
      btn.disabled = true;
      btn.classList.add('btn--success');
      if (btnText) btnText.textContent = 'Sending...';

      // ── EmailJS Integration ──
      // Define your EmailJS Service & Template IDs here
      const serviceID = "YOUR_SERVICE_ID";
      const templateID = "YOUR_TEMPLATE_ID";

      if (typeof emailjs !== 'undefined' && serviceID !== "YOUR_SERVICE_ID" && templateID !== "YOUR_TEMPLATE_ID") {
        emailjs.sendForm(serviceID, templateID, form)
          .then(() => {
            console.log("EmailJS: Callback request sent successfully!");
            if (btnText) btnText.textContent = 'Request Sent ✓';
            if (btnIcon) btnIcon.textContent = '✓';
            
            // Reset and close after a short delay
            setTimeout(() => {
              btn.disabled = false;
              btn.classList.remove('btn--success');
              if (btnText) btnText.textContent = originalText;
              if (btnIcon) btnIcon.innerHTML = originalIcon;
              form.reset();
              closeModal();
            }, 2000);
          }, (error) => {
            console.error("EmailJS Error:", error);
            if (btnText) btnText.textContent = 'Error! ✗';
            setTimeout(() => {
              btn.disabled = false;
              btn.classList.remove('btn--success');
              if (btnText) btnText.textContent = originalText;
              form.reset();
            }, 3000);
          });
      } else {
        // Fallback for demonstration/mock mode
        console.warn("EmailJS is not configured yet. Running in demo mock mode.");
        if (btnText) btnText.textContent = 'Request Sent ✓';
        if (btnIcon) btnIcon.textContent = '✓';
        
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('btn--success');
          if (btnText) btnText.textContent = originalText;
          if (btnIcon) btnIcon.innerHTML = originalIcon;
          form.reset();
          closeModal();
        }, 2000);
      }
    });
  }
}

