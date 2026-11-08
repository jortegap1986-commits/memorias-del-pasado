// Menú estándar: abrir/cerrar en móvil y cabecera compacta al hacer scroll
function toggleMenu(){var n=document.getElementById('hdr-nav');if(n)n.classList.toggle('open');}
document.addEventListener('click',function(e){var n=document.getElementById('hdr-nav'),b=document.getElementById('menu-btn');if(n&&b&&!n.contains(e.target)&&!b.contains(e.target))n.classList.remove('open');});
(function(){var h=document.getElementById('header');if(!h)return;var t=false;function f(){t=false;h.classList.toggle('scrolled',scrollY>12);}addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(f);}},{passive:true});f();})();
