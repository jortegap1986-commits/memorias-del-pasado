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

  // ---------- Mecanismo: el calco de Fiorelli (renders 3D animados) ----------
  const stage = document.querySelector('#mec-calco .stage');
  if (!stage) return;
  const CAPS = [
    '<b>1 · La ceniza lo cubre todo.</b> Capas de piedra pómez y ceniza fina sepultan a la víctima y se endurecen con el tiempo.',
    '<b>2 · Queda un hueco.</b> El cuerpo se descompone, pero la ceniza endurecida conserva su forma exacta como un molde.',
    '<b>3 · Fiorelli vierte yeso.</b> Los arqueólogos perforan la capa, encuentran el hueco y lo rellenan con yeso líquido.',
    '<b>4 · Aparece el calco.</b> Al retirar la ceniza, el yeso muestra la postura, la ropa y hasta los gestos del último instante.'
  ];
  const DUR = 6500;
  const cvs = stage.querySelector('canvas');
  const imgs = [1, 2, 3, 4].map(n => { const im = document.createElement('img'); im.src = 'media/calco' + n + '.webp'; im.alt = ''; im.className = 'mi'; stage.insertBefore(im, cvs); return im; });
  const cv = document.getElementById('c3d'); const cx = cv.getContext('2d');
  const capEl = document.getElementById('mcap'); const btns = [...document.querySelectorAll('#msteps [data-s]')];
  let step = 0, t0 = performance.now(), playing = true, visible = false, paused = 0;
  function setStep(s) {
    step = s; t0 = performance.now();
    imgs.forEach((im, k) => { im.classList.toggle('on', k === s); im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; });
    capEl.innerHTML = CAPS[s]; btns.forEach((b, k) => b.classList.toggle('on', k === s));
  }
  btns.forEach(b => b.onclick = () => { setStep(+b.dataset.s); ga('curso_mecanismo', { paso: +b.dataset.s + 1 }); });
  const pb = document.getElementById('mplay');
  pb.onclick = () => { playing = !playing; pb.textContent = playing ? '❚❚' : '▶'; stage.classList.toggle('pause', !playing); if (playing) t0 = performance.now() - paused; };
  // partículas de ceniza (solo en el paso 1)
  const P = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 2.2, v: .04 + Math.random() * .09, d: (Math.random() - .5) * .02, a: .25 + Math.random() * .6 }));
  function resize() { const r = stage.getBoundingClientRect(); const d = Math.min(devicePixelRatio, 2); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  window.addEventListener('resize', resize);
  new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible && !stage.dataset.seen) { stage.dataset.seen = 1; ga('curso_mecanismo', { paso: 'visto' }); setStep(0); } }, { threshold: .25 }).observe(stage);
  setStep(0); resize();
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, .1); last = now;
    if (!visible) return;
    if (playing) { if (now - t0 > DUR) setStep((step + 1) % 4); } else paused = now - t0;
    const W = stage.clientWidth, H = stage.clientHeight; cx.clearRect(0, 0, W, H);
    if (step === 0) {
      P.forEach(p => { if (playing) { p.y += p.v * dt * 1.6; p.x += p.d * dt; if (p.y > 1.05) { p.y = -.05; p.x = Math.random(); } }
        cx.globalAlpha = p.a; cx.fillStyle = p.r > 2 ? '#e8e2d6' : '#b9b1a5'; cx.beginPath(); cx.arc(p.x * W, p.y * H * .8, p.r, 0, 6.283); cx.fill(); });
      cx.globalAlpha = 1;
    }
  })(performance.now());
})();
