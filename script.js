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

if (document.getElementById('wt-label')) {
  gsap.set('#wt-label, #wt-h, #wt-sub', { opacity: 0, y: 32 });
  gsap.set('.wt-card', { opacity: 0, y: 44 });
  gsap.set('#wt-view-all', { opacity: 0, y: 16 });
}

if (document.getElementById('pf-label')) {
  gsap.set('#pf-label, #pf-h, #pf-intro, #pf-concepts-line, #pf-disclaimer', { opacity: 0, y: 32 });
  gsap.set('.pf-card', { opacity: 0, y: 48 });
  gsap.set('.pf-filter', { opacity: 0, y: 12 });
}

if (document.getElementById('ab-label')) {
  gsap.set('#ab-label, #ab-h, #ab-bio, #ab-photo-wrap', { opacity: 0, y: 36 });
  gsap.set('.ab-do-item, .ab-proof-card, .ab-step', { opacity: 0, y: 40 });
  gsap.set('#ab-cta', { opacity: 0, y: 28 });
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

/* about intro (runs on about.html) */
if (document.getElementById('ab-label')) {
  const abIntro = gsap.timeline({ delay: 0.2 });
  abIntro.to('#ab-photo-wrap', { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out' });
  abIntro.to('#ab-label', { opacity: 0.36, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.7');
  abIntro.to('#ab-h', { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.55');
  abIntro.to('#ab-bio', { opacity: 0.58, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.55');
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

if (document.getElementById('work-teaser')) {
  gsap.to('#wt-label', {
    opacity: 0.36, y: 0,
    duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#work-teaser', start: 'top 85%' }
  });
  gsap.to('#wt-h', {
    opacity: 1, y: 0,
    duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#work-teaser', start: 'top 84%' }
  });
  gsap.to('#wt-sub', {
    opacity: 0.52, y: 0,
    duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#work-teaser', start: 'top 83%' }
  });
  gsap.to('.wt-card', {
    opacity: 1, y: 0,
    duration: 0.9, ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '#wt-grid', start: 'top 88%' }
  });
  gsap.to('#wt-view-all', {
    opacity: 0.45, y: 0,
    duration: 0.8,
    scrollTrigger: { trigger: '#wt-view-all', start: 'top 92%' }
  });
}

if (document.getElementById('pf-label')) {
  gsap.to('#pf-label', {
    opacity: 0.36, y: 0,
    duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.pf-hero', start: 'top 88%' }
  });
  gsap.to('#pf-h', {
    opacity: 1, y: 0,
    duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pf-hero', start: 'top 86%' }
  });
  gsap.to('#pf-intro', {
    opacity: 0.52, y: 0,
    duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.pf-hero', start: 'top 84%' }
  });
  gsap.to('#pf-concepts-line', {
    opacity: 0.48, y: 0,
    duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.pf-hero', start: 'top 83%' }
  });
  gsap.to('#pf-disclaimer', {
    opacity: 0.38, y: 0,
    duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.pf-hero', start: 'top 82%' }
  });
  gsap.to('.pf-filter', {
    opacity: 0.45, y: 0,
    duration: 0.7, ease: 'power2.out',
    stagger: 0.05,
    scrollTrigger: { trigger: '#pf-filters', start: 'top 90%' }
  });
  gsap.to('.pf-filter.is-active', { opacity: 1, duration: 0.3 });

  /* mobile: each concept reveals only when it enters the viewport */
  const pfMobile = window.matchMedia('(max-width: 768px)').matches;
  if (pfMobile) {
    ScrollTrigger.batch('.pf-card', {
      start: 'top 82%',
      once: true,
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          overwrite: true
        });
      }
    });
  } else {
    gsap.to('.pf-card', {
      opacity: 1, y: 0,
      duration: 0.95, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#pf-grid', start: 'top 88%' }
    });
  }
}

/* about sections on scroll */
if (document.getElementById('ab-do')) {
  gsap.to('.ab-do-item', {
    opacity: 1, y: 0,
    duration: 0.85, ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '#ab-do', start: 'top 80%' }
  });
  gsap.to('.ab-proof-card', {
    opacity: 1, y: 0,
    duration: 0.85, ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '#ab-proof', start: 'top 80%' }
  });
  gsap.to('.ab-step', {
    opacity: 1, y: 0,
    duration: 0.8, ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '#ab-process', start: 'top 78%' }
  });
  gsap.to('#ab-cta', {
    opacity: 1, y: 0,
    duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#ab-cta', start: 'top 88%' }
  });
}

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
        gsap.to(b, { opacity: active ? 1 : 0.45, duration: 0.2 });
      });
      pfCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          gsap.to(card, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
        }
      });
      ScrollTrigger.refresh();
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

window.addEventListener('scroll', () => {
  gsap.to('#scroll-hint', {
    opacity: window.scrollY > 70 ? 0 : 1,
    duration: 0.45
  });
}, { passive: true });

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  gsap.to('.b1', { y: y * 0.24, duration: 0.5, ease: 'none' });
  gsap.to('.b2', { y: y * -0.14, duration: 0.5, ease: 'none' });
}, { passive: true });

/* backup: if scroll triggers never fire, unhide after a few seconds */
setTimeout(() => {
  document.querySelectorAll(
    '#ct-label, #ct-h, .card, #stat-block, #ct-tagline, #wt-label, #wt-h, #wt-sub, .wt-card, #wt-view-all, #pf-label, #pf-h, #pf-intro, #pf-concepts-line, #pf-disclaimer, .pf-card, .pf-filter, .ab-do-item, .ab-proof-card, .ab-step, #ab-cta'
  ).forEach(el => {
    const opacity = parseFloat(window.getComputedStyle(el).opacity);
    if (opacity < 0.05) {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6 });
    }
  });
}, 4000);
