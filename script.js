/* ===== NAVBAR SCROLL (HIDE ON DOWN, SHOW ON UP) ===== */
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Toggle background blur and shadow when scrolled
  navbar.classList.toggle('scrolled', currentScrollY > 40);

  // Hide navbar when scrolling down past 80px, show when scrolling up
  if (currentScrollY > 80 && currentScrollY > lastScrollY) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/* ===== REVEAL ON SCROLL ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ===== SHOWCASE STICKY CARDS (Orbix Studio Style) ===== */
function initShowcaseCards() {
  const cards = document.querySelectorAll('.showcase-card');
  if (!cards.length) return;

  // Set z-index so later cards stack on top of earlier ones
  cards.forEach((card, i) => {
    card.style.zIndex = i + 1;
  });

  const STICKY_TOP = 84; // matches CSS top: 84px (navbar height)

  function onScroll() {
    const vh = window.innerHeight;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();

      // --- Parallax: mockup image slides up, bg text slides right ---
      if (rect.top < vh && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
        const img = card.querySelector('.sc-mockup-frame img, .sc-mockup img');
        if (img) img.style.transform = `translateY(${(1 - progress) * 30}px)`;
        const bgText = card.querySelector('.sc-bg-text');
        if (bgText) bgText.style.transform = `translateX(${(1 - progress) * 40}px)`;
      }

      // --- Stacking scale/dim effect ---
      // A card is "stuck" when its top <= sticky offset
      const isSticky = rect.top <= STICKY_TOP + 2;

      if (isSticky) {
        // Count how many later cards are visible in the viewport (overlapping this one)
        let overlap = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const nextRect = cards[j].getBoundingClientRect();
          if (nextRect.top < vh) overlap++;
        }
        // Progressive scale-down and brightness dimming per overlap level
        const scaleVal = Math.max(0.88, 1 - overlap * 0.04);
        const brightnessVal = Math.max(0.65, 1 - overlap * 0.12);
        card.style.transform = `scale(${scaleVal})`;
        card.style.filter = overlap > 0 ? `brightness(${brightnessVal})` : '';
        card.classList.toggle('is-stacked', overlap > 0);
      } else {
        card.style.transform = '';
        card.style.filter = '';
        card.classList.remove('is-stacked');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}
initShowcaseCards();

/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent;
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

/* ===== SMOOTH ANCHOR SCROLL & LOGO SCROLL TO TOP ===== */
document.querySelectorAll('.nav-logo, a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#' || link.classList.contains('nav-logo') || id === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      navLinks?.classList.remove('open');
      hamburger?.classList.remove('open');
      return;
    }
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const nav = document.getElementById('navbar');
    const navHeight = nav ? nav.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('open');
  });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Sent!';
    btn.style.background = '#22c55e';
    btn.style.borderColor = '#22c55e';
    form.reset();
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});

/* ===== HERO PARALLAX ORBS ===== */
document.addEventListener('mousemove', e => {
  const orbs = document.querySelectorAll('.hero-orb');
  const { innerWidth: w, innerHeight: h } = window;
  const dx = (e.clientX / w - 0.5);
  const dy = (e.clientY / h - 0.5);
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 15;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

/* ===== CASE STUDY CARD STAGGER ===== */
const csCards = document.querySelectorAll('.cs-card');
const csObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(csCards).indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 100}ms`;
      entry.target.classList.add('visible');
      csObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
csCards.forEach(c => csObs.observe(c));

/* ===== STYLISH CUSTOM CURSOR ENGINE & MAGNETIC CTA ===== */
function initStylishCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // 1. Ambient background cursor glow
  const glow = document.createElement('div');
  glow.className = 'custom-cursor-glow';
  glow.style.position = 'fixed';
  glow.style.pointerEvents = 'none';
  glow.style.zIndex = '9997';
  glow.style.width = '420px';
  glow.style.height = '420px';
  glow.style.borderRadius = '50%';
  glow.style.background = 'radial-gradient(circle, rgba(74,127,212,0.07) 0%, rgba(123,94,167,0.03) 45%, transparent 70%)';
  glow.style.transform = 'translate3d(-50%, -50%, 0)';
  glow.style.transition = 'opacity 0.4s ease';
  document.body.appendChild(glow);

  // 2. Precision central cursor dot
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot custom-cursor-off';
  document.body.appendChild(cursorDot);

  // 3. Trailing cursor glass ring
  const cursorRing = document.createElement('div');
  cursorRing.className = 'custom-cursor-ring custom-cursor-off';
  document.body.appendChild(cursorRing);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let glowX = -100, glowY = -100;
  let isInitialized = false;

  // Helper: detect dark background under element for adaptive cursor contrast
  function checkIsDark(el) {
    if (!el) return false;
    if (el.closest('footer, .footer, .ac-footer, .section-dark, .showcase-section, .marquee-dark, .awards-section, .showcase-card, .btn-primary, .nav-cta, .label-tag:not(.light)')) {
      return true;
    }
    let curr = el;
    while (curr && curr !== document.body && curr !== document.documentElement) {
      const bg = window.getComputedStyle(curr).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0], 10);
          const g = parseInt(rgb[1], 10);
          const b = parseInt(rgb[2], 10);
          const alpha = rgb.length >= 4 ? parseFloat(rgb[3]) : 1;
          if (alpha > 0.4) {
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128;
          }
        }
      }
      curr = curr.parentElement;
    }
    return false;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isInitialized) {
      ringX = glowX = mouseX;
      ringY = glowY = mouseY;
      isInitialized = true;
      cursorDot.classList.remove('custom-cursor-off');
      cursorRing.classList.remove('custom-cursor-off');
      glow.style.opacity = '1';
    }

    // Instant update for dot (zero lag)
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    // Detect dark backgrounds for adaptive contrast
    const elUnder = document.elementFromPoint(mouseX, mouseY);
    if (elUnder) {
      const isDark = checkIsDark(elUnder);
      cursorDot.classList.toggle('is-dark', isDark);
      cursorRing.classList.toggle('is-dark', isDark);
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (isInitialized && mouseX !== -100) {
      const elUnder = document.elementFromPoint(mouseX, mouseY);
      if (elUnder) {
        const isDark = checkIsDark(elUnder);
        cursorDot.classList.toggle('is-dark', isDark);
        cursorRing.classList.toggle('is-dark', isDark);
      }
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursorDot.classList.add('custom-cursor-off');
    cursorRing.classList.add('custom-cursor-off');
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', (e) => {
    if (e.clientX && e.clientY) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ringX = mouseX;
      ringY = mouseY;
    }
    cursorDot.classList.remove('custom-cursor-off');
    cursorRing.classList.remove('custom-cursor-off');
    glow.style.opacity = '1';
  });

  let isClicking = false;

  document.addEventListener('mousedown', () => {
    isClicking = true;
    cursorDot.classList.add('is-clicking');
    cursorRing.classList.add('is-clicking');
  });

  document.addEventListener('mouseup', () => {
    isClicking = false;
    cursorDot.classList.remove('is-clicking');
    cursorRing.classList.remove('is-clicking');
  });

  // Precise concentric cursor animation loop (tight 0.85 lerp to prevent separation)
  function render() {
    if (isInitialized) {
      ringX += (mouseX - ringX) * 0.85;
      ringY += (mouseY - ringY) * 0.85;

      const ringScale = isClicking ? 0.75 : 1;
      const dotScale = isClicking ? 1.25 : 1;

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Delegated interactive hover triggers
  const interactiveSelector = 'a, button, input, select, textarea, .btn, .nav-logo, .nav-links a, .hamburger, .faq-q, .logo-cell, .testi-card, .cs-card, .showcase-card, .orbix-fcard, .award-card, .stat-glass';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;

    if (target.matches('input[type="text"], input[type="email"], textarea')) {
      cursorRing.classList.add('is-text');
      cursorDot.classList.add('is-text');
    } else {
      cursorRing.classList.add('is-hovered');
      cursorDot.classList.add('is-hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;

    cursorRing.classList.remove('is-hovered', 'is-text');
    cursorDot.classList.remove('is-hovered', 'is-text');
  });

  // Magnetic Button Effect
  document.querySelectorAll('.btn, .nav-cta, .nav-logo').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.22}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

initStylishCursor();

/* ===== NAV ACTIVE HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.style.color = '#111';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObs.observe(s));
