/* Back Lot Printing: motion and polish.
   Scroll reveals, hero entrance, tilt on cards, a moving materials strip and a scroll progress bar.
   Everything is skipped for people who ask for reduced motion, and the page works fine without it. */
(function () {
  'use strict';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // 1. Things fade up as they scroll into view, a beat apart inside each group.
  function reveals() {
    var sel = ['.section-head', '.service-card', '.tiles > .tile', '.gallery > figure:not([hidden])', '.process-steps li',
      '.apparel-copy', '.shirt-try', '.apparel-notes > div', '.try-section .try', '.biz .wrap > *', '.about > *',
      '.faq details', '.card-form', '.rack-head', '.reviews > *', '#byo > *'].join(',');
    var els = $$(sel).filter(function (el) { return !el.closest('.hero'); });
    if (still || !('IntersectionObserver' in window)) return;
    els.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return els.indexOf(c) > -1; });
      el.style.setProperty('--d', (Math.min(sibs.indexOf(el), 6) * 80) + 'ms');
      el.classList.add('rv');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('rv-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  // 2. The hero builds itself in, then its photos lean toward the mouse.
  function hero() {
    var h = document.querySelector('.hero');
    if (!h) return;
    if (!still) requestAnimationFrame(function () { h.classList.add('hero-in'); });
    else h.classList.add('hero-in');
    var shots = h.querySelector('.hero-shots');
    if (!shots || still || !fine) return;
    var cards = $$('.shot', shots), raf = 0, tx = 0, ty = 0;
    h.addEventListener('pointermove', function (e) {
      var r = h.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    h.addEventListener('pointerleave', function () { tx = ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
    function apply() {
      raf = 0;
      cards.forEach(function (c, i) {
        var depth = i === 0 ? 14 : 24 + i * 6;
        c.style.setProperty('--px', (tx * depth).toFixed(1) + 'px');
        c.style.setProperty('--py', (ty * depth).toFixed(1) + 'px');
      });
    }
  }

  // 3. Cards tilt toward the cursor with a soft shine.
  function tilt() {
    if (still || !fine) return;
    $$('.service-card, .tiles > .tile .tile-art').forEach(function (el) {
      var max = el.classList.contains('service-card') ? 6 : 8;
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', ((0.5 - y) * max).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((x - 0.5) * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // 4. The "We print on / We engrave" strip becomes a slow, endless belt.
  function marquee() {
    var wrap = document.querySelector('.hero-materials .wrap');
    if (!wrap || still) return;
    var track = document.createElement('div');
    track.className = 'mq-track';
    var group = document.createElement('div');
    group.className = 'mq-group';
    while (wrap.firstChild) group.appendChild(wrap.firstChild);
    track.appendChild(group);
    for (var i = 0; i < 2; i++) { var c = group.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
    wrap.appendChild(track);
    wrap.classList.add('mq');
  }

  // 5. A thin progress line under the header as you scroll.
  function progress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function upd() {
      ticking = false;
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js-motion');
    hero(); reveals(); tilt(); marquee(); progress();
  });
})();

/* Asset tag preview: three numbered tags that update as you type. */
(function () {
  'use strict';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var FIN = {
    steel: { a: '#F2F1EE', b: '#B9B7B1', c: '#8E8B85', ink: '#2A2A2A', edge: '#7C7973' },
    black: { a: '#3B3B3E', b: '#1F1F22', c: '#121214', ink: '#E4E2DD', edge: '#0A0A0B' },
    brass: { a: '#F3DEA2', b: '#C9A45A', c: '#9C7A36', ink: '#3A2A10', edge: '#7E6129' }
  };
  function tagSVG(co, id, line, f, uid) {
    var F = FIN[f] || FIN.steel, g = 'g' + uid;
    // A small fake QR-style block, drawn from the ID so each tag looks different.
    var q = '', seed = 0, k;
    for (k = 0; k < id.length; k++) seed = (seed * 31 + id.charCodeAt(k)) >>> 0;
    for (var y = 0; y < 7; y++) for (var x = 0; x < 7; x++) {
      var corner = (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4);
      seed = (seed * 1103515245 + 12345) >>> 0;
      if (corner || (seed >> 16) % 2) q += '<rect x="' + (262 + x * 6) + '" y="' + (42 + y * 6) + '" width="6" height="6"/>';
    }
    return '<svg viewBox="0 0 340 140" role="img" aria-label="Asset tag ' + esc(id) + '">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + F.a + '"/><stop offset=".55" stop-color="' + F.b + '"/><stop offset="1" stop-color="' + F.c + '"/></linearGradient>' +
      '<pattern id="' + g + 'b" width="340" height="2" patternUnits="userSpaceOnUse"><rect width="340" height="1" fill="#fff" opacity=".07"/></pattern></defs>' +
      '<rect x="2" y="2" width="336" height="136" rx="16" fill="url(#' + g + ')" stroke="' + F.edge + '" stroke-width="2"/>' +
      '<rect x="2" y="2" width="336" height="136" rx="16" fill="url(#' + g + 'b)"/>' +
      '<circle cx="20" cy="70" r="7" fill="#1E1B17" opacity=".55"/><circle cx="320" cy="70" r="7" fill="#1E1B17" opacity=".55"/>' +
      '<g fill="' + F.ink + '" font-family="DM Sans, Arial, sans-serif">' +
      '<text x="40" y="38" font-size="17" font-weight="700" letter-spacing="1.5"' + (co.length > 13 ? ' textLength="212" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(co.toUpperCase()) + '</text>' +
      '<text x="40" y="58" font-size="10" letter-spacing="3" opacity=".75">PROPERTY · ASSET NO.</text>' +
      '<text x="40" y="96" font-size="34" font-weight="700" font-family="ui-monospace, Menlo, Consolas, monospace" letter-spacing="1">' + esc(id) + '</text>' +
      '<text x="40" y="122" font-size="10.5" letter-spacing="1" opacity=".85">' + esc(line.toUpperCase()) + '</text>' +
      '<g>' + q + '</g></g></svg>';
  }
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('tagbuilder');
    if (!root) return;
    var co = root.querySelector('#tb-co'), pre = root.querySelector('#tb-pre'), st = root.querySelector('#tb-start'), ln = root.querySelector('#tb-line');
    var tags = root.querySelectorAll('.tb-tag'), finish = 'steel';
    function draw() {
      var n = Math.max(1, Math.min(9999, parseInt(st.value, 10) || 1));
      Array.prototype.forEach.call(tags, function (t) {
        var i = Number(t.getAttribute('data-i'));
        var id = (pre.value || '') + String(n + i).padStart(4, '0');
        t.innerHTML = tagSVG(co.value || 'YOUR COMPANY', id, ln.value || '', finish, i);
      });
    }
    [co, pre, st, ln].forEach(function (el) { el.addEventListener('input', draw); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-finish]'), function (b) {
      b.addEventListener('click', function () {
        finish = b.getAttribute('data-finish');
        Array.prototype.forEach.call(root.querySelectorAll('[data-finish]'), function (o) {
          var on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        draw();
        root.classList.remove('tb-flash'); void root.offsetWidth; root.classList.add('tb-flash');
      });
    });
    draw();
  });
})();
