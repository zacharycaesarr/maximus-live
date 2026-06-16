/* ============================================================
   MAXIMUS MARKETING  ·  Zachary Maximus
   script.js  —  v1.0

   What's in here:
   1.  GSAP initial hidden states
   2.  Custom dual-layer cursor (dot + lagging ring)
   3.  Physics-based particle field with mouse repulsion
   4.  3D perspective tilt — logo badge
   5.  3D perspective tilt + mouse-spotlight — contact cards
   6.  Multi-layer mouse parallax on hero elements
   7.  Page-load animation timeline
   8.  ScrollTrigger reveal animations
   9.  Scroll-indicator fade
   10. Blob parallax on scroll
============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   1.  SET INITIAL HIDDEN STATES  (GSAP owns these)
────────────────────────────────────────────────────────── */
gsap.set('#logo-wrap',  { opacity: 0, y: 55 });
gsap.set('#hero-by',    { opacity: 0, y: 26 });
gsap.set('.h-word',     { yPercent: 115, opacity: 0 });
gsap.set('#hero-svc',   { opacity: 0, y: 22 });
gsap.set('#scroll-hint',{ opacity: 0 });
gsap.set('#ct-label',   { opacity: 0, y: 32 });
gsap.set('#ct-h',       { opacity: 0, y: 64 });
gsap.set('.card',       { opacity: 0, y: 52, scale: 0.95 });
gsap.set('#stat-block', { opacity: 1 });
gsap.set('#stat-label', { y: 28, opacity: 0 });
gsap.set('#stat-plus',  { opacity: 0 });
gsap.set('#stat-ring',  { scale: 0.6, opacity: 0 });
gsap.set('#ct-tagline', { opacity: 0 });

/* ──────────────────────────────────────────────────────────
   2.  CUSTOM CURSOR
   dot  — instant tracking
   ring — smooth lag (lerp)
────────────────────────────────────────────────────────── */
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = 0, my = 0;   // actual mouse
  let rx = 0, ry = 0;   // lagging ring position

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    /* Dot tracks instantly */
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
  });

  /* Ring lerps after mouse at 12% per frame */
  (function tickRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(tickRing);
  })();

  /* Expand ring on interactive elements */
  document.querySelectorAll('a, .logo-wrap').forEach(el => {
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

/* ──────────────────────────────────────────────────────────
   3.  PARTICLE FIELD
   — 55 drifting particles
   — Mouse repulsion within 130px
   — Particles connect when < 110px apart
────────────────────────────────────────────────────────── */
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
    /* Mouse repulsion */
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 130 && d > 0) {
      const f = (130 - d) / 130;
      this.vx -= (dx / d) * f * 1.0;
      this.vy -= (dy / d) * f * 1.0;
    }

    this.vx *= 0.976;    /* friction */
    this.vy *= 0.976;
    this.x  += this.vx;
    this.y  += this.vy;

    /* Wrap edges */
    if (this.x < -5) this.x = W + 5;
    if (this.x > W + 5) this.x = -5;
    if (this.y < -5) this.y = H + 5;
    if (this.y > H + 5) this.y = -5;

    this.life--;
    if (this.life <= 0) this.init();
  }

  draw() {
    /* Fade in / fade out over lifetime */
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

/* ──────────────────────────────────────────────────────────
   4.  3D TILT — LOGO BADGE
────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────
   5.  3D TILT + SPOTLIGHT — CONTACT CARDS
────────────────────────────────────────────────────────── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const ry = ((e.clientX - cx) / (r.width  / 2)) * 10;
    const rx = -((e.clientY - cy) / (r.height / 2)) * 10;

    /* Spotlight position as CSS custom props */
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

/* ──────────────────────────────────────────────────────────
   6.  MOUSE PARALLAX — HERO LAYERS
   Each element moves a different amount, creating depth.
────────────────────────────────────────────────────────── */
document.addEventListener('mousemove', e => {
  /* Only active while hero is in view */
  if (window.scrollY > window.innerHeight * 0.55) return;

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;   /* –1 → +1 */
  const dy = (e.clientY - cy) / cy;

  gsap.to('#logo-wrap',     { x: dx * 15,  y: dy * 9,  duration: 1.3, ease: 'power2.out' });
  gsap.to('#hero-by',       { x: dx * -9,  y: dy * -5, duration: 1.5, ease: 'power2.out' });
  gsap.to('#hl1 .h-word',   { x: dx * -8,  y: dy * -5, duration: 1.2, ease: 'power2.out' });
  gsap.to('#hl2 .h-word',   { x: dx *  8,  y: dy *  5, duration: 1.2, ease: 'power2.out' });
  gsap.to('#hero-svc',      { x: dx *  7,  y: dy *  4, duration: 1.7, ease: 'power2.out' });
});

/* ──────────────────────────────────────────────────────────
   7.  PAGE-LOAD ANIMATION TIMELINE
────────────────────────────────────────────────────────── */
const intro = gsap.timeline({ delay: 0.25 });

/* Logo drops in */
intro.to('#logo-wrap', {
  opacity: 1, y: 0,
  duration: 1.15, ease: 'power3.out'
});

/* Sub-label slides up */
intro.to('#hero-by', {
  opacity: 0.42, y: 0,
  duration: 0.85, ease: 'power2.out'
}, '-=0.65');

/* Title line 1 — slides up through clip */
intro.to('#hl1 .h-word', {
  yPercent: 0, opacity: 1,
  duration: 1.05, ease: 'power3.out'
}, '-=0.55');

/* Title line 2 — slight offset */
intro.to('#hl2 .h-word', {
  yPercent: 0, opacity: 1,
  duration: 1.05, ease: 'power3.out'
}, '-=0.78');

/* Services */
intro.to('#hero-svc', {
  opacity: 1, y: 0,
  duration: 0.85, ease: 'power2.out'
}, '-=0.52');

/* Scroll hint fades in last */
intro.to('#scroll-hint', {
  opacity: 1,
  duration: 0.7
}, '-=0.3');

/* Unlock title overflow after reveal — prevents parallax clipping */
intro.eventCallback('onComplete', () => {
  document.getElementById('hero-h').classList.add('is-revealed');
});

/* ──────────────────────────────────────────────────────────
   8.  SCROLL TRIGGER REVEALS
────────────────────────────────────────────────────────── */
/* Contact label */
gsap.to('#ct-label', {
  opacity: 0.36, y: 0,
  duration: 0.95, ease: 'power2.out',
  scrollTrigger: { trigger: '#ct-label', start: 'top 82%' }
});

/* Contact heading */
gsap.to('#ct-h', {
  opacity: 1, y: 0,
  duration: 1.15, ease: 'power3.out',
  scrollTrigger: { trigger: '#ct-h', start: 'top 85%' }
});

/* Cards staggered */
gsap.to('.card', {
  opacity: 1, y: 0, scale: 1,
  duration: 0.95, ease: 'power3.out',
  stagger: 0.16,
  scrollTrigger: { trigger: '.cards', start: 'top 87%' }
});

/* Customer counter — runs when scrolled into view */
let counterHasRun = false;

function startCustomerCounter() {
  if (counterHasRun) return;
  counterHasRun = true;
  runCustomerCounter();
}

ScrollTrigger.create({
  trigger: '#stat-block',
  start: 'top 95%',
  once: true,
  onEnter: startCustomerCounter
});

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  const el = document.getElementById('stat-block');
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
    startCustomerCounter();
  }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCustomerCounter() {
  const numEl   = document.getElementById('stat-num');
  const plusEl  = document.getElementById('stat-plus');
  const blockEl = document.getElementById('stat-block');
  const burstEl = document.getElementById('stat-burst');
  const ringEl  = document.getElementById('stat-ring');
  const labelEl = document.getElementById('stat-label');

  numEl.textContent = '0';
  plusEl.textContent = '';
  plusEl.classList.remove('is-live');

  function pulseNum(val) {
    numEl.textContent = val;
    gsap.fromTo(numEl,
      { scale: 1.08, opacity: 0.75 },
      { scale: 1, opacity: 1, duration: 0.14, ease: 'power2.out', overwrite: true }
    );
  }

  function finishCounter() {
    numEl.textContent = '100';
    plusEl.textContent = '+';
    plusEl.classList.add('is-live');
    blockEl.classList.add('is-complete');

    gsap.to(plusEl, { opacity: 0.9, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(burstEl,
      { scale: 0.35, opacity: 0.75 },
      { scale: 1.6, opacity: 0, duration: 1.4, ease: 'power2.out' }
    );
    gsap.fromTo(ringEl,
      { scale: 0.7, opacity: 0.45 },
      { scale: 1.55, opacity: 0, duration: 1.6, ease: 'power2.out' }
    );
    gsap.fromTo(numEl,
      { scale: 1 },
      { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  }

  /* Big 0 visible — brief pause */
  await wait(500);

  /* Label rises from below */
  await new Promise(resolve => {
    gsap.to(labelEl, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: resolve
    });
  });

  await wait(400);

  /* Slow ticks: 1, 2, 3 with pauses */
  pulseNum(1);
  await wait(700);
  pulseNum(2);
  await wait(450);
  pulseNum(3);
  await wait(250);

  /* Rapid climb 3 → 100 */
  await new Promise(resolve => {
    const counter = { val: 3 };
    gsap.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'power3.in',
      onUpdate: () => pulseNum(Math.round(counter.val)),
      onComplete: () => {
        finishCounter();
        resolve();
      }
    });
  });
}

/* Bottom tagline */
gsap.to('#ct-tagline', {
  opacity: 0.28,
  duration: 1,
  scrollTrigger: { trigger: '#ct-tagline', start: 'top 90%' }
});

/* ──────────────────────────────────────────────────────────
   9.  SCROLL INDICATOR — fade out after scrolling down
────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  gsap.to('#scroll-hint', {
    opacity: window.scrollY > 70 ? 0 : 1,
    duration: 0.45
  });
}, { passive: true });

/* ──────────────────────────────────────────────────────────
   10. BLOB PARALLAX ON SCROLL
────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  gsap.to('.b1', { y: y * 0.24, duration: 0.5, ease: 'none' });
  gsap.to('.b2', { y: y * -0.14, duration: 0.5, ease: 'none' });
}, { passive: true });

/* ──────────────────────────────────────────────────────────
   SAFETY NET — If animations don't fire (no scroll, JS quirk)
   reveal everything after 4 seconds
────────────────────────────────────────────────────────── */
setTimeout(() => {
  document.querySelectorAll(
    '#ct-label, #ct-h, .card, #stat-block, #ct-tagline'
  ).forEach(el => {
    const opacity = parseFloat(window.getComputedStyle(el).opacity);
    if (opacity < 0.05) {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
    }
  });
}, 4000);
