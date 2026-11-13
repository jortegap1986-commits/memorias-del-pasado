/* Lector HISTORIKA — revista con efecto de pasar páginas (StPageFlip, MIT). */
(function () {
  const C = window.REVISTA;
  const pad = n => String(n).padStart(2, '0');
  const src = i => `p/${pad(i)}.webp`;
  const thumb = i => `p/t${pad(i)}.webp`;
  document.title = C.titulo + ' · HISTORIKA';
  document.querySelector('.lx-title').textContent = C.titulo;

  // Precarga con barra de progreso
  const bar = document.querySelector('.lx-load .bar i');
  let loaded = 0;
  const imgs = [];
  for (let i = 1; i <= C.paginas; i++) {
    const im = new Image();
    im.onload = im.onerror = () => { loaded++; bar.style.width = (100 * loaded / C.paginas) + '%'; if (loaded === C.paginas) start(); };
    im.src = src(i); imgs.push(im);
  }

  let pf;
  function size() {
    const st = document.querySelector('.lx-stage');
    const portrait = window.innerWidth < 760;
    const availH = st.clientHeight - 16, availW = st.clientWidth - (portrait ? 16 : 120);
    let h = availH, w = h * C.ratio;
    const pages = portrait ? 1 : 2;
    if (w * pages > availW) { w = availW / pages; h = w / C.ratio; }
    return { w: Math.floor(w), h: Math.floor(h), portrait };
  }

  function start() {
    const book = document.getElementById('book');
    for (let i = 1; i <= C.paginas; i++) {
      const d = document.createElement('div');
      d.className = 'lx-page';
      d.dataset.density = (i === 1 || i === C.paginas) ? 'hard' : 'soft';
      d.innerHTML = `<img src="${src(i)}" alt="Página ${i}">`;
      book.appendChild(d);
    }
    const s = size();
    pf = new St.PageFlip(book, {
      width: s.w, height: s.h, size: 'fixed', showCover: true, usePortrait: s.portrait,
      maxShadowOpacity: 0.55, mobileScrollSupport: false, flippingTime: 900, drawShadow: true
    });
    pf.loadFromHTML(book.querySelectorAll('.lx-page'));
    pf.on('flip', upd);
    upd();
    const L = document.querySelector('.lx-load');
    L.style.opacity = 0; setTimeout(() => L.remove(), 600);
    setTimeout(() => { const h = document.querySelector('.lx-hint'); if (h) h.style.opacity = 0; }, 4000);
    buildThumbs();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => location.reload(), 400); });
  }

  function upd() {
    const i = pf.getCurrentPageIndex() + 1;
    const n = C.paginas;
    const portrait = pf.getOrientation && pf.getOrientation() === 'portrait';
    let label = `${i} / ${n}`;
    if (!portrait && i > 1 && i < n) { const a = i % 2 === 0 ? i : i - 1; label = `${a}-${Math.min(a + 1, n)} / ${n}`; }
    document.querySelector('.lx-count').textContent = label;
    document.querySelectorAll('.lx-thumbs figure').forEach((f, k) => f.classList.toggle('cur', k + 1 === i));
  }

  function buildThumbs() {
    const T = document.querySelector('.lx-thumbs');
    for (let i = 1; i <= C.paginas; i++) {
      const f = document.createElement('figure');
      f.innerHTML = `<img src="${thumb(i)}" alt=""><figcaption>${i}</figcaption>`;
      f.onclick = () => { pf.flip(i - 1); T.classList.remove('open'); };
      T.appendChild(f);
    }
  }

  document.querySelector('.lx-prev').onclick = () => pf && pf.flipPrev();
  document.querySelector('.lx-next').onclick = () => pf && pf.flipNext();
  document.getElementById('b-prev').onclick = () => pf && pf.flipPrev();
  document.getElementById('b-next').onclick = () => pf && pf.flipNext();
  document.getElementById('b-thumbs').onclick = () => document.querySelector('.lx-thumbs').classList.toggle('open');
  document.getElementById('b-full').onclick = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
    else document.exitFullscreen();
  };
  const Z = document.querySelector('.lx-zoom');
  document.getElementById('b-zoom').onclick = () => {
    const i = pf.getCurrentPageIndex() + 1;
    Z.querySelector('.pages').innerHTML = `<img src="${src(i)}" alt="">` + (i > 1 && i < C.paginas && window.innerWidth >= 760 ? `<img src="${src(i + 1)}" alt="">` : '');
    Z.classList.add('open');
  };
  Z.onclick = () => Z.classList.remove('open');
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') pf && pf.flipNext();
    if (e.key === 'ArrowLeft') pf && pf.flipPrev();
    if (e.key === 'Escape') { Z.classList.remove('open'); document.querySelector('.lx-thumbs').classList.remove('open'); }
  });
})();
