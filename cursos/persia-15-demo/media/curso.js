/* HISTORIKA · motor de micro-cursos (reutilizable).
   Configuración en window.CURSO = { id, nombres:{l1:'…'}, quiz:[[pregunta,[opciones],correcta,explicación],…], aprobar:n } */
(function () {
  const C = window.CURSO || {};
  const ID = C.id || 'curso';
  const ga = (n, p) => { try { gtag('event', n, Object.assign({ curso: ID }, p || {})); } catch (e) {} };
  const ls = { get: k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  // ---------- Progreso por lecciones ----------
  const KEY = 'hk_' + ID; const st = Object.assign({ done: [], quiz: null }, ls.get(KEY) || {});
  const nLec = document.querySelectorAll('[data-done]').length; const total = nLec + (C.quiz ? 1 : 0);
  const aprobado = () => st.quiz !== null && st.quiz >= (C.aprobar || 1);
  function paint() {
    const n = st.done.length + (aprobado() ? 1 : 0); const p = total ? Math.round(100 * n / total) : 0;
    const bar = document.getElementById('bar'), pct = document.getElementById('pct');
    if (bar) bar.style.width = p + '%'; if (pct) pct.textContent = p + ' %';
    document.querySelectorAll('#toc li[data-l]').forEach(li => { const l = +li.dataset.l; const d = l <= nLec ? st.done.includes(l) : aprobado();
      li.classList.toggle('done', d); const ok = li.querySelector('.ok'); if (ok) ok.textContent = d ? '✓ LISTA' : 'PENDIENTE'; });
    document.querySelectorAll('[data-done]').forEach(b => { if (st.done.includes(+b.dataset.done)) { b.textContent = 'LEÍDA ✓'; b.classList.add('sec'); } });
  }
  document.querySelectorAll('[data-done]').forEach(b => b.onclick = () => { const l = +b.dataset.done;
    if (!st.done.includes(l)) { st.done.push(l); ls.set(KEY, st); ga('curso_leccion', { leccion: l }); }
    paint(); const nx = document.getElementById(l < nLec ? 'l' + (l + 1) : 'quiz'); nx && nx.scrollIntoView(); });

  // ---------- Quiz y certificado ----------
  const box = document.getElementById('qs');
  if (box && C.quiz) {
    const Q = C.quiz;
    box.innerHTML = Q.map((q, i) => `<div class="q" id="q${i}"><p>${i + 1}. ${q[0]}</p>${q[1].map((o, j) => `<label data-j="${j}"><input type="radio" name="q${i}" value="${j}">${o}</label>`).join('')}<div class="fb">${q[3]}</div></div>`).join('');
    const res = document.getElementById('res'), sc = document.getElementById('score'), msg = document.getElementById('msg'), rt = document.getElementById('retry');
    const showCert = () => { const c = document.getElementById('cert'); if (!c) return; c.style.display = 'block'; document.getElementById('fecha').textContent = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }); };
    document.getElementById('eval').onclick = () => {
      let ok = 0, miss = 0;
      Q.forEach((q, i) => { const el = document.getElementById('q' + i); const s = el.querySelector('input:checked'); if (!s) { miss++; return; }
        el.classList.add('r'); el.querySelectorAll('label').forEach(l => { l.classList.remove('ok', 'ko'); if (+l.dataset.j === q[2]) l.classList.add('ok'); else if (l.querySelector('input').checked) l.classList.add('ko'); });
        if (+s.value === q[2]) ok++; });
      res.style.display = 'block';
      if (miss) { sc.textContent = 'Casi'; msg.textContent = `Te faltan ${miss} pregunta(s) por responder.`; rt.style.display = 'none'; return; }
      st.quiz = ok; ls.set(KEY, st); paint(); ga('curso_quiz', { aciertos: ok }); sc.textContent = `${ok} de ${Q.length}`;
      if (ok >= (C.aprobar || 1)) { msg.textContent = C.msgOk || '¡Excelente!'; rt.style.display = 'none'; showCert(); ga('curso_completado', { aciertos: ok }); }
      else { msg.textContent = `Necesitas al menos ${C.aprobar} aciertos. Repasa las explicaciones en verde y vuelve a intentarlo.`; rt.style.display = 'inline-block'; }
      res.scrollIntoView({ block: 'center' });
    };
    rt.onclick = () => { document.querySelectorAll('.q').forEach(q => { q.classList.remove('r'); q.querySelectorAll('input').forEach(i => i.checked = false); q.querySelectorAll('label').forEach(l => l.classList.remove('ok', 'ko')); }); res.style.display = 'none'; document.getElementById('quiz').scrollIntoView(); };
    if (aprobado()) showCert();
  }
  paint();

  // ---------- Clips: se reproducen solos (sin audio) solo cuando están a la vista ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target;
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); if (!v.dataset.seen) { v.dataset.seen = 1; ga('curso_animacion', { clip: v.getAttribute('src') }); } }
      else v.pause(); }), { threshold: 0.35 });
    document.querySelectorAll('.clip video').forEach(v => io.observe(v));
  }

  // ---------- Música opcional ----------
  const mb = document.getElementById('mus'), au = document.getElementById('bgm');
  if (mb && au) { au.volume = 0.35; mb.onclick = () => {
    if (au.paused) au.play().then(() => { mb.classList.add('on'); mb.textContent = '♪ MÚSICA ON'; ga('curso_musica', { estado: 'on' }); }).catch(() => {});
    else { au.pause(); mb.classList.remove('on'); mb.textContent = '♪ MÚSICA'; } }; }

  // ---------- Continuar donde lo dejaste ----------
  (function () {
    const K = KEY + '_pos'; const secs = [...document.querySelectorAll('.lec[id]')]; const names = C.nombres || {};
    const saved = ls.get(K);
    if (saved && saved.id && saved.id !== 'l1' && !location.hash && document.getElementById(saved.id)) {
      const b = document.createElement('div'); b.className = 'resume';
      b.innerHTML = '<span>📖 Te quedaste en <b>' + (names[saved.id] || 'tu última lección') + '</b></span><button class="btn">CONTINUAR →</button><button class="x" aria-label="Cerrar">✕</button>';
      document.body.appendChild(b);
      b.querySelector('.btn').onclick = () => { const el = document.getElementById(saved.id); window.scrollTo({ top: el.offsetTop + (saved.off || 0) - 60, behavior: 'smooth' }); b.remove(); ga('curso_continuar', { leccion: saved.id }); };
      b.querySelector('.x').onclick = () => b.remove();
    }
    let t; window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(() => { const y = window.scrollY + 120; let cur = null;
      secs.forEach(s => { if (s.offsetTop <= y) cur = s; }); if (cur) ls.set(K, { id: cur.id, off: Math.max(0, y - 120 - cur.offsetTop) }); }, 400); }, { passive: true });
  })();

  // ---------- Mecanismos: renders 3D animados por pasos (uno o varios por curso) ----------
  document.querySelectorAll('.mec[data-imgs]').forEach(sec => {
    const srcs = sec.dataset.imgs.split(','); const caps = JSON.parse(sec.querySelector('script[type="application/json"]').textContent);
    const stage = sec.querySelector('.stage'), cv = sec.querySelector('canvas'), cx = cv.getContext('2d');
    const capEl = sec.querySelector('.cap'), btns = [...sec.querySelectorAll('[data-s]')], pb = sec.querySelector('.pl');
    const fx = sec.dataset.fx || ''; const DUR = 6500;
    const imgs = srcs.map(s => { const im = document.createElement('img'); im.src = s; im.alt = ''; im.className = 'mi'; stage.insertBefore(im, cv); return im; });
    let step = 0, t0 = performance.now(), playing = true, visible = false, paused = 0;
    function setStep(s) { step = s; t0 = performance.now();
      imgs.forEach((im, k) => { im.classList.toggle('on', k === s); im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; });
      capEl.innerHTML = caps[s]; btns.forEach((b, k) => b.classList.toggle('on', k === s)); }
    let touched = false;
    btns.forEach(b => b.onclick = () => { touched = true; setStep(+b.dataset.s); ga('curso_mecanismo', { mecanismo: sec.id, paso: +b.dataset.s + 1 }); });
    pb.onclick = () => { playing = !playing; pb.textContent = playing ? '❚❚' : '▶'; stage.classList.toggle('pause', !playing); if (playing) t0 = performance.now() - paused; };
    // partículas: 'polvo' (polvo de obra) o 'agua' (gotas que fluyen)
    const P = Array.from({ length: fx === 'agua' ? 90 : 60 }, () => ({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.8, v: .03 + Math.random() * .06, a: .2 + Math.random() * .5 }));
    function resize() { const r = stage.getBoundingClientRect(); const d = Math.min(devicePixelRatio, 2); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); }
    window.addEventListener('resize', resize);
    new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible && !sec.dataset.seen) { sec.dataset.seen = 1; ga('curso_mecanismo', { mecanismo: sec.id, paso: 'visto' }); if (!touched) setStep(0); } }, { threshold: .25 }).observe(stage);
    setStep(0); resize();
    let last = performance.now();
    (function loop(now) { requestAnimationFrame(loop); const dt = Math.min((now - last) / 1000, .1); last = now; if (!visible) return;
      if (playing) { if (now - t0 > DUR) setStep((step + 1) % imgs.length); } else paused = now - t0;
      const W = stage.clientWidth, H = stage.clientHeight; cx.clearRect(0, 0, W, H); if (!fx) return;
      P.forEach(p => { if (playing) { if (fx === 'agua') { p.x += p.v * dt * 1.4; if (p.x > 1.05) { p.x = -.05; p.y = Math.random(); } } else { p.y -= p.v * dt * .5; p.x += Math.sin(now / 900 + p.r) * .0004; if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); } } }
        cx.globalAlpha = p.a * (fx === 'agua' ? .7 : .45); cx.fillStyle = fx === 'agua' ? '#9fd8ff' : '#e8dcc8';
        cx.beginPath(); cx.arc(p.x * W, p.y * H, p.r, 0, 6.283); cx.fill(); });
      cx.globalAlpha = 1; })(performance.now());
  });
})();
