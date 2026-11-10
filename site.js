/* Back Lot Printing — shared site script. You shouldn't need to edit this file. */
(function () {
  var CFG = window.BACKLOT || {};
  var ORDER_KEY = 'backlot-order-v1';

  /* ---------- Icons for product pictures ---------- */
  var ICONS = {
    tumbler: ['M21 8 H43 L39 54 A5 5 0 0 1 34 59 H30 A5 5 0 0 1 25 54 Z', 'M26 24 H39 V38 H26 Z', '#1E1B17'],
    flask: ['M27 4 H37 V10 H27 Z M18 12 H46 A4 4 0 0 1 50 16 V56 A4 4 0 0 1 46 60 H18 A4 4 0 0 1 14 56 V16 A4 4 0 0 1 18 12 Z', 'M22 26 H42 V42 H22 Z', '#1E1B17'],
    bottle: ['M27 4 H37 V13 H27 Z M25 13 H39 L45 24 V56 A4 4 0 0 1 41 60 H23 A4 4 0 0 1 19 56 V24 Z', 'M25 30 H39 V44 H25 Z', '#1E1B17'],
    dogtag: ['M22 8 H42 A10 10 0 0 1 52 18 V46 A10 10 0 0 1 42 56 H22 A10 10 0 0 1 12 46 V18 A10 10 0 0 1 22 8 Z M29 16 A3 3 0 1 0 35 16 A3 3 0 1 0 29 16 Z', 'M20 26 H44 V30 H20 Z M20 34 H40 V38 H20 Z M20 42 H36 V46 H20 Z', '#1E1B17'],
    keychain: ['M22 20 H42 A6 6 0 0 1 48 26 V52 A6 6 0 0 1 42 58 H22 A6 6 0 0 1 16 52 V26 A6 6 0 0 1 22 20 Z M24 10 A8 8 0 1 0 40 10 A8 8 0 1 0 24 10 Z M28 10 A4 4 0 1 1 36 10 A4 4 0 1 1 28 10 Z', 'M23 32 H41 V44 H23 Z', '#1E1B17'],
    card: ['M6 16 H58 A3 3 0 0 1 61 19 V45 A3 3 0 0 1 58 48 H6 A3 3 0 0 1 3 45 V19 A3 3 0 0 1 6 16 Z', 'M10 24 H28 V38 H10 Z M34 27 H54 V30 H34 Z M34 34 H48 V37 H34 Z', '#1E1B17'],
    knife: ['M4 42 L42 22 L47 28 L10 47 Z M44 21 L58 13 L62 19 L48 27 Z', 'M16 39 L32 31 L33 33 L17 41 Z', '#1E1B17'],
    jewelry: ['M12 36 A20 20 0 1 0 52 36 A20 20 0 1 0 12 36 Z M20 36 A12 12 0 1 1 44 36 A12 12 0 1 1 20 36 Z', 'M27 8 H37 L40 14 H24 Z', '#1E1B17'],
    board: ['M10 8 H58 A4 4 0 0 1 62 12 V52 A4 4 0 0 1 58 56 H10 Z M13 14 A3 3 0 1 0 19 14 A3 3 0 1 0 13 14 Z', 'M26 24 H52 V40 H26 Z', '#8A6A45'],
    coaster: ['M8 32 A24 24 0 1 0 56 32 A24 24 0 1 0 8 32 Z', 'M24 27 H40 V37 H24 Z', '#3A362D'],
    award: ['M14 8 H50 L44 40 H20 Z M28 40 H36 V50 H28 Z M18 50 H46 V58 H18 Z', 'M22 14 H42 V22 H22 Z', '#1E1B17'],
    patch: ['M10 16 H54 A6 6 0 0 1 60 22 V42 A6 6 0 0 1 54 48 H10 A6 6 0 0 1 4 42 V22 A6 6 0 0 1 10 16 Z', 'M14 28 H50 V36 H14 Z', '#8A5A35'],
    tool: ['M40 6 A12 12 0 0 0 30 22 L8 44 L20 56 L42 34 A12 12 0 0 0 58 24 L50 30 L44 28 L42 22 L48 14 Z', 'M17 45 L29 33 L31 35 L19 47 Z', '#1E1B17'],
    ornament: ['M8 36 A24 22 0 1 0 56 36 A24 22 0 1 0 8 36 Z M28 8 H36 V14 H28 Z', 'M20 33 H44 V39 H20 Z', '#1E1B17'],
    lighter: ['M18 16 H46 V58 H18 Z M18 6 H40 V14 H18 Z', 'M24 26 H40 V42 H24 Z', '#1E1B17'],
    print3d: ['M32 4 L56 17 V45 L32 58 L8 45 V17 Z', 'M32 30 L56 17 M32 30 L8 17 M32 30 V58 L30 58 V31 L8 18.5 L9 16.5 L32 29 L55 16.5 L56 18.5 L34 30 V58 L32 58 Z', '#1E1B17'],
    photo: ['M6 10 H58 V54 H6 Z', 'M12 44 L24 30 L34 40 L42 32 L52 44 Z M40 18 A4 4 0 1 0 48 18 A4 4 0 1 0 40 18 Z', '#1E1B17'],
    tshirt: ['M23 7 L10 13 L3 27 L13 32 L16 27 V58 H48 V27 L51 32 L61 27 L54 13 L41 7 Q32 15 23 7 Z', 'M24 30 H40 V44 H24 Z', '#1E1B17'],
    transfer: ['M10 5 H45 L56 16 V59 H10 Z', 'M32 21 L36 30 L46 31 L38.5 37.5 L41 47 L32 42 L23 47 L25.5 37.5 L18 31 L28 30 Z', '#3A362D'],
    tote: ['M11 23 H53 L50 59 H14 Z M21 23 V17 A11 11 0 0 1 43 17 V23 H39 V17 A7 7 0 0 0 25 17 V23 Z', 'M24 33 H40 V47 H24 Z', '#8A6A45']
  };
  function iconSVG(kind) {
    var ic = ICONS[kind] || ICONS.card;
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="' + ic[0] + '" fill="' + ic[2] + '" fill-rule="evenodd"/><path d="' + ic[1] + '" fill="#C23B12"/></svg>';
  }

  /* Photos that have right-sized WebP copies in images/w/ (made for you; new photos still work without them) */
  var WEBP = {"3d-printed-golf-jig":[480,800,1000],"airpods-case-eagle":[480,800,1000],"custom-tee-leo-black":[480,800,1000],"custom-tee-your-logo-white":[480,800,1000],"eagle-coin":[480,800,1000],"golf-ball-best-dad":[480,800,1000],"halloween-pumpkin":[480,800,1000],"metal-business-card":[480,800,1000],"pet-tag-luigi":[480,800,1000],"rotary-rotor-braap":[480,800,1000],"skull-coin":[480,800,1000],"step-1-bring":[480,800],"step-2-proof":[480,800],"step-3-engrave":[480,800],"step-4-pickup":[480,800],"tool-marking-wrench":[480,800,1000],"turtle-painted-by-kids":[480,800,1000],"turtle-wood":[480,800,1000],"whippet-head":[480,800,1000],"whippet-ornaments":[480,800,1000],"witches-brew-tumbler-both-sides":[480,800,1000],"witches-brew-tumbler-front":[480,800,1000]};
  function pic(src, alt, sizes) {
    var name = String(src).replace(/^images\//, '').replace(/\.jpe?g$/i, ''), w = WEBP[name], ss = '';
    if (w) ss = ' srcset="' + w.map(function (x) { return 'images/w/' + name + '-' + x + '.webp ' + x + 'w'; }).join(', ') + '" sizes="' + (sizes || '(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 300px') + '" width="1000" height="1000"';
    return '<img src="' + src + '"' + ss + ' alt="' + String(alt == null ? '' : alt).replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">';
  }
  function art(p, alt) {
    if (p && p.img) return pic(p.img, alt == null ? p.name : alt);
    return iconSVG(p ? p.kind : 'card');
  }

  var CATS = [
    { id: 'drink', label: 'Drinkware' }, { id: 'pets', label: 'Pets' },
    { id: 'tags', label: 'Tags & keychains' }, { id: 'edc', label: 'Everyday carry' },
    { id: 'jewelry', label: 'Jewelry' }, { id: 'gifts', label: 'Gifts & home' }, { id: 'kids', label: 'Wood & ornaments' }, { id: 'print', label: '3D printing' }, { id: 'apparel', label: 'Custom shirts & DTF' },
    { id: 'awards', label: 'Awards' }, { id: 'biz', label: 'Business & trade' }
  ];

  /* ---------- Money + pricing ---------- */
  function money(n) {
    var cents = Math.round(n * 100);
    return '$' + (cents % 100 ? (cents / 100).toFixed(2) : (cents / 100).toFixed(0));
  }
  function priceLabel(p) {
    if (p.unit === 'ea') return money(p.price) + ' ea';
    if (p.unit === 'from') return 'From ' + money(p.price);
    return money(p.price);
  }
  // Returns { each, subtotal, total, discountPct, note }
  function priceFor(p, qty) {
    qty = Math.max(1, qty | 0);
    var each = p.price, note = '', pct = 0;
    if (p.tiers && p.tiers.length) {
      p.tiers.forEach(function (t) { if (qty >= t[0]) { each = t[1]; note = money(t[1]) + ' each at ' + t[0] + '+'; } });
    } else if (p.unit !== 'ea') {
      pct = qty >= 50 ? 20 : qty >= 10 ? 10 : 0;
      if (pct) note = pct + '% volume discount';
    }
    var subtotal = each * qty;
    var total = subtotal * (1 - pct / 100);
    return { each: each, subtotal: subtotal, total: total, discountPct: pct, note: note };
  }

  /* ---------- Order storage (saved in the visitor's browser) ---------- */
  function getOrder() {
    try { var v = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function saveOrder(items) {
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(items)); } catch (e) { /* storage blocked */ }
    updateCartCount();
  }
  function addToOrder(line) {
    var items = getOrder();
    items.push(line);
    saveOrder(items);
  }
  function updateCartCount() {
    var n = getOrder().reduce(function (a, l) { return a + (l.qty || 0); }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    document.querySelectorAll('[data-cart-label]').forEach(function (el) { el.setAttribute('aria-label', 'Your order, ' + n + ' items'); });
  }

  /* ---------- Sending forms ---------- */
  // 1) formEndpoint in config.js (e.g. Formspree) if set
  // 2) otherwise Netlify Forms (opts.form = the form's name="…")
  // 3) if that fails, opens the customer's email app with everything filled in
  // onDone(how) is called with 'endpoint', 'netlify' or 'mail'.
  function sendForm(subject, fields, statusEl, onDone, opts) {
    opts = opts || {};
    var say = function (msg, ok) { if (statusEl) { statusEl.textContent = msg; statusEl.className = 'form-status ' + (ok ? 'ok' : 'err'); } };
    var email = CFG.email || 'hello@backlotprinting.com';
    function viaMail(note) {
      var body = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
      window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say((note ? note + ' ' : '') + 'Your email app should open with everything filled in. Just press send' + (opts.file ? ', and attach your file to that email.' : '.'), true);
      if (onDone) onDone('mail');
    }
    var fd = new FormData();
    Object.keys(fields).forEach(function (k) { fd.append(k, fields[k]); });
    if (opts.file) fd.append('Attachment', opts.file);
    say('Sending…', true);
    if (CFG.formEndpoint) {
      fd.append('_subject', subject);
      return fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (r) { if (!r.ok) throw new Error('bad'); say('', true); if (onDone) onDone('endpoint'); })
        .catch(function () { viaMail('That didn\'t go through online.'); });
    }
    if (opts.form && /^https?:$/.test(location.protocol)) {
      fd.append('form-name', opts.form);
      return fetch('/', { method: 'POST', body: fd })
        .then(function (r) { if (!r.ok) throw new Error('bad'); say('', true); if (onDone) onDone('netlify'); })
        .catch(function () { viaMail('That didn\'t go through online.'); });
    }
    viaMail('');
  }

  /* ---------- Fill in settings ---------- */
  function applyConfig() {
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var v = CFG[el.getAttribute('data-cfg')];
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-cfg-if]').forEach(function (el) {
      if (!CFG[el.getAttribute('data-cfg-if')]) el.hidden = true;
    });
    document.querySelectorAll('[data-link="email"]').forEach(function (el) { if (CFG.email) { el.href = 'mailto:' + CFG.email; el.textContent = CFG.email; } });
    document.querySelectorAll('[data-link="phone"]').forEach(function (el) { if (CFG.phone) { el.href = 'tel:' + CFG.phone.replace(/[^\d+]/g, ''); el.textContent = CFG.phone; } });
    document.querySelectorAll('[data-link="instagram"]').forEach(function (el) { if (CFG.instagram) { el.href = 'https://www.instagram.com/' + CFG.instagram; if (!el.textContent.trim()) el.textContent = '@' + CFG.instagram; el.target = '_blank'; el.rel = 'noopener'; } });
    document.querySelectorAll('[data-link="facebook"]').forEach(function (el) { if (CFG.facebook) { el.href = CFG.facebook; el.target = '_blank'; el.rel = 'noopener'; } });
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Mobile menu ---------- */
  function setupMenu() {
    var btn = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });
  }

  window.BL = {
    CFG: CFG, CATS: CATS, iconSVG: iconSVG, art: art, pic: pic, money: money, priceLabel: priceLabel, priceFor: priceFor,
    getOrder: getOrder, saveOrder: saveOrder, addToOrder: addToOrder, sendForm: sendForm,
    products: function () { return window.BACKLOT_PRODUCTS || []; },
    find: function (id) { return (window.BACKLOT_PRODUCTS || []).find(function (p) { return p.id === id; }); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  };

  /* Seasonal banner: hides itself after its end date and brings back the normal top strip */
  function seasonalBanner() {
    document.querySelectorAll('[data-xmas-until]').forEach(function (el) {
      var until = new Date(el.getAttribute('data-xmas-until') + 'T23:59:59');
      if (new Date() > until) {
        el.hidden = true;
        var normal = document.querySelector('[data-topbar-default]');
        if (normal) normal.hidden = false;
      }
    });
  }

  function seasonalBlocks() {
    document.querySelectorAll('[data-show-until]').forEach(function (el) {
      if (new Date() > new Date(el.getAttribute('data-show-until') + 'T23:59:59')) el.hidden = true;
    });
  }

  /* Sticky "Get a quote" bar on phones: tucks away while the quote form or footer is on screen */
  function mobileBar() {
    var bar = document.querySelector('[data-mobile-cta]');
    if (!bar || !('IntersectionObserver' in window)) return;
    var targets = [document.getElementById('quote'), document.querySelector('.site-footer')].filter(Boolean);
    var seen = new Set();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      bar.classList.toggle('is-tucked', seen.size > 0);
    }, { threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* Photo slots: a figure with data-slot="images/name.jpg" shows itself once that file exists */
  function photoSlots() {
    document.querySelectorAll('[data-slot]').forEach(function (fig) {
      var probe = new Image();
      probe.onload = function () { var im = fig.querySelector('img'); if (im) im.src = fig.getAttribute('data-slot'); fig.hidden = false; };
      probe.src = fig.getAttribute('data-slot');
    });
  }

  /* Tap or click a photo to see it large, with its caption */
  function lightbox() {
    var dlg = null, lastFocus = null;
    function open(a) {
      if (!dlg) {
        dlg = document.createElement('dialog'); dlg.className = 'lightbox';
        dlg.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lightbox-close" aria-label="Close photo">&times;</button>';
        document.body.appendChild(dlg);
        dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.lightbox-close')) dlg.close(); });
        dlg.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
      }
      var small = a.querySelector('img'), fig = a.closest('figure'), cap = fig && fig.querySelector('figcaption');
      var big = dlg.querySelector('img');
      big.src = a.getAttribute('href'); big.alt = small ? small.alt : '';
      dlg.querySelector('figcaption').textContent = cap ? cap.textContent : (small ? small.alt : '');
      lastFocus = a;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-zoom]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); open(a);
    });
  }

  document.addEventListener('DOMContentLoaded', function () { applyConfig(); setupMenu(); updateCartCount(); seasonalBanner(); seasonalBlocks(); mobileBar(); photoSlots(); lightbox(); });
})();
