/* Maximus Reach · /local-growth/
   light interactions only — no framework
*/

/* CLIENT_COUNT — change this number any time */
const CLIENT_COUNT = 15;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.js-client-count').forEach(el => {
  el.textContent = String(CLIENT_COUNT);
});

const yearEl = document.getElementById('y');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* smooth in-page jumps */
document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

/* press / tap feedback */
function bindPress(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const down = () => el.classList.add('is-pressed');
    const up = () => el.classList.remove('is-pressed');
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('lostpointercapture', up);
  });
}

bindPress('.btn, .nav-cta');
bindPress('.plan');
bindPress('.why-item');

/* scroll reveals */
const reveals = [...document.querySelectorAll('.reveal')];

function showReveal(el) {
  el.classList.add('is-in');
}

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(showReveal);
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = Number(el.dataset.delay || 0);
      if (delay) setTimeout(() => showReveal(el), delay);
      else showReveal(el);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      const delay = Number(el.dataset.delay || 0);
      if (delay) setTimeout(() => showReveal(el), delay);
      else showReveal(el);
    } else {
      io.observe(el);
    }
  });
}
