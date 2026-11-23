/* Back Lot Printing: Shirt Studio (3D).
   A real 3D tee or hoodie you can grab, spin all the way round and zoom into.
   Front and back each get their own print. Drag the print to move it.
   Uses three.js (vendor/three.min.js + OrbitControls + SVGLoader + RoomEnvironment). */
(function () {
  'use strict';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLOURS = [
    ['Black', '#1C1B19'], ['White', '#F3F1EB'], ['Heather grey', '#9C9FA3'], ['Navy', '#1E2A45'],
    ['Forest green', '#24442F'], ['Red', '#9C2323'], ['Sand', '#CBB894']
  ];
  var INKS = [['Auto', null], ['White', '#F6F4EF'], ['Black', '#151413'], ['Orange', '#E35B1E'], ['Gold', '#D6A54B'], ['Cobalt', '#2F6CE3']];
  var FONTS = [
    ['Block', "Anton, Impact, 'Arial Narrow', sans-serif", '400', 1.5],
    ['Classic', "Fraunces, Georgia, serif", '700', 0],
    ['Script', "Yellowtail, 'Brush Script MT', cursive", '400', 0],
    ['Clean', "'DM Sans', Arial, sans-serif", '700', 1]
  ];
  // units per inch, and placements: [label, centre x, top y, width in inches]
  var G = {
    // collar: where the neck seam sits on each side; vpi: drawing units per real inch going down the garment
    tee: { upi: 10, vpi: 13, collar: { front: 63, back: 49 }, label: 'T-shirt', quote: 'T-shirt',
      front: { left: ['Left chest', 245, 109, 4.5], centre: ['Centre chest', 200, 106, 10], full: ['Full front', 200, 100, 12] },
      back: { full: ['Full back', 200, 124, 12], neck: ['Back of neck', 200, 62, 2.5] } },
    hoodie: { upi: 9.5, vpi: 13.5, collar: { front: 60, back: 70 }, label: 'Hoodie', quote: 'Hoodie',
      front: { left: ['Left chest', 252, 108, 4.5], centre: ['Centre chest', 200, 204, 9], full: ['Full front', 200, 200, 11] },
      back: { full: ['Full back', 200, 148, 12], upper: ['Upper back', 200, 148, 9] } }
  };
  var PATHS = {
    teeBody: 'M148 38 L78 64 Q60 72 52 88 L18 158 L72 184 L96 140 L96 420 Q96 430 106 430 H294 Q304 430 304 420 L304 140 L328 184 L382 158 L348 88 Q340 72 322 64 L252 38 Q200 74 148 38 Z',
    teeCollarF: 'M148 38 Q200 74 252 38 Q200 88 148 38 Z',
    teeCollarB: 'M148 38 Q200 50 252 38 Q200 60 148 38 Z',
    hoodBody: 'M135 52 L72 78 Q52 90 46 120 L20 300 Q18 330 26 372 L74 378 Q80 340 84 300 L96 190 L96 398 H304 L304 190 L316 300 Q320 340 326 378 L374 372 Q382 330 380 300 L354 120 Q348 90 328 78 L265 52 Q200 80 135 52 Z',
    hoodBand: 'M96 396 H304 V428 Q304 433 299 433 H101 Q96 433 96 428 Z',
    cuffL: 'M23 364 L77 370 L75 398 L27 396 Z', cuffR: 'M377 364 L323 370 L325 398 L373 396 Z',
    hoodF: 'M128 56 Q138 4 200 2 Q262 4 272 56 Q252 104 200 108 Q148 104 128 56 Z',
    hoodFIn: 'M150 58 Q160 22 200 20 Q240 22 250 58 Q232 90 200 92 Q168 90 150 58 Z',
    hoodB: 'M136 54 Q200 0 264 54 L256 112 Q200 136 144 112 Z',
    hoodShell: 'M128 56 Q138 4 200 2 Q262 4 272 56 L262 78 L138 78 Z',
    pocket: 'M128 300 H272 L292 394 H108 Z'
  };
  var TW = 1024, K = TW / 400, TH = Math.round(440 * K);

  function lum(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); }
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function setup(root) {
    var THREE = window.THREE;
    var host = root.querySelector('#studio-3d'), stage = root.querySelector('#studio-stage'), readout = root.querySelector('#studio-readout');
    var size = root.querySelector('#studio-size'), sizeOut = root.querySelector('#studio-size-out');
    var t1 = root.querySelector('#studio-t1'), t2 = root.querySelector('#studio-t2');
    var file = root.querySelector('#studio-file'), clear = root.querySelector('#studio-clear'), note = root.querySelector('#studio-file-note');
    var cta = root.querySelector('#shirt-cta'), pressBtn = root.querySelector('#studio-press');
    var tex = {}, mats = null, body = null, hoodMesh = null;

    var S = {
      garment: 'tee', side: 'front', colour: 0, hidePrint: false,
      front: { place: 'left', t1: 'YOUR TEAM', t2: 'SHERWOOD PARK', font: 0, ink: 0, img: null, imgEl: null, ar: 1 },
      back: { place: 'full', t1: 'YOUR TEAM', t2: 'EST. 2026', font: 0, ink: 0, img: null, imgEl: null, ar: 1 }
    };
    function resetPlace(d, side) {
      var places = G[S.garment][side];
      if (!places[d.place]) d.place = Object.keys(places)[0];
      var p = places[d.place]; d.cx = p[1]; d.top = p[2]; d.w = p[3];
    }
    resetPlace(S.front, 'front'); resetPlace(S.back, 'back');
    function D() { return S[S.side]; }
    function hasPrint(d) { return !!(d.img || d.t1.trim() || d.t2.trim()); }

    // ---------- controls ----------
    function pressed(box, on) { Array.prototype.forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', c === on ? 'true' : 'false'); }); }
    var sw = root.querySelector('.studio-swatches');
    COLOURS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.style.background = c[1]; b.setAttribute('aria-label', c[0]); b.title = c[0];
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { S.colour = i; pressed(sw, b); paintAll(); });
      sw.appendChild(b);
    });
    var fontsBox = root.querySelector('.studio-fonts');
    FONTS.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'studio-chip'; b.textContent = f[0]; b.style.fontFamily = f[1]; b.style.fontWeight = f[2];
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { D().font = i; pressed(fontsBox, b); paint(S.side); });
      fontsBox.appendChild(b);
    });
    var inksBox = root.querySelector('.studio-inks');
    INKS.forEach(function (k, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ink-dot' + (k[1] ? '' : ' ink-auto'); b.setAttribute('aria-label', 'Print colour: ' + k[0]); b.title = k[0];
      if (k[1]) b.style.background = k[1];
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { D().ink = i; pressed(inksBox, b); paint(S.side); });
      inksBox.appendChild(b);
    });
    function buildPlaces() {
      var box = root.querySelector('.studio-places'); box.innerHTML = '';
      var places = G[S.garment][S.side];
      Object.keys(places).forEach(function (k) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'studio-chip'; b.textContent = places[k][0];
        b.setAttribute('aria-pressed', D().place === k ? 'true' : 'false');
        b.addEventListener('click', function () { D().place = k; resetPlace(D(), S.side); pressed(box, b); syncControls(); paint(S.side); });
        box.appendChild(b);
      });
    }
    function syncControls() {
      var d = D();
      t1.value = d.t1; t2.value = d.t2; size.value = d.w; sizeOut.textContent = d.w + '″';
      pressed(fontsBox, fontsBox.children[d.font]); pressed(inksBox, inksBox.children[d.ink]);
      clear.hidden = !d.img;
      note.textContent = d.img ? 'Your logo is on the ' + S.side + ' (stays on your device; attach it again in the quote form).' : 'Stays on your device, just for this preview.';
      Array.prototype.forEach.call(root.querySelectorAll('[data-garment]'), function (b) { b.setAttribute('aria-pressed', b.dataset.garment === S.garment ? 'true' : 'false'); });
      Array.prototype.forEach.call(root.querySelectorAll('[data-side]'), function (b) { b.setAttribute('aria-pressed', b.dataset.side === S.side ? 'true' : 'false'); });
      var ed = root.querySelector('.studio-editing'); if (ed) ed.textContent = 'Editing the ' + S.side;
      buildPlaces();
    }

    // ---------- textures ----------
    var noise = (function () {
      var c = canvas(256, 256), x = c.getContext('2d'), im = x.createImageData(256, 256);
      for (var i = 0; i < im.data.length; i += 4) { var v = 110 + Math.random() * 60; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      x.putImageData(im, 0, 0);
      x.globalAlpha = 0.18; x.fillStyle = '#fff';
      for (var y = 0; y < 256; y += 3) x.fillRect(0, y, 256, 1);
      return c;
    })();
    var faces = { front: canvas(TW, TH), back: canvas(TW, TH) };
    var printBox = { front: { w: 0, h: 0 }, back: { w: 0, h: 0 } };

    function inkFor(d) { var k = INKS[d.ink][1]; return k || (lum(COLOURS[S.colour][1]) > 0.55 ? '#151413' : '#F6F4EF'); }

    function drawPrintOn(x, side) {
      var d = S[side], upi = G[S.garment].upi;
      if (!hasPrint(d) || S.hidePrint) { printBox[side] = { w: 0, h: 0 }; return; }
      var target = d.w * upi;
      x.save();
      if (d.imgEl) {
        var h = target / d.ar;
        x.drawImage(d.imgEl, d.cx - target / 2, d.top, target, h);
        printBox[side] = { w: target, h: h };
      } else {
        var f = FONTS[d.font], big = 100, small = 36;
        var l1 = d.font === 2 ? d.t1 : d.t1.toUpperCase(), l2 = d.t2.toUpperCase();
        var ls = 'letterSpacing' in x;
        x.font = f[2] + ' ' + big + 'px ' + f[1]; if (ls) x.letterSpacing = f[3] + 'px';
        var w1 = l1.trim() ? x.measureText(l1).width : 0;
        x.font = '700 ' + small + 'px ' + FONTS[3][1]; if (ls) x.letterSpacing = '6px';
        var w2 = l2.trim() ? x.measureText(l2).width : 0;
        var natW = Math.max(w1, w2, 1), sc = target / natW;
        var h1 = l1.trim() ? big * 0.86 : 0, gap = (l1.trim() && l2.trim()) ? 16 : 0, h2 = l2.trim() ? small * 0.8 : 0;
        x.translate(d.cx, d.top); x.scale(sc, sc);
        x.fillStyle = inkFor(d); x.textAlign = 'center'; x.textBaseline = 'alphabetic';
        if (l1.trim()) { x.font = f[2] + ' ' + big + 'px ' + f[1]; if (ls) x.letterSpacing = f[3] + 'px'; x.fillText(l1, 0, h1); }
        if (l2.trim()) { x.font = '700 ' + small + 'px ' + FONTS[3][1]; if (ls) x.letterSpacing = '6px'; x.fillText(l2, 0, h1 + gap + h2); }
        printBox[side] = { w: target, h: (h1 + gap + h2) * sc };
      }
      x.restore();
    }

    function paint(side) {
      var c = faces[side], x = c.getContext('2d'), base = COLOURS[S.colour][1], light = lum(base) > 0.55;
      var dark = shade(base, -0.28), deep = shade(base, -0.5), stroke = light ? shade(base, -0.18) : shade(base, 0.12);
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, TW, TH);
      if (side === 'back') { x.translate(TW, 0); x.scale(-1, 1); } // the back is seen from behind
      x.scale(K, K);
      var P = function (d) { return new Path2D(d); };
      var hood = S.garment === 'hoodie', bodyP = hood ? PATHS.hoodBody : PATHS.teeBody;
      if (hood) { x.fillStyle = side === 'front' ? dark : shade(base, -0.06); x.fill(P(PATHS.hoodShell)); }
      x.fillStyle = base; x.fill(P(bodyP));
      if (hood) { x.fillStyle = shade(base, -0.12); [PATHS.hoodBand, PATHS.cuffL, PATHS.cuffR].forEach(function (p) { x.fill(P(p)); }); }
      x.save(); x.clip(P(bodyP)); drawPrintOn(x, side); x.restore();
      x.save(); x.clip(P(bodyP));
      var g = x.createLinearGradient(80, 0, 320, 0);
      g.addColorStop(0, 'rgba(0,0,0,.28)'); g.addColorStop(0.2, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.05)'); g.addColorStop(0.8, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.30)');
      x.fillStyle = g; x.fillRect(0, 0, 400, 440);
      var gv = x.createLinearGradient(0, 0, 0, 440);
      gv.addColorStop(0, light ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.07)'); gv.addColorStop(0.45, 'rgba(255,255,255,0)'); gv.addColorStop(1, 'rgba(0,0,0,.2)');
      x.fillStyle = gv; x.fillRect(0, 0, 400, 440);
      x.filter = 'blur(5px)'; x.lineCap = 'round';
      x.strokeStyle = light ? 'rgba(0,0,0,.14)' : 'rgba(0,0,0,.35)';
      [['M120 160 Q140 260 128 400', 10], ['M282 170 Q262 270 276 410', 9], ['M96 150 Q70 120 40 150', 8], ['M304 150 Q330 120 360 150', 8], ['M160 300 Q170 340 150 400', 5], ['M240 290 Q232 340 252 404', 5]].forEach(function (f) { x.lineWidth = f[1]; x.stroke(P(f[0])); });
      x.filter = 'none'; x.restore();
      x.strokeStyle = stroke; x.lineWidth = 1.4;
      if (!hood) {
        x.fillStyle = side === 'front' ? deep : dark; x.fill(P(side === 'front' ? PATHS.teeCollarF : PATHS.teeCollarB)); x.stroke(P(side === 'front' ? PATHS.teeCollarF : PATHS.teeCollarB));
        x.setLineDash([3, 3]); x.globalAlpha = 0.8; x.stroke(P('M24 152 L74 176 M376 152 L326 176 M100 418 H300')); x.setLineDash([]); x.globalAlpha = 1;
      } else if (side === 'front') {
        x.fillStyle = dark; x.fill(P(PATHS.hoodF));
        x.fillStyle = deep; x.fill(P(PATHS.hoodFIn));
        x.stroke(P(PATHS.pocket));
        var strC = light ? '#D8D2C6' : '#E9E5DD';
        x.strokeStyle = strC; x.lineWidth = 3.5; x.lineCap = 'round'; x.stroke(P('M182 98 Q178 140 176 182 M218 98 Q222 140 224 182'));
        x.fillStyle = shade(strC, -0.3); x.fillRect(172, 180, 8, 16); x.fillRect(220, 180, 8, 16);
      } else {
        x.fillStyle = shade(base, -0.06); x.fill(P(PATHS.hoodB)); x.stroke(P(PATHS.hoodB));
        x.setLineDash([3, 3]); x.stroke(P('M200 4 V124')); x.setLineDash([]);
      }
      if (hood) { x.strokeStyle = stroke; x.lineWidth = 1.4; [PATHS.hoodBand, PATHS.cuffL, PATHS.cuffR].forEach(function (p) { x.stroke(P(p)); }); }
      if (tex[side]) tex[side].needsUpdate = true;
      updateReadout();
    }
    function paintAll() { paint('front'); paint('back'); if (mats) mats.side.color.set(shade(COLOURS[S.colour][1], -0.1)).convertSRGBToLinear(); }

    // ---------- three.js scene ----------
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
    host.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f6c, 0.35));
    var key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(3, 4, 5); scene.add(key);
    var rim = new THREE.DirectionalLight(0xffe2c4, 0.5); rim.position.set(-4, 2, -5); scene.add(rim);
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100); camera.position.set(0, 0.2, 8.6);

    ['front', 'back'].forEach(function (s) { tex[s] = new THREE.CanvasTexture(faces[s]); tex[s].encoding = THREE.sRGBEncoding; tex[s].anisotropy = 8; });
    var bump = new THREE.CanvasTexture(noise); bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(10, 10);
    function faceMat(t) { return new THREE.MeshStandardMaterial({ map: t, roughness: 0.92, metalness: 0, bumpMap: bump, bumpScale: 0.012, alphaTest: 0.5, envMapIntensity: 0.5 }); }
    mats = { back: faceMat(tex.back), front: faceMat(tex.front), side: new THREE.MeshStandardMaterial({ color: 0x151412, roughness: 1, metalness: 0, bumpMap: bump, bumpScale: 0.012, envMapIntensity: 0.35 }) };

    var loader = new THREE.SVGLoader();
    function shapeGeo(d, depth, bevel) {
      var data = loader.parse('<svg xmlns="http://www.w3.org/2000/svg"><path d="' + d + '"/></svg>');
      var shapes = THREE.SVGLoader.createShapes(data.paths[0]);
      var geo = new THREE.ExtrudeGeometry(shapes, { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 6, curveSegments: 24 });
      var pos = geo.attributes.position, uv = geo.attributes.uv;
      for (var i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / 400, 1 - pos.getY(i) / 440);
      uv.needsUpdate = true;
      var g0 = geo.groups[0], half = g0.count / 2;
      geo.clearGroups();
      geo.addGroup(g0.start, half, 0);            // the z = 0 lid: the back
      geo.addGroup(g0.start + half, half, 2);     // the far lid: the front
      geo.addGroup(g0.start + g0.count, pos.count - g0.count, 1); // the sides
      geo.translate(-200, -220, -depth / 2);
      geo.computeVertexNormals();
      return geo;
    }
    var group = new THREE.Group(); scene.add(group);
    group.scale.set(0.01, -0.01, 0.01); // the drawing is y-down
    function buildGarment() {
      if (body) { group.remove(body); body.geometry.dispose(); }
      if (hoodMesh) { group.remove(hoodMesh); hoodMesh.geometry.dispose(); hoodMesh = null; }
      var hood = S.garment === 'hoodie';
      body = new THREE.Mesh(shapeGeo(hood ? PATHS.hoodBody : PATHS.teeBody, hood ? 12 : 5, hood ? 12 : 8), [mats.back, mats.side, mats.front]);
      group.add(body);
      if (hood) { hoodMesh = new THREE.Mesh(shapeGeo(PATHS.hoodShell, 14, 12), [mats.back, mats.side, mats.front]); group.add(hoodMesh); }
    }

    function resize() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize', resize);

    // drag-the-print listener goes on first, so it can stop the spin when you grab the print
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), drag = null;
    function hit(e) {
      if (!body) return null;
      var r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObject(body, false);
      if (!hits.length || !hits[0].uv) return null;
      var mi = hits[0].face.materialIndex, face = mi === 2 ? 'front' : mi === 0 ? 'back' : null;
      if (!face) return null;
      var u = hits[0].uv.x * 400, v = (1 - hits[0].uv.y) * 440;
      return { side: face, x: face === 'back' ? 400 - u : u, y: v };
    }
    function overPrint(h) {
      if (!h) return false;
      var d = S[h.side], b = printBox[h.side];
      return b.w && h.x > d.cx - b.w / 2 - 8 && h.x < d.cx + b.w / 2 + 8 && h.y > d.top - 8 && h.y < d.top + b.h + 8;
    }
    renderer.domElement.addEventListener('pointerdown', function (e) {
      var h = hit(e); if (!overPrint(h)) return;
      var d = S[h.side];
      drag = { side: h.side, dx: h.x - d.cx, dy: h.y - d.top, id: e.pointerId };
      root.classList.add('st-dragging'); controls.autoRotate = false;
      e.stopImmediatePropagation(); e.preventDefault();
    });

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
    controls.minDistance = 3.2; controls.maxDistance = 12; controls.rotateSpeed = 0.9;
    controls.minPolarAngle = Math.PI * 0.18; controls.maxPolarAngle = Math.PI * 0.82;
    controls.enableZoom = false; // switched on when the pointer is over the stage, so the page still scrolls normally
    controls.autoRotate = !still; controls.autoRotateSpeed = 1.4;
    var turnTo = null, zoomTo = null;
    controls.addEventListener('start', function () { controls.autoRotate = false; turnTo = null; zoomTo = null; });
    stage.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') controls.enableZoom = true; });
    stage.addEventListener('pointerleave', function () { controls.enableZoom = false; });
    renderer.domElement.addEventListener('touchstart', function (e) { controls.enableZoom = e.touches.length > 1 || controls.enableZoom; }, { passive: true });

    window.addEventListener('pointermove', function (e) {
      if (!drag) {
        if (e.target === renderer.domElement && e.pointerType === 'mouse') renderer.domElement.style.cursor = overPrint(hit(e)) ? 'move' : 'grab';
        return;
      }
      var h = hit(e); if (!h || h.side !== drag.side) return;
      var d = S[drag.side], b = printBox[drag.side];
      d.cx = Math.max(110, Math.min(290, h.x - drag.dx)); d.top = Math.max(40, Math.min(400 - b.h, h.y - drag.dy));
      var p = G[S.garment][drag.side][d.place];
      if (p && (Math.abs(p[1] - d.cx) > 4 || Math.abs(p[2] - d.top) > 4)) d.place = 'custom';
      paint(drag.side);
    });
    window.addEventListener('pointerup', function () { if (!drag) return; drag = null; root.classList.remove('st-dragging'); syncControls(); });

    function goSide(side) { controls.autoRotate = false; turnTo = side === 'back' ? Math.PI : 0; }
    Array.prototype.forEach.call(root.querySelectorAll('[data-side]'), function (b) { b.addEventListener('click', function () { goSide(b.dataset.side); }); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-zoom-step]'), function (b) {
      b.addEventListener('click', function () {
        var dist = camera.position.length(), step = Number(b.getAttribute('data-zoom-step'));
        zoomTo = Math.max(controls.minDistance, Math.min(controls.maxDistance, dist * (step > 0 ? 0.72 : 1.38)));
        controls.autoRotate = false;
      });
    });
    var resetBtn = root.querySelector('[data-zoom-reset]');
    if (resetBtn) resetBtn.addEventListener('click', function () { zoomTo = 8.6; turnTo = S.side === 'back' ? Math.PI : 0; controls.autoRotate = false; });

    // ---------- render loop (only while on screen) ----------
    var visible = true, running = false;
    function loop() {
      if (running) return; running = true;
      requestAnimationFrame(function tick() {
        if (!visible) { running = false; return; }
        if (turnTo !== null) {
          var az = controls.getAzimuthalAngle(), diff = turnTo - az;
          while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
          var rad = Math.hypot(camera.position.x, camera.position.z), na = az + (still ? diff : diff * 0.12);
          camera.position.x = Math.sin(na) * rad; camera.position.z = Math.cos(na) * rad;
          if (Math.abs(diff) < 0.004) turnTo = null;
        }
        if (zoomTo !== null) {
          var len = camera.position.length(), nl = len + (zoomTo - len) * (still ? 1 : 0.15);
          camera.position.multiplyScalar(nl / len); if (Math.abs(zoomTo - nl) < 0.02) zoomTo = null;
        }
        controls.update();
        var f = Math.abs(controls.getAzimuthalAngle()) < Math.PI / 2 ? 'front' : 'back';
        if (f !== S.side && !drag) { S.side = f; syncControls(); updateReadout(); }
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0.02 }).observe(stage);

    // ---------- readout + quote ----------
    function below(side, d) { var g = G[S.garment]; return Math.max(0, (d.top - g.collar[side]) / g.vpi).toFixed(1); }
    function updateReadout() {
      var d = D(), p = G[S.garment][S.side][d.place], b = printBox[S.side];
      readout.textContent = !b.w ? (S.side === 'back' ? 'Back: no print yet' : 'Front: no print yet')
        : (S.side === 'back' ? 'Back · ' : 'Front · ') + (p ? p[0] : 'Custom spot') + ' · ' + d.w + '″ × ' + (b.h / G[S.garment].upi).toFixed(1) + '″ · ' + below(S.side, d) + '″ below collar';
      var parts = [];
      ['front', 'back'].forEach(function (side) {
        var x = S[side]; if (!hasPrint(x)) return;
        var pl = G[S.garment][side][x.place];
        parts.push(side + ': ' + (x.img ? 'my logo' : '"' + [x.t1, x.t2].filter(function (v) { return v.trim(); }).join(' / ') + '"') + ', ' + (pl ? pl[0].toLowerCase() : 'custom spot') + ', about ' + x.w + '″ wide, top ' + below(side, x) + '″ below collar');
      });
      var colour = COLOURS[S.colour][0].toLowerCase(), hf = hasPrint(S.front), hb = hasPrint(S.back);
      cta.setAttribute('data-quote-note', 'From the Shirt Studio: ' + colour + ' ' + G[S.garment].label.toLowerCase() + '. ' + parts.join('; ') + '.');
      cta.setAttribute('data-quote-colour', colour);
      cta.setAttribute('data-quote-place', hf && hb ? 'Front and back' : hb ? 'Back' : S.front.place === 'left' ? 'Left chest' : 'Front');
      host.setAttribute('aria-label', '3D preview: ' + colour + ' ' + G[S.garment].label.toLowerCase() + '. ' + (parts.join('; ') || 'No print yet.') + ' Drag to spin it.');
    }

    // ---------- inputs ----------
    Array.prototype.forEach.call(root.querySelectorAll('[data-garment]'), function (b) {
      b.addEventListener('click', function () {
        if (S.garment === b.dataset.garment) return;
        S.garment = b.dataset.garment; resetPlace(S.front, 'front'); resetPlace(S.back, 'back');
        buildGarment(); syncControls(); paintAll();
      });
    });
    t1.addEventListener('input', function () { D().t1 = t1.value; paint(S.side); });
    t2.addEventListener('input', function () { D().t2 = t2.value; paint(S.side); });
    size.addEventListener('input', function () { D().w = Number(size.value); sizeOut.textContent = size.value + '″'; paint(S.side); });
    file.addEventListener('change', function () {
      var f = file.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { note.textContent = 'That file can\'t be previewed, but you can attach it to your quote.'; return; }
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () { var d = D(); d.img = r.result; d.imgEl = img; d.ar = (img.naturalWidth || 1) / (img.naturalHeight || 1); syncControls(); paint(S.side); };
        img.src = r.result;
      };
      r.readAsDataURL(f);
    });
    clear.addEventListener('click', function () { var d = D(); d.img = null; d.imgEl = null; file.value = ''; syncControls(); paint(S.side); });

    // ---------- press it ----------
    pressBtn.addEventListener('click', function () {
      if (root.classList.contains('st-pressing') || still) return;
      goSide(S.side); zoomTo = 8.6;
      root.classList.add('st-pressing'); S.hidePrint = true; paint(S.side);
      setTimeout(function () { root.classList.add('st-hot'); }, 380);
      setTimeout(function () { root.classList.remove('st-hot'); root.classList.add('st-lift'); }, 1450);
      setTimeout(function () { root.classList.remove('st-pressing', 'st-lift'); root.classList.add('st-peel'); S.hidePrint = false; paint(S.side); }, 1850);
      setTimeout(function () { root.classList.remove('st-peel'); }, 3000);
    });
    cta.addEventListener('click', function () { var g = document.getElementById('q-garment'); if (g) g.value = G[S.garment].quote; });

    buildGarment(); syncControls(); paintAll(); resize(); loop();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintAll);
    root.classList.add('st-ready');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var r = document.querySelector('.studio');
    if (!r) return;
    if (!window.THREE || !window.THREE.OrbitControls || !window.THREE.SVGLoader) { r.classList.add('st-no3d'); return; }
    try { setup(r); } catch (e) { r.classList.add('st-no3d'); if (window.console) console.error(e); }
  });
})();
