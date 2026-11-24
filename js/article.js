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
  var CAT=[{"id": "correo-persa-camino-real", "t": "El Correo del Gran Rey: Cómo Persia Cruzaba 2.500 km sin un Solo Motor", "img": "assets/img/cursos/correo-persa-camino-real_hero.jpg", "tags": "persia ingenieria", "l": "Persia · Ingeniería", "m": 4}, {"id": "qanats-rios-bajo-el-desierto", "t": "Qanats: los Ríos Escondidos que Hicieron Florecer el Desierto Persa", "img": "assets/img/cursos/qanats-rios-bajo-el-desierto_hero.jpg", "tags": "persia ingenieria", "l": "Persia · Ingeniería", "m": 4}, {"id": "yakhchal-hielo-en-el-desierto", "t": "Yakhchal: Cómo Hacían Hielo en Pleno Desierto sin Electricidad", "img": "assets/img/cursos/yakhchal-hielo-en-el-desierto_hero.jpg", "tags": "persia ingenieria", "l": "Persia · Ingeniería", "m": 4}, {"id": "arco-romano-como-se-sostiene", "t": "El Arco Romano: la Piedra que se Sostiene Sola", "img": "assets/img/cursos/arco-romano-como-se-sostiene_hero.jpg", "tags": "roma ingenieria", "l": "Roma · Ingeniería", "m": 4}, {"id": "hormigon-romano-que-se-repara-solo", "t": "El Hormigón Romano: la Piedra Líquida que se Repara Sola", "img": "assets/img/cursos/hormigon-romano-que-se-repara-solo_hero.jpg", "tags": "roma ingenieria", "l": "Roma · Ingeniería", "m": 4}, {"id": "calcos-de-pompeya-fiorelli", "t": "Los Calcos de Pompeya: Cómo Conocemos la Postura Exacta de las Víctimas del Vesubio", "img": "assets/img/cursos/calcos-de-pompeya-fiorelli_hero.jpg", "tags": "pompeya roma", "l": "Pompeya · Arqueología", "m": 4}, {"id": "puente-de-larsa-sin-iddinam", "t": "El Puente de Larsa: la Obra de 3.800 Años que Firmó un Rey de Mesopotamia", "img": "assets/img/hallazgos2/larsa_01.jpg", "tags": "hallazgos mesopotamia ingenieria", "l": "Mesopotamia · Ingeniería", "m": 4}, {"id": "lechos-funerarios-de-pompeya", "t": "Guerreros y Oro para el Último Viaje: los Lechos Funerarios de Pompeya", "img": "assets/img/hallazgos2/pompeya_01.jpg", "tags": "hallazgos pompeya roma", "l": "Pompeya · Hallazgo", "m": 4}, {"id": "epidauro-santuario-asclepio-pausanias", "t": "Epidauro: el Santuario de Asclepio que Describió Pausanias", "img": "assets/img/hallazgos2/epidauro_01.jpg", "tags": "hallazgos grecia", "l": "Grecia · Hallazgo", "m": 4}, {"id": "karkemish-inscripcion-astiru-ii", "t": "Karkemish: la Inscripción de 2.700 Años que por fin Encontró a su Rey", "img": "assets/img/hallazgos2/karkemish_01.jpg", "tags": "hallazgos mesopotamia", "l": "Anatolia · Hallazgo", "m": 4}, {"id": "acueducto-de-segovia", "t": "El Acueducto de Segovia: 2.000 Años sin una Gota de Argamasa", "img": "assets/img/acueducto-segovia1.jpg", "tags": "hispania ingenieria", "l": "Hispania · Ingeniería", "m": 12}, {"id": "ano-de-los-cuatro-emperadores", "t": "El Año de los Cuatro Emperadores", "img": "assets/img/roma/foro-senado.jpg", "tags": "roma", "l": "Roma · Política", "m": 9}, {"id": "asedio-de-tiro", "t": "El Asedio de Tiro: Siete Meses de Obstinación", "img": "assets/img/asedio-tiro.jpg", "tags": "persia batallas", "l": "Alejandro · Asedio", "m": 10}, {"id": "augusto-y-la-pax-romana", "t": "Augusto y la Pax Romana: El Arquitecto del Imperio", "img": "assets/img/roma/augusto-domus-poster.jpg", "tags": "roma", "l": "Roma · Augusto", "m": 9}, {"id": "batalla-de-issos", "t": "La Batalla de Issos: Darío III y la Huida del Gran Rey", "img": "assets/img/persia/formacion-griega.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 12}, {"id": "batalla-del-granico", "t": "La Batalla del Gránico: El Primer Choque de Alejandro contra Persia", "img": "assets/img/persia/caballeria-griega.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 14}, {"id": "batalla-gaugamela", "t": "Gaugamela: La Batalla que Destruyó el Imperio Persa", "img": "assets/img/persia/gaugamela-articulo.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 11}, {"id": "batalla-teutoburgo", "t": "La Batalla del Bosque de Teutoburgo: El Desastre que Detuvo a Roma", "img": "assets/img/teutoburgo-bosque.jpg", "tags": "roma batallas", "l": "Roma · Germania · 9 dC", "m": 14}, {"id": "catedrales-goticas", "t": "Catedrales Góticas: Historia y Arquitectura que Tocó el Cielo", "img": "assets/img/catedral-gotica.jpg", "tags": "ingenieria", "l": "Arquitectura medieval", "m": 6}, {"id": "coliseo-romano-gladiadores", "t": "Coliseo Romano: Historia, Construcción y Gladiadores", "img": "assets/img/roma-imperial.jpg", "tags": "roma ingenieria", "l": "Roma · Coliseo", "m": 8}, {"id": "conquista-de-persia", "t": "La Conquista de Persia: Cómo Alejandro Magno Destruyó el Mayor Imperio del Mundo Antiguo", "img": "assets/img/persia/alejandro-grande.jpg", "tags": "persia", "l": "Guía · Persia", "m": 7}, {"id": "crisis-del-siglo-iii", "t": "La Crisis del Siglo III: El Imperio al Borde del Colapso", "img": "assets/img/roma/crisis3-domus-poster.jpg", "tags": "roma", "l": "Roma · Siglo III", "m": 10}, {"id": "dario-y-el-imperio-persa", "t": "Darío III y la Caída del Imperio Persa", "img": "assets/img/dario2.jpg", "tags": "persia batallas", "l": "Persia · Darío III", "m": 13}, {"id": "falange-macedonia", "t": "Falange Macedonia: Armas y Táctica que Conquistaron el Mundo", "img": "assets/img/falange2.jpg", "tags": "persia batallas", "l": "Grecia · Táctica", "m": 14}, {"id": "fundacion-de-roma", "t": "La Fundación de Roma: Entre el Mito y la Arqueología", "img": "assets/img/roma/roma-republicana.jpg", "tags": "roma", "l": "Roma · Orígenes", "m": 12}, {"id": "guerras-punicas", "t": "Las Guerras Púnicas: Roma Contra Cartago (Resumen)", "img": "assets/img/punicas-alpes.jpg", "tags": "roma batallas", "l": "Roma · Cartago", "m": 10}, {"id": "imperio-romano", "t": "El Imperio Romano: De la Aldea del Lacio al Imperio que Definió Occidente", "img": "assets/img/roma/legion-marcha.jpg", "tags": "roma", "l": "Guía · Roma", "m": 7}, {"id": "incendio-de-persepolis", "t": "El Incendio de Persépolis: ¿Venganza o Accidente?", "img": "assets/img/persepolis-incendio.jpg", "tags": "persia", "l": "Persia · Persépolis", "m": 9}, {"id": "italica", "t": "Itálica: La Primera Ciudad que Roma Fundó Fuera de Italia", "img": "assets/img/italica1.jpg", "tags": "hispania roma", "l": "Hispania · Ciudad imperial", "m": 13}, {"id": "julio-cesar-rubicon", "t": "Julio César y el Cruce del Rubicón", "img": "assets/img/cesar-rubicon.jpg", "tags": "roma", "l": "Roma · César", "m": 9}, {"id": "legado-aquemenida", "t": "El Legado Aqueménida que Heredó Alejandro", "img": "assets/img/babilonia-avenida.jpg", "tags": "persia", "l": "Persia · Legado", "m": 11}, {"id": "legiones-de-roma", "t": "Legiones Romanas: Armamento y Organización de Roma", "img": "assets/img/legion3.jpg", "tags": "roma batallas", "l": "Roma · Ejército", "m": 14}, {"id": "los-inmortales-persas", "t": "Los Inmortales: La Guardia de Élite del Gran Rey", "img": "assets/img/inmortales-persas.jpg", "tags": "persia batallas", "l": "Persia · Élite militar", "m": 10}, {"id": "los-pretorianos", "t": "Los Pretorianos: La Guardia que Hacía y Deshacía Emperadores", "img": "assets/img/pretorianos.jpg", "tags": "roma", "l": "Roma · Guardia imperial", "m": 8}, {"id": "maquinaria-de-guerra-romana", "t": "Maquinaria de Guerra Romana: La Ingeniería del Poder", "img": "assets/img/maquinaria2.jpg", "tags": "roma ingenieria batallas", "l": "Roma · Ingeniería de guerra", "m": 13}, {"id": "muerte-de-dario-iii", "t": "La Muerte de Darío III: Traición y el Fin del Imperio", "img": "assets/img/persia/dario-carro.jpg", "tags": "persia", "l": "Persia · Darío III", "m": 9}, {"id": "podcast-ep1-imperio-que-goberno-el-mundo", "t": "El Imperio que Gobernó el Mundo", "img": "assets/img/persia/podcast1.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 1", "m": 9}, {"id": "podcast-ep2-choque-de-los-titanes", "t": "El Choque de los Titanes", "img": "assets/img/persia/alexander-cavalry.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 2", "m": 8}, {"id": "podcast-ep3-llanura-de-gaugamela", "t": "La Llanura de Gaugamela", "img": "assets/img/babilonia-avenida.jpg", "tags": "persia podcast", "l": "Podcast · Ep. 3", "m": 9}, {"id": "pompeya-arte-y-vida", "t": "Pompeya: Arte, Vida y Revelaciones Eternas", "img": "assets/img/pompeya3.jpg", "tags": "pompeya roma", "l": "Pompeya · Vida cotidiana", "m": 14}, {"id": "pompeya-en-numeros", "t": "Pompeya en Números: La Catástrofe del 79 dC en Cifras", "img": "assets/img/pompeya-clip1-frame.jpg", "tags": "pompeya roma", "l": "Pompeya · Datos", "m": 7}, {"id": "pompeya-ultimo-dia", "t": "Pompeya: El Último Día de una Ciudad Eterna", "img": "assets/img/pompeya1.jpg", "tags": "pompeya roma", "l": "Pompeya · 79 dC", "m": 14}, {"id": "puertas-persas", "t": "Las Puertas Persas: La Única Victoria Persa Significativa", "img": "assets/img/puertas-persas.jpg", "tags": "persia batallas", "l": "Persia · Batalla", "m": 8}, {"id": "vesubio-ciencia-erupcion", "t": "El Vesubio en Erupción: La Ciencia Detrás de la Catástrofe", "img": "assets/img/pompeya-clip2-frame.jpg", "tags": "pompeya ingenieria", "l": "Vesubio · Vulcanología", "m": 9}];
  window.__HK_CAT=CAT;var me=location.pathname.split('/').pop().replace('.html','');
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
    return '<a class="art-card" href="'+a.id+'.html" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_relacionado\',{article_id:\''+a.id+'\'});}"><div class="art-card-img"><picture><source type="image/webp" srcset="../'+a.img.replace(/\.(jpg|png)$/,'-480.webp')+' 480w, ../'+a.img.replace(/\.(jpg|png)$/,'-960.webp')+' 960w" sizes="(max-width: 900px) 100vw, 33vw"><img src="../'+a.img+'" alt="" loading="lazy"></picture><span class="art-card-cat">'+a.l.toUpperCase()+'</span></div><div class="art-card-body"><h3 class="art-card-title">'+a.t+'</h3><div class="art-card-ft"><span class="art-card-meta">'+a.m+' min de lectura</span><span class="art-card-cta">Leer →</span></div></div></a>';
  }).join('')+'</div>'+
  '<div class="art-rel-cta"><div class="art-rel-box"><div class="sec-label">Gratis · PDF</div><h3>Tres recetas romanas auténticas</h3><p>Panis, moretum y libum, con la receta adaptada a hoy. Te lo mandamos al correo.</p><a href="../suscribete.html" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_revista_gratis\',{ubicacion:\'articulo\'});}">Quiero el PDF →</a></div>'+
  '<div class="art-rel-box dark"><div class="sec-label">Pack Colección 2026</div><h3>Las 9 revistas de 2026 por $12.99</h3><p>146 páginas ilustradas en PDF: emperadores, Persia, hititas, hallazgos y fronteras.</p><a href="https://historiaantigua.gumroad.com/l/coleccion2026?utm_source=web&utm_medium=articulo" target="_blank" rel="noopener" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_gumroad_pack\',{ubicacion:\'articulo\'});}">Ver el pack →</a></div></div></div></section>';
  next.insertAdjacentHTML('afterend',html);
})();
// ── producto relacionado dentro del artículo (curso o revista según el tema) ──
(function(){
  var P={
    pompeya:{k:'MICRO-CURSO · LECCIÓN GRATIS',t:'Pompeya en 15 minutos',d:'Cómo se hacían los calcos de yeso de las víctimas, explicado con un mecanismo 3D animado.',img:'../cursos/pompeya-15-demo/img/portada.webp',u:'../cursos/pompeya-15-demo/',c:'pompeya15'},
    persia:{k:'MICRO-CURSO · LECCIÓN GRATIS',t:'Persia en 15 minutos',d:'Ciro, Darío, el correo de relevos y los qanats, con dos mecanismos en render 3D.',img:'../cursos/persia-15-demo/img/cover.webp',u:'../cursos/persia-15-demo/',c:'persia15'},
    ingenieria:{k:'MICRO-CURSO · LECCIÓN GRATIS',t:'Ingeniería romana en 20 minutos',d:'Por qué un arco se sostiene solo, el hormigón del Panteón y el agua que llegaba a Roma por gravedad.',img:'../cursos/ingenieria-20-demo/img/cover.webp',u:'../cursos/ingenieria-20-demo/',c:'ingenieria20'},
    hallazgos:{k:'REVISTA · AVANCE GRATIS',t:'Hallazgos II · Noviembre 2026',d:'El puente de Babilonia y tres descubrimientos más, en 14 páginas ilustradas.',img:'../avances/hallazgos-ii/p/01.webp',u:'../avances/hallazgos-ii/',c:'hallazgos2'},
    roma:{k:'REVISTA · AVANCE GRATIS',t:'Los diez emperadores',d:'De Augusto a Constantino: diez vidas que construyeron y casi destruyeron Roma, en 24 páginas.',img:'../avances/emperadores/p/01.webp',u:'../avances/emperadores/',c:'emperadores'}
  };
  var ORD=['hallazgos','pompeya','persia','ingenieria','hispania','roma'];
  var me=location.pathname.split('/').pop().replace('.html','');
  var m=(document.body.getAttribute('data-producto')||'');
  if(!m){var src=document.querySelector('script[data-tags]');var tg=(window.ART_TAGS||'')+' ';
    try{var c=(window.__HK_CAT||[]).filter(function(a){return a.id===me})[0];if(c)tg+=c.tags;}catch(e){}
    ORD.some(function(k){if((' '+tg+' ').indexOf(' '+k+' ')>-1){m=(k==='hispania'?'ingenieria':k);return true;}});}
  var p=P[m]; var body=document.querySelector('.art-body'); if(!p||!body)return;
  var ps=[].filter.call(body.children,function(e){return e.tagName==='P'}); if(ps.length<3)return;
  var at=ps[Math.max(2,Math.floor(ps.length*0.45))]||ps[ps.length-1];
  var url=p.u+'?utm_source=web&utm_medium=articulo&utm_campaign='+p.c;
  var css='<style>.hk-prod{display:grid;grid-template-columns:150px 1fr;gap:18px;align-items:center;margin:30px 0;padding:16px;background:#2a0b12;color:#f3e9d7;border-radius:8px;text-decoration:none;box-shadow:0 10px 28px #0003}.hk-prod img{width:150px;height:110px;object-fit:cover;border-radius:5px}.hk-prod .k{font-family:Cinzel,serif;font-size:11px;letter-spacing:.16em;color:#e9c46a}.hk-prod b{display:block;font-family:Cinzel,serif;font-size:19px;color:#fff;margin:4px 0}.hk-prod p{margin:0 0 8px!important;font-size:16px!important;line-height:1.4!important;color:#e8dccb!important}.hk-prod .go{display:inline-block;background:#e9c46a;color:#2a0b12;border-radius:20px;padding:6px 14px;font-family:Cinzel,serif;font-size:12px;letter-spacing:.06em}@media(max-width:560px){.hk-prod{grid-template-columns:1fr}.hk-prod img{width:100%;height:160px}}</style>';
  at.insertAdjacentHTML('afterend',css+'<a class="hk-prod" href="'+url+'" onclick="if(typeof gtag===\'function\'){gtag(\'event\',\'clic_producto_articulo\',{producto:\''+p.c+'\',article_id:\''+me+'\'});}"><img src="'+p.img+'" alt="" loading="lazy"><span><span class="k">'+p.k+'</span><b>'+p.t+'</b><p>'+p.d+'</p><span class="go">Probar gratis →</span></span></a>');
})();
