/* Back Lot Printing: the clothes rack.
   Shirts hang on a rail and swing when you brush past them, drag the rack, or scroll it.
   No libraries. Turns itself off for people who ask for reduced motion. */
(function () {
  'use strict';

  function setup(rack) {
    var scroller = rack.querySelector('.rack-scroll');
    var row = rack.querySelector('.rack-row');
    var items = Array.prototype.slice.call(row.querySelectorAll('.hanger'));
    if (!items.length) return;

    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var state = items.map(function (li) {
      return { el: li.querySelector('.hanger-swing'), card: li.querySelector('.garment'), a: 0, v: 0 };
    });

    var K = 55, DAMP = 2.6, COUPLE = 9, MAXA = 30, raf = 0, last = 0;

    function kick(i, dv) {
      if (still || !state[i]) return;
      state[i].v = Math.max(-260, Math.min(260, state[i].v + dv));
      wake();
    }
    function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } }

    function step(now) {
      var dt = Math.min(0.033, (now - last) / 1000) || 0.016; last = now;
      var energy = 0, n = state.length, i, s, acc;
      for (i = 0; i < n; i++) {
        s = state[i];
        acc = -K * s.a - DAMP * s.v;
        if (i > 0) acc += COUPLE * (state[i - 1].a - s.a) * 0.5;
        if (i < n - 1) acc += COUPLE * (state[i + 1].a - s.a) * 0.5;
        s.v += acc * dt;
      }
      for (i = 0; i < n; i++) {
        s = state[i];
        s.a += s.v * dt;
        if (s.a > MAXA) { s.a = MAXA; s.v *= -0.4; }
        if (s.a < -MAXA) { s.a = -MAXA; s.v *= -0.4; }
        s.el.style.transform = 'rotate(' + s.a.toFixed(2) + 'deg)';
        energy += Math.abs(s.a) + Math.abs(s.v) * 0.05;
      }
      if (energy > 0.05 * n) { raf = requestAnimationFrame(step); }
      else {
        for (i = 0; i < n; i++) { state[i].a = 0; state[i].v = 0; state[i].el.style.transform = ''; }
        raf = 0;
      }
    }

    // Brushing past: the pointer's sideways speed pushes the shirts it passes over.
    var px = null, pt = 0;
    row.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var now = performance.now();
      if (px !== null && now > pt) {
        var vx = (e.clientX - px) / (now - pt); // px per ms
        if (Math.abs(vx) > 0.02) {
          for (var i = 0; i < state.length; i++) {
            var r = state[i].card.getBoundingClientRect();
            var mid = r.left + r.width / 2, d = Math.abs(e.clientX - mid);
            if (d < r.width * 0.75 && e.clientY > r.top - 40 && e.clientY < r.bottom + 10) {
              var fall = 1 - d / (r.width * 0.75);
              // A shirt pushed to the right swings its bottom right, which is a negative angle.
              kick(i, -vx * 55 * fall);
            }
          }
        }
      }
      px = e.clientX; pt = now;
    });
    row.addEventListener('pointerleave', function () { px = null; });

    // Dragging the rack with a mouse slides it along; the clothes swing behind.
    var down = false, startX = 0, startScroll = 0, moved = 0, lastScroll = scroller.scrollLeft;
    scroller.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startScroll = scroller.scrollLeft;
      rack.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
      scroller.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', function () { if (down) { down = false; rack.classList.remove('is-dragging'); } });

    // Any scroll (drag, trackpad or a finger swipe) swings everything a little.
    scroller.addEventListener('scroll', function () {
      var d = scroller.scrollLeft - lastScroll; lastScroll = scroller.scrollLeft;
      if (!d) return;
      // The rail moves; the shirts lag behind it, so they swing the opposite way.
      for (var i = 0; i < state.length; i++) kick(i, -d * 1.4);
    }, { passive: true });

    // A drag shouldn't open the photo. A real click still does (site.js handles the lightbox).
    row.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
    }, true);

    // Keyboard and taps get a small nudge so it feels alive.
    items.forEach(function (li, i) {
      var a = li.querySelector('a');
      if (a) a.addEventListener('focus', function () { kick(i, 70); });
      li.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') kick(i, (Math.random() > .5 ? 1 : -1) * 90); });
    });

    // Arrow buttons for people who don't drag.
    Array.prototype.forEach.call(rack.querySelectorAll('[data-rack-step]'), function (b) {
      b.addEventListener('click', function () {
        var dir = Number(b.getAttribute('data-rack-step')) || 1;
        scroller.scrollBy({ left: dir * Math.max(240, scroller.clientWidth * 0.7), behavior: still ? 'auto' : 'smooth' });
      });
    });

    // The first time the rack comes into view, the shirts sway in.
    if (!still && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          state.forEach(function (s, i) { s.v = (i % 2 ? -1 : 1) * (40 + (i * 37) % 50); });
          wake(); io.disconnect();
        }
      }, { threshold: 0.35 });
      io.observe(rack);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-rack]'), setup);
  });
})();
