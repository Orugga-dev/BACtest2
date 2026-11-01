/* ============================================================
   BAC · animaciones (GSAP + ScrollTrigger, alojados en assets/vendor/gsap)
   1) Cifras que cuentan hasta su número
   2) Tarjetas que aparecen escalonadas
   3) Movimiento suave del ala de la home
   4) Brillo que sigue al cursor sobre las tarjetas
   Se ejecuta ANTES de bac.js (que dibuja el logo, mezcla las tarjetas y arma el carrusel).
   Si GSAP no carga, o la persona tiene "reducir movimiento" (o usa ?sinmovimiento=1),
   no hace nada y la página queda con el comportamiento de siempre.
   ============================================================ */
(function(){
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]sinmovimiento/.test(location.search);
  if(reduce || !window.gsap || !window.ScrollTrigger){ root.classList.remove('fx-pre'); return; }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  root.classList.add('fx-on');

  function $(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var CLEAR = 'transform,opacity,visibility';   // al terminar se quitan los estilos inline para no pisar los :hover del CSS

  /* ---------- 1) y 2) cifras + tarjetas escalonadas ---------- */
  var STATS = '.metricbar > div, .ind > div, .mgrid > div';      // home, portfolio, para inversores
  // Cifras: "90+" -> prefijo "", número 90, sufijo "+"  |  "US$2M+" -> "US$", 2, "M+"  |  "~US$150k" -> "~US$", 150, "k"
  $(STATS).forEach(function(tile){
    var dt = tile.querySelector('dt');
    var m = dt && dt.textContent.trim().match(/^(\D*?)(\d+)(\D*)$/);
    if(!m) return;
    var pre = m[1], end = parseInt(m[2], 10), suf = m[3], final = dt.textContent.trim(), n = {v: 0};
    // la cifra es igual en ES y EN: se quita el atributo de traducción para que bac.js no le reescriba el valor final antes de contar
    dt.removeAttribute('data-es'); dt.removeAttribute('data-en');
    dt.textContent = pre + '0' + suf;
    tile._count = function(){
      gsap.to(n, {
        v: end, duration: 1.6, ease: 'power2.out',
        onUpdate: function(){ dt.textContent = pre + Math.round(n.v) + suf; },
        onComplete: function(){ dt.textContent = final; }      // el texto final es siempre el original
      });
    };
  });

  var GROUPS = [
    STATS,
    '.split > .card-aud',          // home: fundadores / inversores
    '.steps > .step',              // home: proceso
    '.team__grid > .member',       // home: equipo
    '.crit > .crit__card',         // fundadores / inversores: criterios
    '.flow > .fstep',              // fundadores / inversores: proceso
    '.bgrid > .bcard',             // fundadores: beneficios
    '.comm-grid > .comm-card',     // inversores: comunidad
    '.cos > .co'                   // portfolio: compañías
  ];
  GROUPS.forEach(function(sel){
    var items = $(sel);
    if(!items.length) return;
    items.forEach(function(el){
      el.classList.remove('reveal');                                              // reemplaza el aparecer simple de bac.js
      if(el.parentElement) el.parentElement.classList.remove('reveal');           // idem si el contenedor lo tenía
      el.style.transition = 'none';   // las tarjetas tienen "transition: all": se apaga mientras anima GSAP para que no se pisen
    });
    gsap.set(items, {autoAlpha: 0, y: 34});
    ST.batch(items, {
      start: 'top 90%', once: true, interval: 0.1,
      onEnter: function(batch){
        gsap.to(batch, {
          autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.13, clearProps: CLEAR, overwrite: true,
          onComplete: function(){
            // se devuelve la transición del CSS recién cuando ya se limpiaron los estilos de GSAP (así sigue andando el :hover)
            gsap.delayedCall(0.1, function(){ batch.forEach(function(el){ el.style.removeProperty('transition'); }); });
          }
        });
        batch.forEach(function(el, i){ if(el._count) gsap.delayedCall(0.25 + i * 0.13, el._count); });
      }
    });
  });
  root.classList.remove('fx-pre');   // ya están ocultas por GSAP: se libera la regla provisional del CSS

  /* ---------- 3) ala de la home: flota y se desplaza al hacer scroll ---------- */
  var art = document.querySelector('.heroB__art');
  var wing = document.querySelector('.heroB__art [data-bac-wing]');
  if(art && wing){
    var drift = gsap.to(wing, {y: -14, rotation: 0.9, duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true, transformOrigin: '50% 60%'});
    ST.create({trigger: '.heroB', start: 'top bottom', end: 'bottom top',
      onToggle: function(self){ if(self.isActive) drift.play(); else drift.pause(); }});     // no gasta batería fuera de pantalla
    gsap.to(art, {y: 70, ease: 'none', scrollTrigger: {trigger: '.heroB', start: 'top top', end: 'bottom top', scrub: 0.6}});
  }

  /* ---------- 4) brillo que sigue al cursor (solo con mouse) ---------- */
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    $('.card-aud, .pfcard, .crit__card, .bcard, .comm-card, ' + STATS).forEach(function(el){ el.classList.add('fx-spot'); });
    var raf = 0;
    document.addEventListener('pointermove', function(e){
      var el = e.target.closest && e.target.closest('.fx-spot');
      if(!el) return;
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function(){
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }, {passive: true});
  }

  // bac.js mezcla las tarjetas del portfolio justo después de este archivo: se recalculan las posiciones
  setTimeout(function(){ ST.refresh(); }, 0);
  window.addEventListener('load', function(){ ST.refresh(); });
})();
