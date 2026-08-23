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

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    navLinks?.classList.remove('open');
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

/* ===== CURSOR GLOW ===== */
const glow = document.createElement('div');
glow.style.position = 'fixed';
glow.style.pointerEvents = 'none';
glow.style.zIndex = '9998';
glow.style.width = '350px';
glow.style.height = '350px';
glow.style.borderRadius = '50%';
glow.style.background = 'radial-gradient(circle, rgba(74,127,212,0.05) 0%, transparent 70%)';
glow.style.transform = 'translate(-50%, -50%)';
glow.style.transition = 'left 0.15s ease, top 0.15s ease';
glow.style.willChange = 'left, top';
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

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
