/* Customer counter */
(function () {
  var block    = document.getElementById('stat-block');
  var rowEl    = document.getElementById('stat-num-row');
  var viewport = document.getElementById('stat-num-viewport');
  var roll     = document.getElementById('stat-num-roll');
  var plusEl   = document.getElementById('stat-plus');
  var labelEl  = document.getElementById('stat-label');
  var burstEl  = document.getElementById('stat-burst');
  var ringEl   = document.getElementById('stat-ring');
  var blurNode = document.getElementById('stat-vblur-std');

  if (!block || !roll || !labelEl || !viewport) return;

  var started = false;
  var numEl   = document.getElementById('stat-num');

  /* Speed threshold — blur only kicks in above this (values per ms) */
  var BLUR_SPEED_START = 0.06;

  function getNumEl() {
    return document.getElementById('stat-num');
  }

  function setSingleDigit(n) {
    roll.innerHTML = '<span class="stat-num stat-digit-line" id="stat-num">' + n + '</span>';
    numEl = getNumEl();
  }

  function pulse(n) {
    setSingleDigit(n);
    numEl = getNumEl();
    numEl.classList.remove('stat-pop');
    void numEl.offsetWidth;
    numEl.classList.add('stat-pop');
  }

  function clearMotionBlur() {
    viewport.classList.remove('is-fast');
    viewport.style.filter = '';
    roll.style.transform = '';
    if (blurNode) blurNode.setAttribute('stdDeviation', '0 0');
  }

  function applyMotionBlur(velocity) {
    if (velocity < BLUR_SPEED_START) {
      viewport.classList.remove('is-fast');
      viewport.style.filter = '';
      roll.style.transform = roll.style.transform.replace(/ scaleY\([^)]*\)/, '');
      if (blurNode) blurNode.setAttribute('stdDeviation', '0 0');
      return;
    }

    var intensity = Math.min(1, (velocity - BLUR_SPEED_START) / 0.45);
    var yBlur     = intensity * 7;
    var stretch   = 1 + intensity * 0.22;

    viewport.classList.add('is-fast');
    if (blurNode) {
      blurNode.setAttribute('stdDeviation', '0 ' + yBlur.toFixed(2));
      viewport.style.filter = 'url(#stat-vblur)';
    }

    var baseY = roll.dataset.baseY || '0';
    roll.style.transform = 'translate3d(0,' + baseY + 'px,0) scaleY(' + stretch.toFixed(3) + ')';
  }

  function finish() {
    clearMotionBlur();
    setSingleDigit('100');
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
      gsap.fromTo(getNumEl(),
        { scale: 1 },
        { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.inOut' }
      );
    } else {
      plusEl.style.opacity = '0.9';
      if (burstEl) burstEl.style.opacity = '0';
    }
  }

  /* Odometer roll — continuous vertical morph with directional blur */
  function rapidCount(from, to, durationMs, done) {
    var lineH = viewport.offsetHeight;
    var html  = '';

    for (var i = from; i <= to; i++) {
      html += '<span class="stat-digit-line">' + i + '</span>';
    }
    roll.innerHTML = html;
    roll.dataset.baseY = '0';
    roll.style.transform = 'translate3d(0,0,0)';

    var t0           = performance.now();
    var lastEased    = 0;
    var lastFrame    = t0;

    function frame(now) {
      var t     = Math.min(1, (now - t0) / durationMs);
      var eased = t * t * t;
      var dt    = Math.max(1, now - lastFrame);
      var velocity = Math.abs(eased - lastEased) / dt * (to - from);

      var floatVal = from + (to - from) * eased;
      var offsetY  = -((floatVal - from) * lineH);

      roll.dataset.baseY = String(offsetY);
      roll.style.transform = 'translate3d(0,' + offsetY + 'px,0)';

      applyMotionBlur(velocity);

      lastEased = eased;
      lastFrame = now;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        clearMotionBlur();
        done();
      }
    }

    requestAnimationFrame(frame);
  }

  function run() {
    if (started) return;
    started = true;

    clearMotionBlur();
    rowEl.classList.remove('is-num-visible');
    setSingleDigit('0');
    plusEl.textContent = '';
    plusEl.classList.remove('is-live');
    labelEl.classList.add('is-hidden');
    labelEl.classList.remove('is-visible');

    /* Fade 0 in */
    requestAnimationFrame(function () {
      rowEl.classList.add('is-num-visible');
    });

    /* Wait for fade, then label + slow ticks */
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
    }, 850);
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
