/* HISTORIKA · curso: clips al entrar en pantalla, música opcional y mecanismo 3D del calco */
(function () {
  const ga = (n, p) => { try { gtag('event', n, Object.assign({ curso: 'pompeya-15' }, p || {})); } catch (e) {} };

  // Clips: se reproducen solos (sin audio) solo cuando están a la vista
  const vids = document.querySelectorAll('.clip video');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); if (!v.dataset.seen) { v.dataset.seen = 1; ga('curso_animacion', { clip: v.getAttribute('src') }); } }
      else v.pause();
    }), { threshold: 0.35 });
    vids.forEach(v => io.observe(v));
  }

  // Música de fondo opcional (apagada por defecto)
  const mb = document.getElementById('mus'), au = document.getElementById('bgm');
  if (mb && au) {
    au.volume = 0.35;
    mb.onclick = () => {
      if (au.paused) { au.play().then(() => { mb.classList.add('on'); mb.textContent = '♪ MÚSICA ON'; mb.setAttribute('aria-pressed', 'true'); ga('curso_musica', { estado: 'on' }); }).catch(() => {}); }
      else { au.pause(); mb.classList.remove('on'); mb.textContent = '♪ MÚSICA'; mb.setAttribute('aria-pressed', 'false'); }
    };
  }

  // ---------- Mecanismo 3D: el calco de Fiorelli ----------
  const cv = document.getElementById('c3d');
  if (!cv || !window.THREE) return;
  const T = THREE;
  const CAPS = [
    '<b>1 · La ceniza lo cubre todo.</b> Capas de piedra pómez y ceniza fina sepultan a la víctima y se endurecen con el tiempo.',
    '<b>2 · Queda un hueco.</b> El cuerpo se descompone, pero la ceniza endurecida conserva su forma exacta como un molde.',
    '<b>3 · Fiorelli vierte yeso.</b> Los arqueólogos perforan la capa, encuentran el hueco y lo rellenan con yeso líquido.',
    '<b>4 · Aparece el calco.</b> Al retirar la ceniza, el yeso muestra la postura, la ropa y hasta los gestos del último instante.'
  ];
  const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
  const scene = new T.Scene(); scene.background = new T.Color(0x140508); scene.fog = new T.Fog(0x140508, 14, 30);
  const cam = new T.PerspectiveCamera(34, 1.6, 0.1, 100);
  scene.add(new T.HemisphereLight(0xffe7c4, 0x2a0b12, 0.4));
  const sun = new T.DirectionalLight(0xffd9a0, 1.25); sun.position.set(6, 10, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); scene.add(sun);
  const rim = new T.DirectionalLight(0xe9c46a, 0.5); rim.position.set(-7, 4, -6); scene.add(rim);

  // Suelo de excavación
  const floor = new T.Mesh(new T.CircleGeometry(14, 64), new T.MeshStandardMaterial({ color: 0x241712, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // Losas romanas bajo el cuerpo
  const slabMat = new T.MeshStandardMaterial({ color: 0x5e554c, roughness: .95 });
  for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) {
    const sl = new T.Mesh(new T.BoxGeometry(1.55, .12, 1.25), slabMat); sl.position.set(i * 1.6, .06, j * 1.3);
    sl.rotation.y = (Math.random() - .5) * .05; sl.receiveShadow = true; scene.add(sl);
  }

  // Figura humana estilizada (tumbada, encogida) hecha de cápsulas
  const fig = new T.Group();
  const part = (r, len, x, y, z, rx, ry, rz) => {
    const g = new T.CylinderGeometry(r, r, len, 16, 1);
    const m = new T.Mesh(g); m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
    const s1 = new T.Mesh(new T.SphereGeometry(r, 16, 12)); s1.position.y = len / 2; m.add(s1);
    const s2 = new T.Mesh(new T.SphereGeometry(r, 16, 12)); s2.position.y = -len / 2; m.add(s2);
    fig.add(m); return m;
  };
  const head = new T.Mesh(new T.SphereGeometry(.34, 24, 18)); head.position.set(-2.05, .45, .15); head.scale.set(1, .95, 1.1); fig.add(head);
  part(.42, 1.45, -.85, .45, 0, 0, 0, Math.PI / 2 + .08);         // torso
  part(.14, .75, -1.25, .42, .62, 0, .5, Math.PI / 2 - .3);        // brazo sup
  part(.12, .7, -1.75, .55, .85, .4, .9, 1.1);                     // antebrazo hacia la cara
  part(.14, .75, -1.2, .36, -.6, 0, -.4, Math.PI / 2 + .2);        // brazo 2
  part(.12, .65, -1.6, .3, -.95, 0, -.9, Math.PI / 2);
  part(.19, 1.0, .35, .38, .3, 0, -.35, Math.PI / 2 - .15);        // muslos (piernas encogidas)
  part(.19, 1.0, .3, .38, -.25, 0, .25, Math.PI / 2 - .1);
  part(.15, .95, .95, .32, .85, 0, .9, Math.PI / 2);               // pantorrillas
  part(.15, .95, 1.0, .3, .25, 0, .5, Math.PI / 2);
  fig.position.y = .14; scene.add(fig);
  const meshes = []; fig.traverse(o => { if (o.isMesh) { o.castShadow = true; meshes.push(o); } });

  // Materiales de la figura en cada fase
  const plane = new T.Plane(new T.Vector3(0, -1, 0), 0);           // corte para el yeso que sube
  const matBody = new T.MeshStandardMaterial({ color: 0x9a6b52, roughness: .75 });
  const matVoid = new T.MeshStandardMaterial({ color: 0x0c0405, roughness: 1, transparent: true, opacity: .9 });
  const matPlaster = new T.MeshStandardMaterial({ color: 0xf1ebe0, roughness: .55, clippingPlanes: [plane] });
  const matWire = new T.MeshBasicMaterial({ color: 0xe9c46a, wireframe: true, transparent: true, opacity: .35 });
  const ghost = fig.clone(); ghost.traverse(o => { if (o.isMesh) { o.material = matWire; o.castShadow = false; } }); scene.add(ghost);
  const cast = fig.clone(); cast.traverse(o => { if (o.isMesh) o.material = matPlaster; }); scene.add(cast);

  // Bloque de ceniza estratificado y recortado (vista en corte)
  const ash = new T.Group(); scene.add(ash);
  const cols = [0x6d6359, 0x8a7f72, 0x5b524a, 0x9b8f80, 0x746a5f];
  const layers = [];
  for (let k = 0; k < 5; k++) {
    const h = .32;
    const mat = new T.MeshStandardMaterial({ color: cols[k], roughness: 1, transparent: true, opacity: 1, side: T.DoubleSide,
      clippingPlanes: [new T.Plane(new T.Vector3(0, 0, -1), 0.05)] });   // recorte frontal: se ve el interior
    const L = new T.Mesh(new T.BoxGeometry(6.4, h, 3.6), mat); L.position.y = .12 + h / 2 + k * h; L.castShadow = L.receiveShadow = true;
    ash.add(L); layers.push(L);
  }
  // Lapilli (piedras pómez) cayendo
  const lap = []; const lapMat = new T.MeshStandardMaterial({ color: 0xc9bfae, roughness: 1 });
  for (let i = 0; i < 140; i++) { const p = new T.Mesh(new T.IcosahedronGeometry(.05 + Math.random() * .05, 0), lapMat);
    p.userData = { x: (Math.random() - .5) * 6.2, z: (Math.random() - .5) * 3.4, d: Math.random() * 4, sp: 2 + Math.random() * 2 }; scene.add(p); lap.push(p); }
  // Embudo de yeso
  const funnel = new T.Group();
  const fm = new T.MeshStandardMaterial({ color: 0xb8902f, metalness: .6, roughness: .35 });
  const cone = new T.Mesh(new T.CylinderGeometry(.45, .08, .7, 24, 1, true), fm); cone.position.y = .35; funnel.add(cone);
  const pipe = new T.Mesh(new T.CylinderGeometry(.06, .06, 1.6, 12), fm); pipe.position.y = -.8; funnel.add(pipe);
  const stream = new T.Mesh(new T.CylinderGeometry(.045, .045, 1.6, 10), new T.MeshStandardMaterial({ color: 0xf6f1e8, roughness: .4 }));
  stream.position.y = -.8; funnel.add(stream);
  funnel.position.set(-.8, 2.95, .2); scene.add(funnel);

  // ---- Línea de tiempo de los 4 pasos ----
  const DUR = [5, 4.5, 5.5, 6];   // segundos por paso
  let step = 0, t = 0, playing = true, last = performance.now();
  const capEl = document.getElementById('mcap'); const btns = [...document.querySelectorAll('#msteps [data-s]')];
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const clamp = x => Math.max(0, Math.min(1, x));
  function setStep(s) { step = s; t = 0; capEl.innerHTML = CAPS[s]; btns.forEach((b, i) => b.classList.toggle('on', i === s)); }
  btns.forEach(b => b.onclick = () => { setStep(+b.dataset.s); ga('curso_mecanismo', { paso: +b.dataset.s + 1 }); });
  const pb = document.getElementById('mplay'); pb.onclick = () => { playing = !playing; pb.textContent = playing ? '❚❚' : '▶'; };

  function apply(dt) {
    const p = clamp(t / DUR[step]);
    // estados base
    fig.visible = step === 0 || (step === 1 && p < .5);
    meshes.forEach(m => m.material = matBody);
    ghost.visible = step === 1 || step === 2;
    cast.visible = step >= 2;
    funnel.visible = step === 2;
    lap.forEach(l => l.visible = step === 0 && p < .85);
    let ashH = 1, ashOp = 1;
    if (step === 0) {
      ashH = ease(clamp(p / .85));
      lap.forEach(l => { const u = l.userData; const y = 4.2 - ((performance.now() / 1000 * u.sp + u.d) % 4.2); l.position.set(u.x, Math.max(y, .2 + ashH * 1.6), u.z); l.rotation.x += dt * 2; });
    }
    if (step === 1) { // el cuerpo se oscurece y desaparece; queda el hueco
      const k = clamp(p / .5);
      meshes.forEach(m => { m.material = matVoid; }); matVoid.opacity = .9 * (1 - k * .2);
      matWire.opacity = .15 + .25 * Math.sin(performance.now() / 300) ** 2;
    }
    if (step === 2) { // el yeso sube dentro del hueco
      plane.constant = .1 + ease(clamp((p - .1) / .8)) * 1.05;
      stream.scale.y = p < .9 ? 1 : 0.001;
      matWire.opacity = .3;
    } else plane.constant = 5;
    if (step === 3) { // se retira la ceniza capa a capa
      ashH = 1 - ease(clamp(p / .6)); ashOp = 1;
    }
    layers.forEach((L, k) => {
      const share = clamp(ashH * 5 - k); L.visible = share > 0.01; L.scale.y = Math.max(share, .001);
      L.position.y = .12 + .32 * k + .32 * share / 2; L.material.opacity = ashOp;
    });
    // cámara en órbita lenta
    const a = performance.now() / 9000;
    const r = step === 3 ? 7.4 : 8.6;
    cam.position.set(Math.sin(a) * 2.2 + .4, 4.6 + (step === 3 ? -.8 : 0), r);
    cam.lookAt(-.3, .7, 0);
  }

  function resize() { const w = cv.clientWidth, h = cv.clientHeight; if (!w) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  window.addEventListener('resize', resize);
  let visible = false;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible && !cv.dataset.seen) { cv.dataset.seen = 1; ga('curso_mecanismo', { paso: 'visto' }); } }, { threshold: .2 }).observe(cv);
  setStep(0); resize();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (!visible) return;
    if (playing) { t += dt; if (t > DUR[step]) setStep((step + 1) % 4); }
    apply(dt); renderer.render(scene, cam);
  })(performance.now());
})();
