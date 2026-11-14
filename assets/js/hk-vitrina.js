/* HISTORIKA · Vitrina de ventas (cursos + revistas + grupo).
   Para agregar un curso nuevo: añade un objeto a HK_CURSOS. Nada más. */
window.HK_GRUPO = 'https://www.facebook.com/groups/1164504891177213';
window.HK_CURSOS = [
  {
    id: 'ingenieria20',
    titulo: 'Ingeniería romana en 20 minutos',
    sub: 'Arcos, hormigón, acueductos y cloacas',
    desc: 'Por qué un arco se sostiene solo, cómo resiste la cúpula del Panteón, el agua que llegaba a Roma solo por gravedad y la Cloaca Máxima. Con dos mecanismos en render 3D.',
    min: 20, lecciones: 5, precio: '6,99',
    img: '/cursos/ingenieria-20-demo/img/cover.webp',
    demo: '/cursos/ingenieria-20-demo/',
    comprar: 'https://historiaantigua.gumroad.com/l/ingenieria20',
    extras: ['2 mecanismos 3D', 'Animaciones', 'Quiz', 'Certificado'],
    badge: 'NUEVO'
  },
  {
    id: 'pompeya15',
    titulo: 'Pompeya en 15 minutos',
    sub: 'La infancia bajo la ceniza',
    desc: 'Un armario sellado por el Vesubio, un collar de amuletos infantiles y el método para crear los famosos calcos de yeso, explicado con renders 3D.',
    min: 15, lecciones: 5, precio: '4,99',
    img: '/cursos/pompeya-15-demo/img/portada.webp',
    demo: '/cursos/pompeya-15-demo/',
    comprar: 'https://historiaantigua.gumroad.com/l/pompeya15',
    extras: ['Animaciones', 'Mecanismo 3D', 'Quiz', 'Certificado'],
    badge: ''
  }
];

(function () {
  const css = `
.hkv{--v:#2a0b12;--v2:#4a1520;--o:#e9c46a;--r:#b8202a;--p:#f3e9d7;font-family:'EB Garamond',Georgia,serif}
.hkv *{box-sizing:border-box}
.hkv-band{background:radial-gradient(ellipse at 50% 0%,#4a1520 0%,#2a0b12 55%,#140508 100%);color:var(--p);padding:56px 18px 60px}
.hkv-in{max-width:1180px;margin:0 auto}
.hkv-k{font-family:'Cinzel',serif;letter-spacing:.28em;font-size:.78rem;color:var(--o);text-align:center}
.hkv-h{font-family:'Cinzel',serif;font-weight:700;text-align:center;font-size:clamp(1.7rem,4.2vw,2.9rem);line-height:1.15;margin:.5rem 0 .6rem;color:#fff}
.hkv-h em{color:var(--o);font-style:normal}
.hkv-p{text-align:center;max-width:720px;margin:0 auto 2rem;font-size:1.15rem;opacity:.9}
.hkv-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:34px}
.hkv-tile{display:flex;gap:14px;align-items:center;text-decoration:none;color:var(--p);background:#ffffff0d;border:1px solid #e9c46a44;border-radius:10px;padding:16px 18px;transition:.2s}
.hkv-tile:hover{background:#e9c46a1f;border-color:var(--o);transform:translateY(-2px)}
.hkv-tile .i{font-size:1.9rem}
.hkv-tile b{font-family:'Cinzel',serif;display:block;font-size:1.05rem;color:#fff}
.hkv-tile span{font-size:.98rem;opacity:.8}
.hkv-st{font-family:'Cinzel',serif;color:var(--o);font-size:1.05rem;letter-spacing:.14em;margin:0 0 14px;display:flex;align-items:center;gap:12px}
.hkv-st:after{content:"";flex:1;height:1px;background:#e9c46a44}
.hkv-cursos{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(520px,100%),1fr));gap:18px}
.hkv-c{display:grid;grid-template-columns:42% 1fr;background:#fffaf0;color:#1a1208;border-radius:10px;overflow:hidden;box-shadow:0 18px 40px #0007}
.hkv-c .ph{position:relative;background:#140508 center/cover no-repeat;min-height:260px}
.hkv-c .bd{position:absolute;top:12px;left:12px;background:var(--r);color:#fff;font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.14em;padding:5px 10px;border-radius:20px}
.hkv-c .tx{padding:18px 18px 16px;display:flex;flex-direction:column}
.hkv-c .ty{font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.16em;color:#8a3f30}
.hkv-c h3{font-family:'Cinzel',serif;font-size:1.3rem;line-height:1.15;margin:.3rem 0 .1rem;color:#2a0b12}
.hkv-c .sb{font-style:italic;color:#4a3e2e;margin-bottom:.4rem}
.hkv-c p{font-size:1rem;line-height:1.45;color:#4a3e2e;margin:0 0 .6rem}
.hkv-c .ex{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:.8rem}
.hkv-c .ex span{font-size:.75rem;border:1px solid #b8861e55;color:#7a5a16;border-radius:20px;padding:2px 8px;font-family:'Cinzel',serif;letter-spacing:.04em}
.hkv-c .ft{margin-top:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hkv-c .pr{font-family:'Cinzel',serif;font-size:1.35rem;font-weight:700;color:#2a0b12;margin-right:auto}
.hkv-c .pr small{font-size:.6rem;color:#7a6e5e;letter-spacing:.1em;margin-left:3px}
.hkv-b{font-family:'Cinzel',serif;font-size:.74rem;letter-spacing:.1em;text-decoration:none;border-radius:4px;padding:.6rem .9rem;white-space:nowrap;transition:.2s;display:inline-block}
.hkv-b.buy{background:#b8861e;color:#fff}.hkv-b.buy:hover{background:#d4a832}
.hkv-b.demo{border:1px solid #b8861e;color:#7a5a16;background:#fff}.hkv-b.demo:hover{background:#f0dda0}
.hkv-soon{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border:1px dashed #e9c46a66;border-radius:10px;padding:26px;color:var(--p)}
.hkv-soon b{font-family:'Cinzel',serif;color:var(--o);font-size:1.15rem}
.hkv-soon p{opacity:.8;margin:.5rem 0 1rem}
.hkv-g{margin-top:34px;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;background:linear-gradient(90deg,#b8202a,#7a1520);border-radius:12px;padding:24px 28px;color:#fff}
.hkv-g h3{font-family:'Cinzel',serif;font-size:1.45rem;margin:0 0 .3rem}
.hkv-g p{margin:0;opacity:.92;font-size:1.05rem}
.hkv-b.gr{background:var(--o);color:#2a0b12;font-size:.85rem;padding:.85rem 1.3rem}.hkv-b.gr:hover{background:#fff}
@media(max-width:900px){.hkv-tiles{grid-template-columns:1fr}.hkv-g{grid-template-columns:1fr;text-align:center}}
@media(max-width:560px){.hkv-cursos{grid-template-columns:1fr}.hkv-c{grid-template-columns:1fr}.hkv-c .ph{min-height:200px}}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const ga = (n, p) => { try { gtag('event', n, p || {}); } catch (e) {} };
  const utm = (u, med, c) => u + (u.includes('?') ? '&' : '?') + 'utm_source=web&utm_medium=' + med + '&utm_campaign=' + c;

  function cursoCard(c, med) {
    return `<article class="hkv-c">
      <div class="ph" style="background-image:url('${c.img}')">${c.badge ? `<span class="bd">${c.badge}</span>` : ''}</div>
      <div class="tx"><div class="ty">MICRO-CURSO · ${c.min} MIN · ${c.lecciones} LECCIONES</div>
        <h3>${c.titulo}</h3><div class="sb">${c.sub}</div><p>${c.desc}</p>
        <div class="ex">${(c.extras || []).map(x => `<span>${x}</span>`).join('')}</div>
        <div class="ft"><span class="pr">$${c.precio.replace(',', '.')}<small>USD</small></span>
          <a class="hkv-b demo" href="${c.demo}" data-ev="demo" data-id="${c.id}">Demo gratis</a>
          <a class="hkv-b buy" href="${utm(c.comprar, med, c.id)}" target="_blank" rel="noopener" data-ev="buy" data-id="${c.id}">Comprar →</a></div>
      </div></article>`;
  }

  function render(el) {
    const modo = el.dataset.modo || 'tienda';            // 'tienda' | 'inicio'
    const med = modo === 'inicio' ? 'inicio' : 'tienda';
    const revistas = modo === 'inicio' ? '/tienda.html#sec-biblioteca' : '#sec-biblioteca';
    el.innerHTML = `<div class="hkv"><div class="hkv-band"><div class="hkv-in">
      <div class="hkv-k">${modo === 'inicio' ? 'LA TIENDA HISTORIKA' : 'TIENDA HISTORIKA'}</div>
      <h2 class="hkv-h">Aprende historia en minutos. <em>Léela gratis antes de comprar.</em></h2>
      <p class="hkv-p">Micro-cursos con animaciones, revistas ilustradas con avance gratuito y un grupo exclusivo donde lees toda la colección.</p>
      <div class="hkv-tiles">
        <a class="hkv-tile" href="#hkv-cursos" data-ev="tile_cursos"><span class="i">🎓</span><div><b>Micro-cursos</b><span>15 minutos · demo gratis</span></div></a>
        <a class="hkv-tile" href="/avances/" data-ev="tile_avances"><span class="i">📖</span><div><b>Hojea las revistas</b><span>Avance gratis de cada edición</span></div></a>
        <a class="hkv-tile" href="${window.HK_GRUPO}" target="_blank" rel="noopener" data-ev="tile_grupo"><span class="i">👥</span><div><b>Grupo exclusivo</b><span>Todas las revistas completas</span></div></a>
      </div>
      <div class="hkv-st" id="hkv-cursos">MICRO-CURSOS</div>
      <div class="hkv-cursos">${window.HK_CURSOS.map(c => cursoCard(c, med)).join('')}
        <div class="hkv-soon"><b>Nuevos cursos cada mes</b><p>Persia, el legionario romano, Constantinopla… Entérate primero en el grupo exclusivo.</p><a class="hkv-b gr" href="${window.HK_GRUPO}" target="_blank" rel="noopener" data-ev="grupo_proximos">QUIERO ENTERARME</a></div>
      </div>
      <div class="hkv-g"><div><h3>¿Quieres leer todas las revistas completas?</h3><p>En el grupo exclusivo tienes la biblioteca HISTORIKA entera, las ediciones nuevas apenas salen y la comunidad de historia antigua.</p></div>
        <a class="hkv-b gr" href="${window.HK_GRUPO}" target="_blank" rel="noopener" data-ev="grupo_banda">ÚNETE AL GRUPO</a></div>
      ${modo === 'inicio' ? `<p style="text-align:center;margin:26px 0 0"><a class="hkv-b demo" href="/tienda.html" data-ev="ver_tienda">Ver toda la tienda →</a></p>` : `<p style="text-align:center;margin:26px 0 0"><a class="hkv-b demo" href="${revistas}">Ver revistas y libros ↓</a></p>`}
    </div></div></div>`;
    el.addEventListener('click', e => { const a = e.target.closest('a[data-ev]'); if (!a) return;
      const ev = a.dataset.ev; if (ev === 'buy') ga('clic_comprar', { producto: a.dataset.id, seccion: 'vitrina_' + modo });
      else if (ev === 'demo') ga('clic_demo_curso', { curso: a.dataset.id, seccion: modo });
      else ga('vitrina_clic', { destino: ev, seccion: modo }); });
  }
  const go = () => document.querySelectorAll('[data-hk-vitrina]').forEach(render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
