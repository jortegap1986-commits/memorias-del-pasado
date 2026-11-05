// ── Memorias del Pasado — JS compartido para páginas de artículo standalone ──
function toggleMenu(){
  var nav=document.getElementById('hdr-nav');
  if(nav) nav.classList.toggle('open');
}
document.addEventListener('click',function(e){
  var nav=document.getElementById('hdr-nav');
  var btn=document.getElementById('menu-btn');
  if(nav && btn && !nav.contains(e.target) && !btn.contains(e.target)){
    nav.classList.remove('open');
  }
});

// ── GA4: tiempo de lectura y profundidad de scroll en este artículo ──
(function(){
  var articleId = document.body.getAttribute('data-article-id');
  var articleTitle = document.title.split(' · ')[0];
  var start = Date.now();
  var hit = {};
  function scrollCheck(){
    var el = document.querySelector('.art-body');
    if(!el) return;
    var rect = el.getBoundingClientRect();
    var total = el.offsetHeight || 1;
    var seen = Math.min(total, (window.scrollY + window.innerHeight) - (el.offsetTop));
    var pct = Math.max(0, Math.min(100, Math.round((seen/total)*100)));
    [25,50,75,90].forEach(function(m){
      if(pct>=m && !hit[m]){
        hit[m]=true;
        if(typeof gtag==='function'){
          gtag('event','article_scroll',{article_id:articleId,article_title:articleTitle,percent:m});
        }
      }
    });
  }
  window.addEventListener('scroll', scrollCheck);
  window.addEventListener('beforeunload', function(){
    if(typeof gtag==='function'){
      var secs = Math.round((Date.now()-start)/1000);
      gtag('event','article_read_time',{article_id:articleId,article_title:articleTitle,seconds:secs});
    }
  });
})();

// ── capa 2026: barra de progreso, relacionados, imán y pack al final de cada artículo ──
(function(){
  var CAT=[{"id": "acueducto-de-segovia", "t": "El Acueducto de Segovia: 2.000 Años sin una Gota de Argamasa", "img": "assets/img/acueducto-segovia1.jpg", "tags": "hispania ingenieria", "l": "Hispania · Ingeniería", "m": 12}, {"id": "ano-de-los-cuatro-emperadores", "t": "El Año de los Cuatro Emperadores", "img": "assets/img/roma/foro-senado.jpg", "tags": "roma", "l": "Roma · Política", "m": 9}, {"id": "asedio-de-tiro", "t": "El Asedio de Tiro: Siete Meses de Obstinación", "img": "assets/img/persia/alexander-cavalry.jpg", "tags": "persia batallas", "l": "Alejandro · Asedio", "m": 10}, {"id": "augusto-y-la-pax-romana", "t": "Augusto y la Pax Romana: El Arquitecto del Imperio", "img": "assets/img/roma/augusto-domus-poster.jpg", "tags": "roma", "l": "Roma · Augusto", "m": 9}, {"id": "batalla-de-issos", "t": "La Batalla de Issos: Darío III y la Huida del Gran Rey", "img": "assets/img/persia/formacion-griega.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 12}, {"id": "batalla-del-granico", "t": "La Batalla del Gránico: El Primer Choque de Alejandro contra Persia", "img": "assets/img/persia/caballeria-griega.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 14}, {"id": "batalla-gaugamela", "t": "Gaugamela: La Batalla que Destruyó el Imperio Persa", "img": "assets/img/persia/gaugamela1.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 11}, {"id": "batalla-teutoburgo", "t": "La Batalla del Bosque de Teutoburgo: El Desastre que Detuvo a Roma", "img": "assets/img/teutoburgo.jpg", "tags": "roma batallas", "l": "Roma · Germania · 9 dC", "m": 14}, {"id": "catedrales-goticas", "t": "Catedrales Góticas: Historia y Arquitectura que Tocó el Cielo", "img": "assets/img/og-image.jpg", "tags": "ingenieria", "l": "Arquitectura medieval", "m": 6}, {"id": "coliseo-romano-gladiadores", "t": "Coliseo Romano: Historia, Construcción y Gladiadores", "img": "assets/img/roma/ingenieros-puente.jpg", "tags": "roma ingenieria", "l": "Roma · Coliseo", "m": 8}, {"id": "conquista-de-persia", "t": "La Conquista de Persia: Cómo Alejandro Magno Destruyó el Mayor Imperio del Mundo Antiguo", "img": "assets/img/persia/alejandro-grande.jpg", "tags": "persia", "l": "Guía · Persia", "m": 7}, {"id": "crisis-del-siglo-iii", "t": "La Crisis del Siglo III: El Imperio al Borde del Colapso", "img": "assets/img/roma/crisis3-domus-poster.jpg", "tags": "roma", "l": "Roma · Siglo III", "m": 10}, {"id": "dario-y-el-imperio-persa", "t": "Darío III y la Caída del Imperio Persa", "img": "assets/img/dario2.jpg", "tags": "persia batallas", "l": "Persia · Darío III", "m": 13}, {"id": "falange-macedonia", "t": "Falange Macedonia: Armas y Táctica que Conquistaron el Mundo", "img": "assets/img/falange2.jpg", "tags": "persia batallas", "l": "Grecia · Táctica", "m": 14}, {"id": "fundacion-de-roma", "t": "La Fundación de Roma: Entre el Mito y la Arqueología", "img": "assets/img/roma/roma-republicana.jpg", "tags": "roma", "l": "Roma · Orígenes", "m": 12}, {"id": "guerras-punicas", "t": "Las Guerras Púnicas: Roma Contra Cartago (Resumen)", "img": "assets/img/roma/foro-republicano.jpg", "tags": "roma batallas", "l": "Roma · Cartago", "m": 10}, {"id": "imperio-romano", "t": "El Imperio Romano: De la Aldea del Lacio al Imperio que Definió Occidente", "img": "assets/img/roma/legion-marcha.jpg", "tags": "roma", "l": "Guía · Roma", "m": 7}, {"id": "incendio-de-persepolis", "t": "El Incendio de Persépolis: ¿Venganza o Accidente?", "img": "assets/img/persia/alejandro-grande.jpg", "tags": "persia", "l": "Persia · Persépolis", "m": 9}, {"id": "italica", "t": "Itálica: La Primera Ciudad que Roma Fundó Fuera de Italia", "img": "assets/img/italica1.jpg", "tags": "hispania roma", "l": "Hispania · Ciudad imperial", "m": 13}, {"id": "julio-cesar-rubicon", "t": "Julio César y el Cruce del Rubicón", "img": "assets/img/roma/foro-senado.jpg", "tags": "roma", "l": "Roma · César", "m": 9}, {"id": "legado-aquemenida", "t": "El Legado Aqueménida que Heredó Alejandro", "img": "assets/img/persia/gaugamela1.jpg", "tags": "persia", "l": "Persia · Legado", "m": 11}, {"id": "legiones-de-roma", "t": "Legiones Romanas: Armamento y Organización de Roma", "img": "assets/img/legion2.jpg", "tags": "roma batallas", "l": "Roma · Ejército", "m": 14}, {"id": "los-inmortales-persas", "t": "Los Inmortales: La Guardia de Élite del Gran Rey", "img": "assets/img/persia/falange-abierto.jpg", "tags": "persia batallas", "l": "Persia · Élite militar", "m": 10}, {"id": "los-pretorianos", "t": "Los Pretorianos: La Guardia que Hacía y Deshacía Emperadores", "img": "assets/img/roma/legion-marcha.jpg", "tags": "roma", "l": "Roma · Guardia imperial", "m": 8}, {"id": "maquinaria-de-guerra-romana", "t": "Maquinaria de Guerra Romana: La Ingeniería del Poder", "img": "assets/img/maquinaria2.jpg", "tags": "roma ingenieria batallas", "l": "Roma · Ingeniería de guerra", "m": 13}, {"id": "muerte-de-dario-iii", "t": "La Muerte de Darío III: Traición y el Fin del Imperio", "img": "assets/img/persia/dario-derrotado.jpg", "tags": "persia", "l": "Persia · Darío III", "m": 9}, {"id": "podcast-ep1-imperio-que-goberno-el-mundo", "t": "El Imperio que Gobernó el Mundo", "img": "assets/img/persia/podcast-ep1-mapa-persa-poster.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 1", "m": 9}, {"id": "podcast-ep2-choque-de-los-titanes", "t": "El Choque de los Titanes", "img": "assets/img/persia/podcast-ep2-alejandro-avance-poster.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 2", "m": 8}, {"id": "podcast-ep3-llanura-de-gaugamela", "t": "La Llanura de Gaugamela", "img": "assets/img/persia/podcast-ep3-babilonia-poster.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 3", "m": 9}, {"id": "pompeya-arte-y-vida", "t": "Pompeya: Arte, Vida y Revelaciones Eternas", "img": "assets/img/pompeya3.jpg", "tags": "pompeya roma", "l": "Pompeya · Vida cotidiana", "m": 14}, {"id": "pompeya-en-numeros", "t": "Pompeya en Números: La Catástrofe del 79 dC en Cifras", "img": "assets/img/pompeya-clip1-frame.jpg", "tags": "pompeya roma", "l": "Pompeya · Datos", "m": 7}, {"id": "pompeya-ultimo-dia", "t": "Pompeya: El Último Día de una Ciudad Eterna", "img": "assets/img/pompeya1.jpg", "tags": "pompeya roma", "l": "Pompeya · 79 dC", "m": 14}, {"id": "puertas-persas", "t": "Las Puertas Persas: La Única Victoria Persa Significativa", "img": "assets/img/persia/falange-persia.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 8}, {"id": "vesubio-ciencia-erupcion", "t": "El Vesubio en Erupción: La Ciencia Detrás de la Catástrofe", "img": "assets/img/pompeya-clip2-frame.jpg", "tags": "pompeya ingenieria", "l": "Vesubio · Vulcanología", "m": 9}];
  var me=location.pathname.split('/').pop().replace('.html','');
  var self=CAT.filter(function(a){return a.id===me})[0];
  // barra de progreso de lectura
  var bar=document.createElement('div');bar.id='read-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  var body=document.querySelector('.art-body');
  function prog(){if(!body)return;var r=body.getBoundingClientRect(),tot=body.offsetHeight||1,seen=Math.min(tot,Math.max(0,innerHeight-r.top));bar.style.transform='scaleX('+(seen/tot)+')';}
  addEventListener('scroll',prog,{passive:true});prog();
  // relacionados
  var tags=self?self.tags.split(' '):[];
  var rel=CAT.filter(function(a){return a.id!==me&&!/podcast/.test(a.tags)}).map(function(a){var s=a.tags.split(' ').filter(function(t){return tags.indexOf(t)>-1}).length;return [s+Math.random()*.3,a]}).sort(function(x,y){return y[0]-x[0]}).slice(0,3).map(function(x){return x[1]});
  var next=document.querySelector('.art-next')||document.querySelector('main');
  if(!next)return;
  var html='<section class="art-rel"><div class="art-rel-in"><div class="sec-label">Sigue leyendo</div><div class="art-rel-grid">'+rel.map(function(a){
    return '<a class="art-card" href="'+a.id+'.html" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_relacionado\',{article_id:\''+a.id+'\'});}"><div class="art-card-img"><img src="../'+a.img+'" alt="" loading="lazy"><span class="art-card-cat">'+a.l.toUpperCase()+'</span></div><div class="art-card-body"><h3 class="art-card-title">'+a.t+'</h3><div class="art-card-ft"><span class="art-card-meta">'+a.m+' min de lectura</span><span class="art-card-cta">Leer →</span></div></div></a>';
  }).join('')+'</div>'+
  '<div class="art-rel-cta"><div class="art-rel-box"><div class="sec-label">Gratis · PDF</div><h3>Tres recetas romanas auténticas</h3><p>Panis, moretum y libum, con la receta adaptada a hoy. Te lo mandamos al correo.</p><a href="../suscribete.html" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_revista_gratis\',{ubicacion:\'articulo\'});}">Quiero el PDF →</a></div>'+
  '<div class="art-rel-box dark"><div class="sec-label">Pack Colección 2026</div><h3>Las 9 revistas de 2026 por $12.99</h3><p>146 páginas ilustradas en PDF: emperadores, Persia, hititas, hallazgos y fronteras.</p><a href="https://historiaantigua.gumroad.com/l/coleccion2026?utm_source=web&utm_medium=articulo" target="_blank" rel="noopener" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_gumroad_pack\',{ubicacion:\'articulo\'});}">Ver el pack →</a></div></div></div></section>';
  next.insertAdjacentHTML('afterend',html);
})();
