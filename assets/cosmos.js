/* FinDeependence Universe · 3D cosmos (Three.js r160, vendored).
 * A glowing FinDeependence core, one planet per module, a ring of live IPO bars (height = GMP %),
 * the brand's rising teal growth line, and money-flow particles from every desk to the core.
 * Pure presentation: no data is stored or sent anywhere. */
import * as THREE from './vendor/three.module.min.js';

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => 1 - Math.pow(1 - t, 3);

function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function badgeTexture(img) {
  const s = 512, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 10, 0, TAU); g.fillStyle = '#ffffff'; g.fill();
  g.lineWidth = 14; g.strokeStyle = '#2C8F93'; g.stroke();
  if (img) {
    g.save(); g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 26, 0, TAU); g.clip();
    const k = 0.98, w = s * k; g.drawImage(img, (s - w) / 2, (s - w) / 2, w, w); g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

const fresnelVert = `
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vP = position;
    vN = normalize(normalMatrix * normal); vV = normalize(-(viewMatrix * wp).xyz);
    gl_Position = projectionMatrix * viewMatrix * wp; }`;

const planetFrag = `
  uniform vec3 uColor; uniform vec3 uDeep; uniform float uTime; uniform float uHover; uniform float uSeed;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
  float noise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
  void main(){
    vec3 p = normalize(vP);
    float bands = sin(p.y * 9.0 + noise(p * 3.0 + uSeed) * 3.0 + uTime * 0.15) * 0.5 + 0.5;
    float n = noise(p * 6.0 + uSeed + uTime * 0.03);
    vec3 col = mix(uDeep, uColor, 0.35 + 0.45 * bands * (0.6 + 0.4 * n));
    float light = clamp(dot(vN, normalize(vec3(-0.4, 0.5, 0.8))), 0.0, 1.0);
    col *= 0.45 + 0.75 * light;
    float rim = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
    col += uColor * rim * (1.1 + uHover * 1.4);
    gl_FragColor = vec4(col, 1.0);
  }`;

const coreFrag = `
  uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){
    float rim = pow(1.0 - max(dot(vN, vV), 0.0), 2.0);
    float pulse = 0.85 + 0.15 * sin(uTime * 1.6);
    vec3 teal = vec3(0.50, 0.83, 0.84), green = vec3(0.37, 0.76, 0.16);
    vec3 col = mix(green, teal, smoothstep(-1.0, 1.0, normalize(vP).y + 0.3 * sin(uTime * 0.4)));
    gl_FragColor = vec4(col * rim * 1.6 * pulse, rim * 0.95);
  }`;

const starVert = `
  attribute float aSize; attribute float aPhase; attribute vec3 aColor;
  uniform float uTime; uniform float uPix; varying vec3 vC; varying float vA;
  void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
    vA = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 20.0); vC = aColor;
    gl_PointSize = aSize * uPix * (300.0 / -mv.z); gl_Position = projectionMatrix * mv; }`;
const starFrag = `
  varying vec3 vC; varying float vA;
  void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vC, a * vA); }`;

const lineFrag = `
  uniform float uTime; varying vec2 vUv;
  void main(){ float head = fract(uTime * 0.08);
    float d = abs(vUv.x - head); d = min(d, 1.0 - d);
    float glow = exp(-d * 28.0) * 1.6 + 0.28;
    vec3 col = mix(vec3(0.17,0.56,0.58), vec3(0.62,0.95,0.92), exp(-d * 18.0));
    gl_FragColor = vec4(col * glow, clamp(glow, 0.0, 1.0) * smoothstep(0.0, 0.06, vUv.x) * (1.0 - smoothstep(0.94, 1.0, vUv.x))); }`;
const lineVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

export function createCosmos(canvas, opts = {}) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
  const world = new THREE.Group(); scene.add(world);
  const system = new THREE.Group(); world.add(system);
  system.rotation.x = 0.32;

  const uniforms = { uTime: { value: 0 } };
  const disposables = [];

  /* ---------- stars ---------- */
  {
    const N = window.innerWidth < 700 ? 1800 : 3600;
    const pos = new Float32Array(N * 3), size = new Float32Array(N), phase = new Float32Array(N), col = new Float32Array(N * 3);
    const palette = [[1, 1, 1], [0.5, 0.83, 0.84], [0.55, 0.72, 0.94], [0.95, 0.8, 0.5]];
    for (let i = 0; i < N; i++) {
      const r = 120 + Math.random() * 520, th = Math.random() * TAU, ph = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th)], i * 3);
      size[i] = Math.random() < 0.06 ? 2.6 + Math.random() * 2 : 0.7 + Math.random() * 1.3;
      phase[i] = Math.random(); col.set(palette[Math.random() < 0.7 ? 0 : 1 + Math.floor(Math.random() * 3)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    const m = new THREE.ShaderMaterial({ uniforms: { uTime: uniforms.uTime, uPix: { value: DPR } }, vertexShader: starVert, fragmentShader: starFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const stars = new THREE.Points(g, m); scene.add(stars); disposables.push(g, m);
    stars.userData.spin = 0.004;
    world.userData.stars = stars;
  }

  /* ---------- nebula glows ---------- */
  const nebulae = [];
  [['rgba(127,211,214,.55)', -60, 18, -160, 260], ['rgba(95,194,42,.35)', 90, -30, -220, 300], ['rgba(141,184,240,.45)', 30, 50, -300, 340], ['rgba(232,176,74,.22)', -120, -50, -260, 280]]
    .forEach(([c, x, y, z, s]) => {
      const t = radialTexture([[0, c], [0.45, c.replace(/[\d.]+\)$/, '0.12)')], [1, 'rgba(0,0,0,0)']]);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
      sp.position.set(x, y, z); sp.scale.set(s, s, 1); scene.add(sp); nebulae.push(sp); disposables.push(t, sp.material);
    });

  /* ---------- core ---------- */
  const coreGeo = new THREE.SphereGeometry(3.1, 64, 64);
  const coreMat = new THREE.ShaderMaterial({ uniforms, vertexShader: fresnelVert, fragmentShader: coreFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const core = new THREE.Mesh(coreGeo, coreMat); system.add(core); disposables.push(coreGeo, coreMat);
  const ico = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(4.2, 1)),
    new THREE.LineBasicMaterial({ color: 0x7fd3d6, transparent: true, opacity: 0.18 }));
  system.add(ico); disposables.push(ico.geometry, ico.material);
  const coreGlowT = radialTexture([[0, 'rgba(127,211,214,.9)'], [0.25, 'rgba(95,194,42,.35)'], [0.6, 'rgba(14,39,64,.12)'], [1, 'rgba(0,0,0,0)']]);
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreGlowT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }));
  coreGlow.scale.set(22, 22, 1); system.add(coreGlow); disposables.push(coreGlowT, coreGlow.material);
  const badgeMat = new THREE.SpriteMaterial({ map: badgeTexture(null), transparent: true, depthTest: false });
  const badge = new THREE.Sprite(badgeMat); badge.scale.set(4.4, 4.4, 1); badge.renderOrder = 10; system.add(badge); disposables.push(badgeMat);
  if (opts.logo) {
    const img = new Image(); img.onload = () => { badgeMat.map.dispose(); badgeMat.map = badgeTexture(img); badgeMat.needsUpdate = true; }; img.src = opts.logo;
  }

  /* ---------- live IPO bar ring ---------- */
  const barRing = new THREE.Group(); system.add(barRing);
  let bars = [];
  function setBars(values) {
    bars.forEach((b) => { barRing.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose(); });
    bars = [];
    const list = (values && values.length ? values : Array.from({ length: 28 }, () => ({ v: Math.random() * 40 - 6 }))).slice(0, 64);
    const n = Math.max(list.length, 24), R = 6.2;
    for (let i = 0; i < n; i++) {
      const it = list[i % list.length], v = Math.max(-25, Math.min(120, it.v || 0));
      const h = 0.25 + Math.abs(v) / 120 * 4.2;
      const geo = new THREE.BoxGeometry(0.16, 1, 0.16); geo.translate(0, 0.5, 0);
      const up = v >= 0, c1 = new THREE.Color(up ? 0x2e7a06 : 0x7a1f1a), c2 = new THREE.Color(up ? (v > 30 ? 0x9ff0c0 : 0x5fc22a) : 0xff8a80);
      const colors = []; const p = geo.attributes.position;
      for (let k = 0; k < p.count; k++) { const c = p.getY(k) > 0.5 ? c2 : c1; colors.push(c.r, c.g, c.b); }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92 });
      const mesh = new THREE.Mesh(geo, mat); const a = i / n * TAU;
      mesh.position.set(Math.cos(a) * R, -0.2, Math.sin(a) * R); mesh.scale.y = 0.001; mesh.userData = { h: up ? h : h * 0.6, delay: i * 0.035 };
      barRing.add(mesh); bars.push({ mesh });
    }
    barsBorn = clock.elapsedTime;
  }
  const ringLine = new THREE.Mesh(new THREE.RingGeometry(5.95, 6.45, 128), new THREE.MeshBasicMaterial({ color: 0x7fd3d6, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
  ringLine.rotation.x = -Math.PI / 2; ringLine.position.y = -0.21; barRing.add(ringLine); disposables.push(ringLine.geometry, ringLine.material);

  /* ---------- rising teal growth line (the logo's chart line) ---------- */
  {
    const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14, a = t * TAU * 1.25 + 0.6, r = 9 + t * 16; pts.push(new THREE.Vector3(Math.cos(a) * r, -7 + t * 15 + Math.sin(t * 9) * 0.8, Math.sin(a) * r)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 400, 0.07, 8, false);
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: lineVert, fragmentShader: lineFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const tube = new THREE.Mesh(geo, mat); world.add(tube); disposables.push(geo, mat);
    const dotT = radialTexture([[0, 'rgba(190,250,245,1)'], [0.3, 'rgba(127,211,214,.6)'], [1, 'rgba(0,0,0,0)']], 64);
    for (let i = 1; i < pts.length; i += 2) {
      const d = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      d.position.copy(pts[i]); d.scale.set(1.3, 1.3, 1); world.add(d); disposables.push(d.material);
    }
    disposables.push(dotT);
  }

  /* ---------- module planets ---------- */
  const planets = [];
  const glowT = radialTexture([[0, 'rgba(255,255,255,.8)'], [0.2, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']]);
  disposables.push(glowT);
  (opts.modules || []).forEach((m, i, arr) => {
    const col = new THREE.Color(m.color), deep = new THREE.Color(m.color).multiplyScalar(0.18);
    const radius = 9 + i * 2.05, size = 0.9 + (i % 3) * 0.16;
    const pivot = new THREE.Group(); pivot.rotation.z = (i % 2 ? 1 : -1) * (0.05 + i * 0.025); system.add(pivot);
    const orbit = new THREE.Mesh(new THREE.RingGeometry(radius - 0.02, radius + 0.02, 180), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
    orbit.rotation.x = -Math.PI / 2; pivot.add(orbit); disposables.push(orbit.geometry, orbit.material);
    const mat = new THREE.ShaderMaterial({ uniforms: { uColor: { value: col }, uDeep: { value: deep }, uTime: uniforms.uTime, uHover: { value: 0 }, uSeed: { value: i * 3.7 } }, vertexShader: fresnelVert, fragmentShader: planetFrag });
    const geo = new THREE.SphereGeometry(size, 48, 48);
    const mesh = new THREE.Mesh(geo, mat); mesh.userData.id = m.id; disposables.push(geo, mat);
    const holder = new THREE.Group(); holder.add(mesh); pivot.add(holder);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
    glow.scale.set(size * 5, size * 5, 1); holder.add(glow); disposables.push(glow.material);
    if (i % 2 === 0) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(size * 1.45, size * 1.9, 64), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI / 2.3; holder.add(ring); disposables.push(ring.geometry, ring.material);
    }
    planets.push({ id: m.id, m, pivot, holder, mesh, mat, glow, radius, size, angle: (i / arr.length) * TAU + 0.4, speed: 0.055 / (1 + i * 0.32), hover: 0, label: opts.labels && opts.labels[m.id] });
  });

  /* ---------- money-flow particles (each desk feeding the core) ---------- */
  const flows = [];
  let flowPts;
  {
    const per = 26, total = per * Math.max(planets.length, 1);
    const pos = new Float32Array(total * 3), col = new Float32Array(total * 3), size = new Float32Array(total), phase = new Float32Array(total);
    planets.forEach((p, pi) => { const c = new THREE.Color(p.m.color); for (let k = 0; k < per; k++) { const idx = pi * per + k; col.set([c.r, c.g, c.b], idx * 3); size[idx] = 1.4 + Math.random() * 1.6; phase[idx] = Math.random(); flows.push({ p, t: Math.random(), speed: 0.12 + Math.random() * 0.18, idx, wob: Math.random() * TAU }); } });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1)); g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const m = new THREE.ShaderMaterial({ uniforms: { uTime: uniforms.uTime, uPix: { value: DPR * 0.35 } }, vertexShader: starVert, fragmentShader: starFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    flowPts = new THREE.Points(g, m); system.add(flowPts); disposables.push(g, m);
  }

  /* ---------- camera, interaction ---------- */
  const clock = new THREE.Clock();
  let barsBorn = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, inside: false };
  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let hovered = null, paused = false, focus = null, scrollK = 0, offsetX = 0, narrow = false;
  const camHome = new THREE.Vector3(0, 7, 38), camFrom = new THREE.Vector3(0, 46, 150);
  const camPos = new THREE.Vector3().copy(reduce ? camHome : camFrom), camLook = new THREE.Vector3();
  const intro = { t0: 0, dur: reduce ? 0.01 : 3.2 };
  camera.position.copy(camPos);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    offsetX = w > 1100 ? 12 : w > 800 ? 7 : 0;
    narrow = w < 800;
    camHome.set(0, narrow ? 4 : 7, narrow ? (h > w ? 66 : 50) : 38);
  }
  resize();
  window.addEventListener('resize', resize);
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1; pointer.inside = true;
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  function pick() {
    ndc.set(pointer.x, pointer.y); ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(planets.map((p) => p.mesh), false);
    return hits.length ? planets.find((p) => p.mesh === hits[0].object) : null;
  }
  canvas.addEventListener('click', (e) => { onMove(e); const p = pick(); if (p && opts.onPick) opts.onPick(p.id); });

  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  function planetWorld(p, out) { return p.mesh.getWorldPosition(out); }

  function frame() {
    if (paused) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    uniforms.uTime.value = t;
    const motion = reduce ? 0.15 : 1;

    // intro fly-in, then gentle orbit + parallax
    const k = Math.min((t - intro.t0) / intro.dur, 1), e = ease(k);
    pointer.sx = lerp(pointer.sx, pointer.x, 0.04); pointer.sy = lerp(pointer.sy, pointer.y, 0.04);
    world.position.x = lerp(world.position.x, focus ? 0 : offsetX, 0.05);
    world.position.y = lerp(world.position.y, narrow && !focus ? 17 : 0, 0.05);
    let target = tmp.copy(camFrom).lerp(camHome, e);
    target.x += pointer.sx * 3.2 * motion; target.y += pointer.sy * 2.0 * motion + scrollK * 10; target.z += scrollK * 22;
    let look = tmp2.set(world.position.x * 0.35, scrollK * -4, 0);
    if (focus) {
      const fp = planets.find((p) => p.id === focus);
      if (fp) { const wp = planetWorld(fp, new THREE.Vector3()); const sh = narrow ? 0 : -fp.size * 2.6; look.copy(wp).add(new THREE.Vector3(sh, narrow ? -fp.size * 1.2 : 0, 0)); target.copy(wp).add(new THREE.Vector3(sh, fp.size * 1.6, fp.size * (narrow ? 9 : 7.5))); }
    }
    camPos.lerp(target, focus ? 0.045 : (k < 1 ? 1 : 0.06)); camLook.lerp(look, 0.06);
    camera.position.copy(camPos); camera.lookAt(camLook);

    world.userData.stars.rotation.y += world.userData.stars.userData.spin * dt * motion;
    nebulae.forEach((n, i) => { n.material.rotation += dt * 0.01 * (i % 2 ? 1 : -1) * motion; });
    core.rotation.y += dt * 0.15 * motion; ico.rotation.y -= dt * 0.08 * motion; ico.rotation.x += dt * 0.03 * motion;
    barRing.rotation.y += dt * 0.05 * motion;
    bars.forEach((b) => { const u = b.mesh.userData, g = Math.min(Math.max((t - barsBorn - u.delay) / 1.4, 0), 1); b.mesh.scale.y = Math.max(0.001, u.h * ease(g) * (1 + 0.04 * Math.sin(t * 2 + u.delay * 40))); });

    // hover
    const hit = pointer.inside && !focus ? pick() : null;
    if (hit !== hovered) { hovered = hit; canvas.style.cursor = hit ? 'pointer' : ''; if (opts.onHover) opts.onHover(hit ? hit.id : null); }

    planets.forEach((p) => {
      if (!(focus && p.id === focus)) p.angle += p.speed * dt * motion;
      p.holder.position.set(Math.cos(p.angle) * p.radius, 0, Math.sin(p.angle) * p.radius);
      p.mesh.rotation.y += dt * 0.3 * motion;
      p.hover = lerp(p.hover, (hovered === p || focus === p.id) ? 1 : 0, 0.12);
      p.mat.uniforms.uHover.value = p.hover; const s = 1 + p.hover * 0.35; p.holder.scale.set(s, s, s);
    });

    // money flow along a curve from each planet to the core
    const arr = flowPts.geometry.attributes.position.array;
    flows.forEach((f) => {
      f.t += dt * f.speed * motion; if (f.t > 1) f.t -= 1;
      const hp = f.p.holder.position, u = f.t, inv = 1 - u;
      const cx = hp.x * 0.5 + Math.sin(f.wob) * 2, cy = 3 + Math.cos(f.wob) * 1.5, cz = hp.z * 0.5;
      const pv = f.p.pivot;
      const x = inv * inv * hp.x + 2 * inv * u * cx, y = inv * inv * hp.y + 2 * inv * u * cy, z = inv * inv * hp.z + 2 * inv * u * cz;
      tmp.set(x, y, z).applyEuler(pv.rotation);
      arr[f.idx * 3] = tmp.x; arr[f.idx * 3 + 1] = tmp.y; arr[f.idx * 3 + 2] = tmp.z;
    });
    flowPts.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);

    // project labels
    if (opts.labels) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      planets.forEach((p) => {
        const el = p.label; if (!el) return;
        planetWorld(p, tmp).project(camera);
        const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1 && !focus;
        el.style.transform = `translate(${((tmp.x + 1) / 2 * w).toFixed(1)}px, ${((1 - tmp.y) / 2 * h).toFixed(1)}px)`;
        el.classList.toggle('on', vis && k >= 1); el.classList.toggle('hot', hovered === p);
      });
    }
    raf = requestAnimationFrame(frame);
  }
  let raf = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => { if (document.hidden) api.pause(); else api.resume(); });

  const api = {
    setBars,
    focus(id) { focus = id || null; },
    setScroll(v) { scrollK = Math.max(0, Math.min(1, v)); },
    pause() { if (!paused) { paused = true; cancelAnimationFrame(raf); } },
    resume() { if (paused) { paused = false; clock.getDelta(); raf = requestAnimationFrame(frame); } },
    replayIntro() { if (!reduce) { camPos.copy(camFrom); intro.t0 = clock.elapsedTime; } },
    dispose() { api.pause(); disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); },
  };
  setBars(opts.bars);
  return api;
}
