/* maxmarket.live
   script.js
   Zachary Maximus / Staunton VA
   last touched: july 2026

   notes to self:
   - gsap + scrolltrigger from cdn (keep versions in sync in the html)
   - particle count feels good around 55, don't crank it on mobile
   - logo tilt + card tilt share the same elastic settle
   - about page photo uses the same tilt pattern as the logo card
   - later: typed / staggered text inside each pf concept block
*/

gsap.registerPlugin(ScrollTrigger);

/* stops mobile URL-bar resize from re-firing scroll reveals mid-scroll */
ScrollTrigger.config({ ignoreMobileResize: true });

/* hide stuff before the intro timeline runs */
gsap.set('#logo-wrap',  { opacity: 0, y: 55 });
gsap.set('#hero-by',    { opacity: 0, y: 26 });
gsap.set('.h-word',     { yPercent: 115, opacity: 0 });
gsap.set('#hero-svc',   { opacity: 0, y: 22 });
gsap.set('#scroll-hint',{ opacity: 0 });
gsap.set('#ct-label',   { opacity: 0, y: 32 });
gsap.set('#ct-h',       { opacity: 0, y: 64 });
gsap.set('.card',       { opacity: 0, y: 52, scale: 0.95 });
gsap.set('#stat-ring',  { scale: 0.6, opacity: 0 });
gsap.set('#ct-tagline', { opacity: 0 });

if (document.getElementById('ab-label')) {
  gsap.set('#ab-label, #ab-h, #ab-bio, #ab-photo-wrap', { opacity: 0, scale: 0.97 });
}

/* custom cursor: fast dot, slower ring */
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
  });

  (function tickRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(tickRing);
  })();

  document.querySelectorAll('a, .logo-wrap, .wt-card, .ab-do-item, .ab-proof-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });
}

/* background particles (mouse pushes them around) */
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const mouse = { x: -999, y: -999 };
let W, H;

function resizeCvs() {
  W = cvs.width  = window.innerWidth;
  H = cvs.height = window.innerHeight;
}
resizeCvs();
window.addEventListener('resize', resizeCvs);

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const PCOUNT = 55;
const particles = [];

class Particle {
  constructor() { this.init(); }

  init() {
    this.x       = Math.random() * W;
    this.y       = Math.random() * H;
    this.sz      = Math.random() * 1.5 + 0.48;
    this.vx      = (Math.random() - 0.5) * 0.38;
    this.vy      = (Math.random() - 0.5) * 0.38;
    this.alpha   = Math.random() * 0.26 + 0.076;
    this.life    = Math.random() * 260 + 140;
    this.maxLife = this.life;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 130 && d > 0) {
      const f = (130 - d) / 130;
      this.vx -= (dx / d) * f * 1.0;
      this.vy -= (dy / d) * f * 1.0;
    }

    this.vx *= 0.976;
    this.vy *= 0.976;
    this.x  += this.vx;
    this.y  += this.vy;

    if (this.x < -5) this.x = W + 5;
    if (this.x > W + 5) this.x = -5;
    if (this.y < -5) this.y = H + 5;
    if (this.y > H + 5) this.y = -5;

    this.life--;
    if (this.life <= 0) this.init();
  }

  draw() {
    const a = this.alpha *
      Math.min(1, (this.maxLife - this.life) / 30, this.life / 30);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(44,37,32,${a})`;
    ctx.fill();
  }
}

for (let i = 0; i < PCOUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(44,37,32,${(1 - d / 110) * 0.14})`;
        ctx.lineWidth = 0.71;
        ctx.stroke();
      }
    }
  }
}

(function particleLoop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(particleLoop);
})();

/* logo badge tilt */
const logoWrap = document.getElementById('logo-wrap');
const logoCard = document.getElementById('logo-card');

if (logoWrap) {
  logoWrap.addEventListener('mousemove', e => {
    const r  = logoCard.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const ry = ((e.clientX - cx) / (r.width  / 2)) * 24;
    const rx = -((e.clientY - cy) / (r.height / 2)) * 24;
    gsap.to(logoCard, {
      rotateX: rx, rotateY: ry,
      transformPerspective: 500,
      duration: 0.22, ease: 'power2.out'
    });
  });

  logoWrap.addEventListener('mouseleave', () => {
    gsap.to(logoCard, {
      rotateX: 0, rotateY: 0,
      duration: 1.1, ease: 'elastic.out(1, 0.42)'
    });
  });
}

/* about photo tilt (same idea as logo) */
const abPhotoWrap = document.getElementById('ab-photo-wrap');
const abPhotoCard = document.getElementById('ab-photo-card');

if (abPhotoWrap && abPhotoCard) {
  abPhotoWrap.addEventListener('mousemove', e => {
    const r  = abPhotoCard.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const ry = ((e.clientX - cx) / (r.width  / 2)) * 14;
    const rx = -((e.clientY - cy) / (r.height / 2)) * 14;
    gsap.to(abPhotoCard, {
      rotateX: rx, rotateY: ry,
      transformPerspective: 700,
      duration: 0.22, ease: 'power2.out'
    });
  });

  abPhotoWrap.addEventListener('mouseleave', () => {
    gsap.to(abPhotoCard, {
      rotateX: 0, rotateY: 0,
      duration: 1.0, ease: 'elastic.out(1, 0.42)'
    });
  });
}

/* contact / work cards: tilt + soft spotlight */
document.querySelectorAll('.card, .wt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const ry = ((e.clientX - cx) / (r.width  / 2)) * 10;
    const rx = -((e.clientY - cy) / (r.height / 2)) * 10;

    const sx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const sy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--sx', sx + '%');
    card.style.setProperty('--sy', sy + '%');

    gsap.to(card, {
      rotateX: rx, rotateY: ry,
      transformPerspective: 900,
      scale: 1.026,
      duration: 0.22, ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      scale: 1,
      duration: 1.0, ease: 'elastic.out(1, 0.42)'
    });
  });
});

/* hero parallax (home only) — wait until title reveal unlocks so it doesn't fight the slide-up */
document.addEventListener('mousemove', e => {
  if (!document.getElementById('logo-wrap')) return;
  if (window.scrollY > window.innerHeight * 0.55) return;
  const heroH = document.getElementById('hero-h');
  if (heroH && !heroH.classList.contains('is-revealed')) return;

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  gsap.to('#logo-wrap',     { x: dx * 15,  y: dy * 9,  duration: 1.3, ease: 'power2.out' });
  gsap.to('#hero-by',       { x: dx * -9,  y: dy * -5, duration: 1.5, ease: 'power2.out' });
  gsap.to('#hl1 .h-word',   { x: dx * -8,  y: dy * -5, duration: 1.2, ease: 'power2.out' });
  gsap.to('#hl2 .h-word',   { x: dx *  8,  y: dy *  5, duration: 1.2, ease: 'power2.out' });
  gsap.to('#hero-svc',      { x: dx *  7,  y: dy *  4, duration: 1.7, ease: 'power2.out' });
});

/* home intro */
const intro = gsap.timeline({ delay: 0.25 });

intro.to('#logo-wrap', {
  opacity: 1, y: 0,
  duration: 1.15, ease: 'power3.out'
});

intro.to('#hero-by', {
  opacity: 0.42, y: 0,
  duration: 0.85, ease: 'power2.out'
}, '-=0.65');

intro.to('#hl1 .h-word', {
  yPercent: 0, opacity: 1,
  duration: 1.05, ease: 'power3.out'
}, '-=0.55');

intro.to('#hl2 .h-word', {
  yPercent: 0, opacity: 1,
  duration: 1.05, ease: 'power3.out',
  onComplete: () => {
    const heroH = document.getElementById('hero-h');
    if (heroH) heroH.classList.add('is-revealed');
  }
}, '-=0.78');

intro.to('#hero-svc', {
  opacity: 1, y: 0,
  duration: 0.85, ease: 'power2.out'
}, '-=0.52');

intro.to('#scroll-hint', {
  opacity: 1,
  duration: 0.7
}, '-=0.3');

/* about intro — opacity/scale only (no vertical slide) */
if (document.getElementById('ab-label')) {
  const abIntro = gsap.timeline({ delay: 0.2 });
  abIntro.to('#ab-photo-wrap', { opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out' });
  abIntro.to('#ab-label', { opacity: 0.36, scale: 1, duration: 0.75, ease: 'power2.out' }, '-=0.7');
  abIntro.to('#ab-h', { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, '-=0.55');
  abIntro.to('#ab-bio', { opacity: 0.58, scale: 1, duration: 0.9, ease: 'power2.out' }, '-=0.55');
}

/* scroll reveals */
gsap.to('#ct-label', {
  opacity: 0.36, y: 0,
  duration: 0.95, ease: 'power2.out',
  scrollTrigger: { trigger: '#ct-label', start: 'top 82%' }
});

gsap.to('#ct-h', {
  opacity: 1, y: 0,
  duration: 1.15, ease: 'power3.out',
  scrollTrigger: { trigger: '#ct-h', start: 'top 85%' }
});

gsap.to('.card', {
  opacity: 1, y: 0, scale: 1,
  duration: 0.95, ease: 'power3.out',
  stagger: 0.16,
  scrollTrigger: { trigger: '.cards', start: 'top 87%' }
});

gsap.to('#ct-tagline', {
  opacity: 0.28,
  duration: 1,
  scrollTrigger: { trigger: '#ct-tagline', start: 'top 90%' }
});

/*
  Scroll reveals for work teaser / portfolio / about sections:
  CSS .reveal + IntersectionObserver (once). No GSAP y slides — those were jolting on mobile.
  Homepage hero (logo → services line) is never touched here.
*/
(function initSteadyReveals() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollTargets = [];

  function arm(selector, extraClass, bucket) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('reveal');
      if (extraClass) el.classList.add(extraClass);
      bucket.push(el);
    });
  }

  function showStaggered(els, stepMs, startMs) {
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), startMs + i * stepMs);
    });
  }

  /* homepage selected work — only when that section enters view */
  const wtSection = document.getElementById('work-teaser');
  const wtItems = [];
  if (wtSection) {
    arm('#wt-label', 'reveal-label', wtItems);
    arm('#wt-h', null, wtItems);
    arm('#wt-sub', 'reveal-soft', wtItems);
    arm('.wt-card', null, wtItems);
    arm('#wt-view-all', 'reveal-muted', wtItems);
  }

  /* portfolio intro (copy + category pills) on load; cards on scroll */
  const pfIntro = [];
  if (document.getElementById('pf-label')) {
    arm('#pf-label', 'reveal-label', pfIntro);
    arm('#pf-h', null, pfIntro);
    arm('#pf-intro', 'reveal-soft', pfIntro);
    arm('#pf-concepts-line', 'reveal-concepts', pfIntro);
    arm('#pf-disclaimer', 'reveal-disclaimer', pfIntro);
    arm('.pf-filter', null, pfIntro);
    arm('.pf-card', null, scrollTargets);
  }

  if (document.getElementById('ab-do')) {
    arm('.ab-do-item', null, scrollTargets);
    arm('.ab-proof-card', null, scrollTargets);
    arm('.ab-step', null, scrollTargets);
    arm('#ab-cta', null, scrollTargets);
  }

  if (reduce) {
    [...wtItems, ...pfIntro, ...scrollTargets].forEach(el => el.classList.add('is-visible'));
    return;
  }

  /* portfolio page intro: already at 0 via CSS, then stagger in */
  if (pfIntro.length) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => showStaggered(pfIntro, 130, 200));
    });
  }

  /* work teaser: fire only when the block is on screen */
  if (wtSection && wtItems.length) {
    const wtIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        showStaggered(wtItems, 110, 0);
        wtIo.disconnect();
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });
    wtIo.observe(wtSection);
  }

  if (!scrollTargets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  scrollTargets.forEach(el => io.observe(el));
})();

/* category icons on concept card tags (same marks as the filter pills) */
(function injectPfCatIcons() {
  const icons = {
    web: '<svg class="pf-filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M1.5 5.5h13"/><path d="M5.5 8.5l-1.5 1.5 1.5 1.5M10.5 8.5l1.5 1.5-1.5 1.5M9 7.5l-2 5"/></svg>',
    ads: '<svg class="pf-filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 12V8M6.5 12V5M10 12V7M13.5 12V3.5" stroke-linecap="round"/><path d="M2.5 10.5l3-3 2.5 1.5 4.5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    growth: '<svg class="pf-filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="6.5" r="2.5"/><path d="M8 9v4.5"/><path d="M4.5 13c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0" stroke-linecap="round"/></svg>',
    creative: '<svg class="pf-filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M6.5 5.8l4 2.2-4 2.2V5.8z" fill="currentColor" stroke="none"/></svg>'
  };

  document.querySelectorAll('.pf-card').forEach(card => {
    const cat = card.querySelector('.pf-cat');
    const svg = icons[card.dataset.category];
    if (!cat || !svg || cat.querySelector('.pf-filter-ico')) return;
    cat.insertAdjacentHTML('afterbegin', svg);
  });
})();

/* portfolio filters */
const pfFilters = document.querySelectorAll('.pf-filter');
const pfCards   = document.querySelectorAll('.pf-card');

if (pfFilters.length && pfCards.length) {
  pfFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      pfFilters.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      pfCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  });
}

/* jump to a project from the homepage teaser */
if (window.location.hash && document.querySelector(window.location.hash)) {
  setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.style.outline = '2px solid rgba(217, 195, 176, 0.6)';
      target.style.outlineOffset = '4px';
      setTimeout(() => { target.style.outline = ''; target.style.outlineOffset = ''; }, 2500);
    }
  }, 600);
}

let scrollHintHidden = false;
window.addEventListener('scroll', () => {
  const hide = window.scrollY > 70;
  if (hide === scrollHintHidden) return;
  scrollHintHidden = hide;
  gsap.to('#scroll-hint', {
    opacity: hide ? 0 : 1,
    duration: 0.45,
    overwrite: true
  });
}, { passive: true });

/* blob parallax: set position directly — gsap.to() on every scroll was stacking tweens */
const setBlob1Y = gsap.quickSetter('.b1', 'y', 'px');
const setBlob2Y = gsap.quickSetter('.b2', 'y', 'px');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  setBlob1Y(y * 0.24);
  setBlob2Y(y * -0.14);
}, { passive: true });

/* backup: contact GSAP only — never force off-screen .reveal items visible */
setTimeout(() => {
  document.querySelectorAll('#ct-label, #ct-h, .card, #ct-tagline').forEach(el => {
    const opacity = parseFloat(window.getComputedStyle(el).opacity);
    if (opacity < 0.05) {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
    }
  });
}, 4000);
