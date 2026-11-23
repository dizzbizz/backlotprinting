/* Back Lot Printing: Tumbler Studio (3D).
   A 20 oz tumbler you can spin and zoom. Engraving shows as bare stainless through the powder coat.
   Front and back each get their own design. Drag the engraving to move it. "Engrave it" runs the laser. */
(function () {
  'use strict';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COLOURS = [
    ['Black', '#1D1D1F'], ['White', '#EFEDE8'], ['Teal', '#2E6B68'], ['Navy', '#1F2A44'],
    ['Blush', '#D6A49C'], ['Red', '#9A2424'], ['Olive', '#5A6146'], ['Stainless', 'steel']
  ];
  var FONTS = [
    ['Classic', "Fraunces, Georgia, serif", '700', 0],
    ['Script', "Yellowtail, 'Brush Script MT', cursive", '400', 0],
    ['Block', "Anton, Impact, 'Arial Narrow', sans-serif", '400', 2],
    ['Clean', "'DM Sans', Arial, sans-serif", '700', 1]
  ];
  // Texture covers the full body: width = circumference (about 9.4 in), height = body height (about 6.6 in).
  var TW = 2048, TH = 1580, PPI = TW / 9.4;
  var BODY = { y0: -1.5, y1: 1.4, rBot: 0.78, rTop: 0.93 };

  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function setup(root) {
    var THREE = window.THREE;
    var host = root.querySelector('#ts-3d'), stage = root.querySelector('#ts-stage'), readout = root.querySelector('#ts-readout');
    var size = root.querySelector('#ts-size'), sizeOut = root.querySelector('#ts-size-out');
    var t1 = root.querySelector('#ts-t1'), t2 = root.querySelector('#ts-t2');
    var file = root.querySelector('#ts-file'), clear = root.querySelector('#ts-clear'), note = root.querySelector('#ts-file-note');
    var cta = root.querySelector('#try-cta'), engraveBtn = root.querySelector('#ts-engrave');
    var laser = root.querySelector('.laser'), spot = laser.querySelector('.spot'), beam = laser.querySelector('.beam');

    var S = {
      colour: 0, side: 'front', reveal: { front: 1, back: 1 },
      front: { t1: 'The Millers', t2: 'EST. 2026', font: 0, w: 2.5, u: 0.5, v: 0.42, img: null, mask: null },
      back: { t1: '', t2: '', font: 1, w: 2.5, u: 0.0, v: 0.42, img: null, mask: null }
    };
    function D() { return S[S.side]; }
    function has(d) { return !!(d.mask || d.t1.trim() || d.t2.trim()); }
    function pressed(box, on) { Array.prototype.forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', c === on ? 'true' : 'false'); }); }

    var sw = root.querySelector('.ts-swatches');
    COLOURS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.title = c[0]; b.setAttribute('aria-label', c[0]);
      b.style.background = c[1] === 'steel' ? 'linear-gradient(135deg,#f4f5f6,#9ea3a8 55%,#e1e3e5)' : c[1];
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { S.colour = i; pressed(sw, b); paint(); });
      sw.appendChild(b);
    });
    var fontsBox = root.querySelector('.ts-fonts');
    FONTS.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'studio-chip'; b.textContent = f[0]; b.style.fontFamily = f[1]; b.style.fontWeight = f[2];
      b.addEventListener('click', function () { D().font = i; pressed(fontsBox, b); paint(); });
      fontsBox.appendChild(b);
    });
    function sync() {
      var d = D();
      t1.value = d.t1; t2.value = d.t2; size.value = d.w; sizeOut.textContent = d.w + '″';
      pressed(fontsBox, fontsBox.children[d.font]);
      clear.hidden = !d.mask;
      note.textContent = d.mask ? 'Your logo is on the ' + S.side + ' (stays on your device).' : 'Stays on your device, just for this preview.';
      t1.placeholder = S.side === 'back' ? 'Add something to the back' : '';
      Array.prototype.forEach.call(root.querySelectorAll('[data-tside]'), function (b) { b.setAttribute('aria-pressed', b.dataset.tside === S.side ? 'true' : 'false'); });
      root.querySelector('#ts-editing').textContent = 'Editing the ' + S.side;
    }

    // ---------- textures: colour map + roughness/metal map from one engraving mask ----------
    var mask = canvas(TW, TH), mx = mask.getContext('2d');
    var colorC = canvas(TW, TH), cx = colorC.getContext('2d');
    var rmC = canvas(TW, TH), rx = rmC.getContext('2d');
    var boxes = { front: null, back: null };

    function drawDesign(side) {
      var d = S[side];
      if (!has(d)) { boxes[side] = null; return; }
      var targetW = d.w * PPI, x0, y0, w, h;
      mx.save();
      if (d.mask) {
        w = targetW; h = w / (d.mask.width / d.mask.height);
        x0 = d.u * TW - w / 2; y0 = d.v * TH - h / 2;
        [0, -TW, TW].forEach(function (off) { mx.drawImage(d.mask, x0 + off, y0, w, h); });
      } else {
        var f = FONTS[d.font], big = 120, small = 50, ls = 'letterSpacing' in mx;
        var l1 = d.t1, l2 = d.t2;
        mx.font = f[2] + ' ' + big + 'px ' + f[1]; if (ls) mx.letterSpacing = f[3] + 'px';
        var w1 = l1.trim() ? mx.measureText(l1).width : 0;
        mx.font = '700 ' + small + 'px ' + FONTS[3][1]; if (ls) mx.letterSpacing = '8px';
        var w2 = l2.trim() ? mx.measureText(l2.toUpperCase()).width : 0;
        var nat = Math.max(w1, w2, 1), sc = targetW / nat;
        var h1 = l1.trim() ? big * 0.9 : 0, gap = (l1.trim() && l2.trim()) ? 26 : 0, h2 = l2.trim() ? small * 0.8 : 0;
        w = targetW; h = (h1 + gap + h2) * sc; x0 = d.u * TW - w / 2; y0 = d.v * TH - h / 2;
        mx.fillStyle = '#fff'; mx.textAlign = 'center';
        [0, -TW, TW].forEach(function (off) {
          mx.save(); mx.translate(d.u * TW + off, y0); mx.scale(sc, sc);
          if (l1.trim()) { mx.font = f[2] + ' ' + big + 'px ' + f[1]; if (ls) mx.letterSpacing = f[3] + 'px'; mx.fillText(l1, 0, h1); }
          if (l2.trim()) { mx.font = '700 ' + small + 'px ' + FONTS[3][1]; if (ls) mx.letterSpacing = '8px'; mx.fillText(l2.toUpperCase(), 0, h1 + gap + h2); }
          mx.restore();
        });
      }
      mx.restore();
      boxes[side] = { x: x0, y: y0, w: w, h: h };
      // the laser reveal: hide what hasn't been engraved yet
      var r = S.reveal[side];
      if (r < 1) {
        mx.save(); mx.globalCompositeOperation = 'destination-out';
        [0, -TW, TW].forEach(function (off) { mx.fillRect(x0 + off + w * r, y0 - 20, w * (1 - r) + 4, h + 40); });
        mx.restore();
      }
    }

    function paint() {
      mx.clearRect(0, 0, TW, TH);
      drawDesign('front'); drawDesign('back');
      var steel = COLOURS[S.colour][1] === 'steel', base = steel ? '#B9BDC1' : COLOURS[S.colour][1];
      // colour
      cx.globalCompositeOperation = 'source-over';
      if (steel) {
        var g = cx.createLinearGradient(0, 0, 0, TH); g.addColorStop(0, '#C9CDD1'); g.addColorStop(1, '#AEB3B8');
        cx.fillStyle = g; cx.fillRect(0, 0, TW, TH);
        cx.globalAlpha = 0.06; cx.fillStyle = '#fff'; for (var y = 0; y < TH; y += 3) cx.fillRect(0, y, TW, 1); cx.globalAlpha = 1;
      } else { cx.fillStyle = base; cx.fillRect(0, 0, TW, TH); }
      var eng = canvas(TW, TH), ex = eng.getContext('2d');
      ex.drawImage(mask, 0, 0); ex.globalCompositeOperation = 'source-in';
      ex.fillStyle = steel ? '#E7E9EB' : '#D6D9DC'; ex.fillRect(0, 0, TW, TH);
      cx.drawImage(eng, 0, 0);
      // roughness (green) + metalness (blue)
      rx.globalCompositeOperation = 'source-over';
      rx.fillStyle = steel ? 'rgb(0,70,255)' : 'rgb(0,150,25)'; rx.fillRect(0, 0, TW, TH);
      var rm = canvas(TW, TH), rr = rm.getContext('2d');
      rr.drawImage(mask, 0, 0); rr.globalCompositeOperation = 'source-in';
      rr.fillStyle = steel ? 'rgb(0,175,150)' : 'rgb(0,80,255)'; rr.fillRect(0, 0, TW, TH);
      rx.drawImage(rm, 0, 0);
      if (mapTex) { mapTex.needsUpdate = true; rmTex.needsUpdate = true; }
      update();
    }

    // ---------- three.js ----------
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    host.appendChild(renderer.domElement);
    var scene = new THREE.Scene(), pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.03).texture;
    var keyL = new THREE.DirectionalLight(0xffffff, 0.8); keyL.position.set(3, 4, 4); scene.add(keyL);
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100); camera.position.set(0, 0.35, 8.4);

    var mapTex = new THREE.CanvasTexture(colorC); mapTex.encoding = THREE.sRGBEncoding; mapTex.anisotropy = 8; mapTex.wrapS = THREE.RepeatWrapping;
    var rmTex = new THREE.CanvasTexture(rmC); rmTex.wrapS = THREE.RepeatWrapping;
    var bodyMat = new THREE.MeshStandardMaterial({ map: mapTex, roughnessMap: rmTex, metalnessMap: rmTex, roughness: 1, metalness: 1 });

    // body: a lathe from a tapered profile with a rounded base
    var prof = [], N = 60, i;
    prof.push(new THREE.Vector2(0.0001, BODY.y0));
    for (i = 0; i <= 8; i++) { var a = (i / 8) * Math.PI / 2; prof.push(new THREE.Vector2(BODY.rBot - 0.08 + Math.sin(a) * 0.08, BODY.y0 + 0.08 - Math.cos(a) * 0.08)); }
    for (i = 1; i <= N; i++) { var t = i / N; prof.push(new THREE.Vector2(BODY.rBot + (BODY.rTop - BODY.rBot) * t, BODY.y0 + 0.08 + (BODY.y1 - BODY.y0 - 0.08) * t)); }
    var bodyGeo = new THREE.LatheGeometry(prof, 160, Math.PI, Math.PI * 2);
    var pos = bodyGeo.attributes.position, uv = bodyGeo.attributes.uv;
    for (i = 0; i < pos.count; i++) uv.setY(i, (pos.getY(i) - BODY.y0) / (BODY.y1 - BODY.y0));
    uv.needsUpdate = true;
    var tumbler = new THREE.Group(); scene.add(tumbler);
    var bodyMesh = new THREE.Mesh(bodyGeo, bodyMat); tumbler.add(bodyMesh);
    // stainless lip, lid, slider
    var lip = new THREE.Mesh(new THREE.CylinderGeometry(BODY.rTop + 0.005, BODY.rTop, 0.16, 96, 1, true), new THREE.MeshStandardMaterial({ color: 0xd9dcdf, metalness: 1, roughness: 0.18 }));
    lip.position.y = BODY.y1 + 0.08; tumbler.add(lip);
    var lidMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x18181a).convertSRGBToLinear(), metalness: 0, roughness: 0.45 });
    var lid = new THREE.Mesh(new THREE.CylinderGeometry(BODY.rTop - 0.02, BODY.rTop + 0.02, 0.2, 96), lidMat); lid.position.y = BODY.y1 + 0.26; tumbler.add(lid);
    var lidTop = new THREE.Mesh(new THREE.CylinderGeometry(BODY.rTop - 0.12, BODY.rTop - 0.04, 0.05, 96), lidMat); lidTop.position.y = BODY.y1 + 0.38; tumbler.add(lidTop);
    var slider = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.22), new THREE.MeshStandardMaterial({ color: new THREE.Color(0x0d0d0e).convertSRGBToLinear(), roughness: 0.3 }));
    slider.position.set(0, BODY.y1 + 0.42, 0.45); tumbler.add(slider);
    // soft floor shadow
    var sh = canvas(256, 256), shx = sh.getContext('2d'), rg = shx.createRadialGradient(128, 128, 10, 128, 128, 128);
    rg.addColorStop(0, 'rgba(30,27,23,.45)'); rg.addColorStop(1, 'rgba(30,27,23,0)'); shx.fillStyle = rg; shx.fillRect(0, 0, 256, 256);
    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = BODY.y0 - 0.005; scene.add(shadow);

    function resize() { var w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);

    // drag the engraving (listener first so it can stop the spin)
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), drag = null;
    function hit(e) {
      var r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var h = ray.intersectObject(bodyMesh, false);
      return h.length && h[0].uv ? { u: h[0].uv.x, v: 1 - h[0].uv.y } : null;
    }
    function inside(h, side) {
      var b = boxes[side]; if (!h || !b) return false;
      var px = h.u * TW, py = h.v * TH;
      for (var off = -TW; off <= TW; off += TW) if (px > b.x + off - 20 && px < b.x + off + b.w + 20 && py > b.y - 20 && py < b.y + b.h + 20) return true;
      return false;
    }
    renderer.domElement.addEventListener('pointerdown', function (e) {
      var h = hit(e); if (!inside(h, S.side)) return;
      var d = D(); drag = { du: h.u - d.u, dv: h.v - d.v };
      controls.autoRotate = false; root.classList.add('st-dragging'); e.stopImmediatePropagation(); e.preventDefault();
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) { if (e.target === renderer.domElement && e.pointerType === 'mouse') renderer.domElement.style.cursor = inside(hit(e), S.side) ? 'move' : 'grab'; return; }
      var h = hit(e); if (!h) return;
      var d = D(), du = h.u - drag.du;
      if (du - d.u > 0.5) du -= 1; if (du - d.u < -0.5) du += 1;
      d.u = ((du % 1) + 1) % 1; d.v = Math.max(0.18, Math.min(0.86, h.v - drag.dv));
      paint();
    });
    window.addEventListener('pointerup', function () { if (drag) { drag = null; root.classList.remove('st-dragging'); } });

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
    controls.minDistance = 2.6; controls.maxDistance = 11; controls.minPolarAngle = Math.PI * 0.22; controls.maxPolarAngle = Math.PI * 0.62;
    controls.enableZoom = false; controls.autoRotate = !still; controls.autoRotateSpeed = 1.6;
    controls.target.set(0, 0.05, 0);
    var turnTo = null, zoomTo = null;
    controls.addEventListener('start', function () { controls.autoRotate = false; turnTo = null; zoomTo = null; });
    stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') controls.enableZoom = true; });
    stage.addEventListener('pointerleave', function () { controls.enableZoom = false; });
    renderer.domElement.addEventListener('touchstart', function (e) { if (e.touches.length > 1) controls.enableZoom = true; }, { passive: true });

    function angleFor(side) { return side === 'back' ? Math.PI : 0; }
    function goSide(side) { controls.autoRotate = false; turnTo = angleFor(side); }
    Array.prototype.forEach.call(root.querySelectorAll('[data-tside]'), function (b) { b.addEventListener('click', function () { goSide(b.dataset.tside); }); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-tzoom]'), function (b) {
      b.addEventListener('click', function () { var dist = camera.position.distanceTo(controls.target); zoomTo = Math.max(controls.minDistance, Math.min(controls.maxDistance, dist * (Number(b.getAttribute('data-tzoom')) > 0 ? 0.7 : 1.4))); controls.autoRotate = false; });
    });
    root.querySelector('[data-tzoom-reset]').addEventListener('click', function () { zoomTo = 8.4; turnTo = angleFor(S.side); controls.autoRotate = false; });

    // laser spot follows a point on the surface
    var tmp = new THREE.Vector3();
    function surfacePoint(u, v) {
      var phi = Math.PI + u * Math.PI * 2, y = BODY.y0 + (1 - v) * (BODY.y1 - BODY.y0);
      var r = BODY.rBot + (BODY.rTop - BODY.rBot) * ((y - BODY.y0) / (BODY.y1 - BODY.y0));
      return tmp.set(Math.sin(phi) * r, y, Math.cos(phi) * r);
    }
    var engraving = null;
    function placeLaser() {
      if (!engraving) return;
      var b = boxes[engraving.side]; if (!b) return;
      var r = S.reveal[engraving.side], px = b.x + b.w * r, py = b.y + b.h * (0.15 + 0.7 * Math.abs(Math.sin(performance.now() / 70)));
      var p = surfacePoint(((px / TW) % 1 + 1) % 1, py / TH).clone();
      tumbler.localToWorld(p); p.project(camera);
      var w = host.clientWidth, h = host.clientHeight, sx = (p.x + 1) / 2 * w, sy = (1 - p.y) / 2 * h;
      spot.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px)';
      beam.style.left = sx.toFixed(1) + 'px'; beam.style.height = sy.toFixed(1) + 'px';
    }

    var visible = true, running = false;
    function loop() {
      if (running) return; running = true;
      requestAnimationFrame(function tick() {
        if (!visible) { running = false; return; }
        if (turnTo !== null) {
          var az = controls.getAzimuthalAngle(), diff = turnTo - az;
          while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
          var off = camera.position.clone().sub(controls.target), rad = Math.hypot(off.x, off.z), na = az + (still ? diff : diff * 0.12);
          camera.position.x = controls.target.x + Math.sin(na) * rad; camera.position.z = controls.target.z + Math.cos(na) * rad;
          if (Math.abs(diff) < 0.004) turnTo = null;
        }
        if (zoomTo !== null) {
          var o = camera.position.clone().sub(controls.target), len = o.length(), nl = len + (zoomTo - len) * (still ? 1 : 0.15);
          camera.position.copy(controls.target).add(o.multiplyScalar(nl / len)); if (Math.abs(zoomTo - nl) < 0.02) zoomTo = null;
        }
        controls.update();
        var f = Math.abs(controls.getAzimuthalAngle()) < Math.PI / 2 ? 'front' : 'back';
        if (f !== S.side && !drag && !engraving) { S.side = f; sync(); update(); }
        placeLaser();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0.02 }).observe(stage);

    function update() {
      var d = D(), b = boxes[S.side];
      readout.textContent = b ? (S.side === 'front' ? 'Front' : 'Back') + ' · ' + d.w + '″ × ' + (b.h / PPI).toFixed(1) + '″ engraving' : (S.side === 'front' ? 'Front' : 'Back') + ': nothing engraved yet';
      var txt = ['front', 'back'].map(function (s) { var x = S[s]; return has(x) ? (s + ': ' + (x.mask ? 'my logo' : [x.t1, x.t2].filter(function (v) { return v.trim(); }).join(' / '))) : ''; }).filter(Boolean).join('; ');
      cta.href = 'shop.html?item=d1' + (txt ? '&text=' + encodeURIComponent(COLOURS[S.colour][0] + ' tumbler. ' + txt) : '');
      host.setAttribute('aria-label', '3D tumbler preview: ' + COLOURS[S.colour][0].toLowerCase() + '. ' + (txt || 'No engraving yet.') + ' Drag to spin it.');
    }

    // ---------- inputs ----------
    t1.addEventListener('input', function () { D().t1 = t1.value; paint(); });
    t2.addEventListener('input', function () { D().t2 = t2.value; paint(); });
    size.addEventListener('input', function () { D().w = Number(size.value); sizeOut.textContent = size.value + '″'; paint(); });
    file.addEventListener('change', function () {
      var f = file.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { note.textContent = 'That file can\'t be previewed here.'; return; }
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          // turn the logo into an engraving mask: dark or opaque parts get engraved, white/clear parts don't
          var w = Math.min(1200, img.naturalWidth || 600), h = Math.round(w * (img.naturalHeight || 600) / (img.naturalWidth || 600));
          var c = canvas(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h);
          var im = x.getImageData(0, 0, w, h), px = im.data, k, transparent = false;
          for (k = 3; k < px.length; k += 400) if (px[k] < 200) { transparent = true; break; }
          for (k = 0; k < px.length; k += 4) {
            var l = 0.299 * px[k] + 0.587 * px[k + 1] + 0.114 * px[k + 2];
            var a = transparent ? px[k + 3] : Math.max(0, Math.min(255, (225 - l) * 2.2));
            px[k] = px[k + 1] = px[k + 2] = 255; px[k + 3] = a;
          }
          x.putImageData(im, 0, 0);
          D().mask = c; sync(); paint();
        };
        img.src = r.result;
      };
      r.readAsDataURL(f);
    });
    clear.addEventListener('click', function () { D().mask = null; file.value = ''; sync(); paint(); });

    // ---------- engrave it ----------
    engraveBtn.addEventListener('click', function () {
      if (engraving) return;
      var side = S.side; if (!has(S[side])) return;
      goSide(side); zoomTo = 5.6;
      if (still) return;
      engraving = { side: side, t0: performance.now() + 500 };
      S.reveal[side] = 0; paint(); root.classList.add('ts-lasering');
      (function step() {
        var p = (performance.now() - engraving.t0) / 2400;
        S.reveal[side] = Math.max(0, Math.min(1, p)); paint();
        if (p < 1) requestAnimationFrame(step);
        else { engraving = null; root.classList.remove('ts-lasering'); S.reveal[side] = 1; paint(); }
      })();
    });

    sync(); paint(); resize(); loop();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var r = document.querySelector('#tumbler-studio');
    if (!r) return;
    if (!window.THREE || !window.THREE.OrbitControls) { r.classList.add('st-no3d'); return; }
    try { setup(r); } catch (e) { r.classList.add('st-no3d'); if (window.console) console.error(e); }
  });
})();
