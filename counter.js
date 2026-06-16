/* Customer counter — standalone, no GSAP dependency */
(function () {
  var block   = document.getElementById('stat-block');
  var rowEl   = document.getElementById('stat-num-row');
  var numEl   = document.getElementById('stat-num');
  var blurEl  = document.getElementById('stat-num-blur');
  var plusEl  = document.getElementById('stat-plus');
  var labelEl = document.getElementById('stat-label');
  var burstEl = document.getElementById('stat-burst');
  var ringEl  = document.getElementById('stat-ring');

  if (!block || !numEl || !labelEl) return;

  var started = false;

  function pulse(n) {
    numEl.textContent = String(n);
    numEl.classList.remove('stat-pop');
    void numEl.offsetWidth;
    numEl.classList.add('stat-pop');
  }

  function clearMotionBlur() {
    if (rowEl) rowEl.classList.remove('is-ticking');
    numEl.classList.remove('is-ticking');
    numEl.style.filter = '';
    numEl.style.transform = '';
    if (blurEl) {
      blurEl.textContent = '';
      blurEl.style.opacity = '0';
      blurEl.style.filter = '';
      blurEl.style.transform = '';
    }
  }

  function finish() {
    clearMotionBlur();
    numEl.textContent = '100';
    plusEl.textContent = '+';
    plusEl.classList.add('is-live');
    block.classList.add('is-complete');

    if (typeof gsap !== 'undefined') {
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
    } else {
      plusEl.style.opacity = '0.9';
      if (burstEl) burstEl.style.opacity = '0';
    }
  }

  function rapidCount(from, to, durationMs, done) {
    if (rowEl) rowEl.classList.add('is-ticking');
    numEl.classList.add('is-ticking');

    var lastVal  = from;
    var lastTime = performance.now();
    var t0       = performance.now();

    function frame(now) {
      var t     = Math.min(1, (now - t0) / durationMs);
      var eased = t * t * t;
      var val   = Math.round(from + (to - from) * eased);
      var dt    = Math.max(1, now - lastTime);
      var speed = Math.abs(val - lastVal) / dt;

      numEl.textContent = String(val);

      /* Motion blur — trail ghost + velocity-scaled smear */
      if (blurEl && val !== lastVal) {
        blurEl.textContent = String(lastVal);
        var blurPx  = Math.min(8, 2 + speed * 12);
        var trailY  = Math.min(-18, -4 - speed * 80);
        var stretch = Math.min(1.45, 1.08 + speed * 0.35);
        var ghostOp = Math.min(0.65, 0.2 + speed * 0.4);

        blurEl.style.filter    = 'blur(' + blurPx + 'px)';
        blurEl.style.opacity   = String(ghostOp);
        blurEl.style.transform = 'translateY(' + trailY + 'px) scaleY(' + stretch + ')';
      }

      /* Main digit soft blur while accelerating */
      var mainBlur = t > 0.02 && t < 0.98 ? Math.min(2.2, 0.4 + eased * 1.8) : 0;
      numEl.style.filter = mainBlur ? 'blur(' + mainBlur + 'px)' : '';

      lastVal  = val;
      lastTime = now;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        done();
      }
    }

    requestAnimationFrame(frame);
  }

  function run() {
    if (started) return;
    started = true;

    clearMotionBlur();
    numEl.textContent = '0';
    plusEl.textContent = '';
    plusEl.classList.remove('is-live');
    labelEl.classList.add('is-hidden');
    labelEl.classList.remove('is-visible');

    setTimeout(function () {
      labelEl.classList.remove('is-hidden');
      labelEl.classList.add('is-visible');

      setTimeout(function () {
        pulse(1);
        setTimeout(function () {
          pulse(2);
          setTimeout(function () {
            pulse(3);
            setTimeout(function () {
              rapidCount(3, 100, 2500, finish);
            }, 250);
          }, 450);
        }, 700);
      }, 900);
    }, 500);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });

    observer.observe(block);
  } else {
    function onScroll() {
      var rect = block.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        run();
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
