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
