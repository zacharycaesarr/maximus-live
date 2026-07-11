/* counter.js
   zach: kept separate so I can hide the whole block with [hidden]
   without breaking the rest of the site
*/
(function () {
  var block     = document.getElementById('stat-block');
  var rowEl     = document.getElementById('stat-num-row');
  var displayEl = document.getElementById('stat-num-display');
  var numEl     = document.getElementById('stat-num');
  var plusEl    = document.getElementById('stat-plus');
  var labelEl   = document.getElementById('stat-label');
  var burstEl   = document.getElementById('stat-burst');
  var ringEl    = document.getElementById('stat-ring');
  var blurNode  = document.getElementById('stat-vblur-std');

  if (!block || !displayEl || !numEl || !labelEl) return;

  var started = false;
  var BLUR_SPEED_START = 0.08;

  function pulse(n) {
    numEl.textContent = String(n);
    numEl.classList.remove('stat-pop');
    void numEl.offsetWidth;
    numEl.classList.add('stat-pop');
  }

  function clearMotionBlur() {
    displayEl.style.filter = '';
    displayEl.style.transform = '';
    if (blurNode) blurNode.setAttribute('stdDeviation', '0 0');
  }

  function applyMotionBlur(velocity) {
    if (velocity < BLUR_SPEED_START) {
      clearMotionBlur();
      return;
    }

    var intensity = Math.min(1, (velocity - BLUR_SPEED_START) / 0.35);
    var yBlur     = intensity * 5.5;
    var stretch   = 1 + intensity * 0.14;

    if (blurNode) {
      blurNode.setAttribute('stdDeviation', '0 ' + yBlur.toFixed(2));
      displayEl.style.filter = 'url(#stat-vblur)';
    }
    displayEl.style.transform = 'scaleY(' + stretch.toFixed(3) + ')';
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
      displayEl.classList.add('is-animating');
      gsap.fromTo(displayEl,
        { scale: 1 },
        {
          scale: 1.05,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
          onComplete: function () {
            displayEl.classList.remove('is-animating');
            gsap.set(displayEl, { clearProps: 'scale' });
          }
        }
      );
    } else {
      plusEl.style.opacity = '0.9';
      if (burstEl) burstEl.style.opacity = '0';
    }
  }

  /* fast climb: blur only when speed picks up */
  function rapidCount(from, to, durationMs, done) {
    var lastVal  = from;
    var lastTime = performance.now();
    var t0       = performance.now();

    function frame(now) {
      var t       = Math.min(1, (now - t0) / durationMs);
      var eased   = t * t * t;
      var val     = Math.round(from + (to - from) * eased);
      var dt      = Math.max(1, now - lastTime);
      var velocity = Math.abs(val - lastVal) / dt;

      numEl.textContent = String(val);
      applyMotionBlur(velocity);

      lastVal  = val;
      lastTime = now;

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
    numEl.textContent = '0';
    plusEl.textContent = '';
    plusEl.classList.remove('is-live');
    plusEl.style.opacity = '';
    labelEl.classList.add('is-hidden');
    labelEl.classList.remove('is-visible');

    requestAnimationFrame(function () {
      rowEl.classList.add('is-num-visible');
    });

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
