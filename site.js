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
    photo: ['M6 10 H58 V54 H6 Z', 'M12 44 L24 30 L34 40 L42 32 L52 44 Z M40 18 A4 4 0 1 0 48 18 A4 4 0 1 0 40 18 Z', '#1E1B17']
  };
  function iconSVG(kind) {
    var ic = ICONS[kind] || ICONS.card;
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="' + ic[0] + '" fill="' + ic[2] + '" fill-rule="evenodd"/><path d="' + ic[1] + '" fill="#C23B12"/></svg>';
  }

  var CATS = [
    { id: 'drink', label: 'Drinkware' }, { id: 'pets', label: 'Pets' },
    { id: 'tags', label: 'Tags & keychains' }, { id: 'edc', label: 'Everyday carry' },
    { id: 'jewelry', label: 'Jewelry' }, { id: 'gifts', label: 'Gifts & home' },
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
  // Sends via formEndpoint if set, otherwise opens an email to the shop.
  function sendForm(subject, fields, statusEl, onDone) {
    var say = function (msg, ok) { if (statusEl) { statusEl.textContent = msg; statusEl.className = 'form-status ' + (ok ? 'ok' : 'err'); } };
    if (CFG.formEndpoint) {
      var fd = new FormData();
      fd.append('_subject', subject);
      Object.keys(fields).forEach(function (k) { fd.append(k, fields[k]); });
      say('Sending…', true);
      return fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (r) { if (!r.ok) throw new Error('bad'); say('Sent. We\'ll get back to you soon.', true); if (onDone) onDone(); })
        .catch(function () { say('That didn\'t send. Try again, or email us at ' + (CFG.email || 'our email') + '.', false); });
    }
    if (!CFG.email) { say('Online forms aren\'t set up yet. Please call or message us.', false); return; }
    var body = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
    window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    say('Your email app should open with everything filled in — just press send.', true);
    if (onDone) onDone();
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
    document.querySelectorAll('[data-link="instagram"]').forEach(function (el) { if (CFG.instagram) { el.href = 'https://instagram.com/' + CFG.instagram; if (!el.textContent.trim()) el.textContent = '@' + CFG.instagram; el.target = '_blank'; el.rel = 'noopener'; } });
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
    CFG: CFG, CATS: CATS, iconSVG: iconSVG, money: money, priceLabel: priceLabel, priceFor: priceFor,
    getOrder: getOrder, saveOrder: saveOrder, addToOrder: addToOrder, sendForm: sendForm,
    products: function () { return window.BACKLOT_PRODUCTS || []; },
    find: function (id) { return (window.BACKLOT_PRODUCTS || []).find(function (p) { return p.id === id; }); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  };

  document.addEventListener('DOMContentLoaded', function () { applyConfig(); setupMenu(); updateCartCount(); });
})();
