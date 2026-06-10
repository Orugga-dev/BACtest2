/* ============================================================
   BAC · shared behaviour
   - injects redrawn logo lockups / wing symbol (transparent)
   - bilingual ES/EN toggle (persisted)
   - mobile nav, scroll reveal
   ============================================================ */
(function(){
  /* ---------- Logo geometry (redrawn from the manual, transparent) ---------- */
  function wing(variant){
    // variant: 'light' (on light bg) | 'dark' (on dark bg)
    var body = variant==='dark'
      ? '<path d="M6,72 Q10,42 32,18 Q46,6 60,8 Q50,16 40,26 Q26,42 20,70 Z" fill="#26215C" stroke="#AFA9EC" stroke-width="0.7" opacity="0.55"/>'
      : '<path d="M6,72 Q10,42 32,18 Q46,6 60,8 Q50,16 40,26 Q26,42 20,70 Z" fill="#3C3489" stroke="#7F77DD" stroke-width="0.7" opacity="0.35"/>';
    var first = variant==='dark' ? '#3C3489' : '#26215C';
    return '<svg class="bac-wing" viewBox="14 8 56 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<g transform="translate(10,6)">'
      + body
      + '<path d="M20,70 Q22,50 34,32" fill="none" stroke="'+first+'" stroke-width="2.2" stroke-linecap="round"/>'
      + '<path d="M26,63 Q30,44 42,26" fill="none" stroke="#3C3489" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M32,56 Q38,40 50,24" fill="none" stroke="#534AB7" stroke-width="1.7" stroke-linecap="round"/>'
      + '<path d="M38,48 Q46,34 58,20" fill="none" stroke="#7F77DD" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M44,40 Q52,28 60,16" fill="none" stroke="#9B8FE8" stroke-width="1.1" stroke-linecap="round"/>'
      + '<path d="M32,18 Q46,8 60,10" fill="none" stroke="'+(variant==='dark'?'#CCC8F7':'#AFA9EC')+'" stroke-width="0.9" stroke-linecap="round"/>'
      + '</g></svg>';
  }

  function lockup(variant){
    // full horizontal lockup, transparent bg
    var bac   = variant==='dark' ? '#FFFFFF' : '#26215C';
    var desc  = variant==='dark' ? '#9B8FE8' : '#534AB7';
    var endor = variant==='dark' ? '#FFFFFF' : '#26215C';
    return '<svg class="bac-lockup" viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BAC Business Angels Club EmprendeIAE">'
      + '<g transform="translate(2,6)">'
      + (variant==='dark'
          ? '<path d="M6,72 Q10,42 32,18 Q46,6 60,8 Q50,16 40,26 Q26,42 20,70 Z" fill="#26215C" stroke="#AFA9EC" stroke-width="0.7" opacity="0.55"/>'
          : '<path d="M6,72 Q10,42 32,18 Q46,6 60,8 Q50,16 40,26 Q26,42 20,70 Z" fill="#3C3489" stroke="#7F77DD" stroke-width="0.7" opacity="0.35"/>')
      + '<path d="M20,70 Q22,50 34,32" fill="none" stroke="'+(variant==='dark'?'#3C3489':'#26215C')+'" stroke-width="2.2" stroke-linecap="round"/>'
      + '<path d="M26,63 Q30,44 42,26" fill="none" stroke="#3C3489" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M32,56 Q38,40 50,24" fill="none" stroke="#534AB7" stroke-width="1.7" stroke-linecap="round"/>'
      + '<path d="M38,48 Q46,34 58,20" fill="none" stroke="#7F77DD" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M44,40 Q52,28 60,16" fill="none" stroke="#9B8FE8" stroke-width="1.1" stroke-linecap="round"/>'
      + '<path d="M32,18 Q46,8 60,10" fill="none" stroke="'+(variant==='dark'?'#CCC8F7':'#AFA9EC')+'" stroke-width="0.9" stroke-linecap="round"/>'
      + '</g>'
      + '<text x="84" y="40" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="34" fill="'+bac+'" letter-spacing="4">BAC</text>'
      + '<line x1="84" y1="47" x2="270" y2="47" stroke="#CC0000" stroke-width="2.2"/>'
      + '<text x="85" y="63" font-family="DM Sans, sans-serif" font-weight="300" font-size="10.5" fill="'+desc+'" letter-spacing="3" textLength="185" lengthAdjust="spacing">BUSINESS ANGELS CLUB</text>'
      + '<text x="85" y="80" font-family="Space Grotesk, sans-serif" font-weight="500" font-size="11" fill="'+endor+'" letter-spacing="1.5">EmprendeIAE</text>'
      + '</svg>';
  }

  window.BAC = { wing:wing, lockup:lockup };

  function injectLogos(root){
    (root||document).querySelectorAll('[data-bac-logo]').forEach(function(el){
      if(el.dataset.done) return; el.dataset.done='1';
      el.innerHTML = lockup(el.getAttribute('data-bac-logo')||'light');
    });
    (root||document).querySelectorAll('[data-bac-wing]').forEach(function(el){
      if(el.dataset.done) return; el.dataset.done='1';
      el.innerHTML = wing(el.getAttribute('data-bac-wing')||'light');
    });
  }

  /* ---------- i18n ---------- */
  function applyLang(lang){
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-es]').forEach(function(el){
      var v = el.getAttribute('data-'+lang);
      if(v!=null) el.textContent = v;
    });
    document.querySelectorAll('[data-es-html]').forEach(function(el){
      var v = el.getAttribute('data-'+lang+'-html');
      if(v!=null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn')===lang ? 'true':'false');
    });
    try{ localStorage.setItem('bac-lang', lang); }catch(e){}
  }
  function initLang(){
    var saved='es';
    try{ saved = localStorage.getItem('bac-lang') || 'es'; }catch(e){}
    applyLang(saved);
    document.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang-btn')); });
    });
  }
  window.BAC.setLang = applyLang;

  /* ---------- mobile nav ---------- */
  function initNav(){
    document.querySelectorAll('[data-nav-toggle]').forEach(function(btn){
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function(){
        var nav = document.querySelector(btn.getAttribute('data-nav-toggle'));
        var isOpen = nav ? nav.classList.toggle('is-open') : btn.classList.toggle('is-open');
        btn.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal(){
    if(!('IntersectionObserver' in window)){
      document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }

  /* ---------- carousel: smooth infinite auto-scroll (transform marquee) ---------- */
  function initCarousel(){
    document.querySelectorAll('[data-carousel]').forEach(function(car){
      var viewport = car.querySelector('.pfcar__viewport');
      var track = car.querySelector('.pfcar__track');
      if(!track) return;
      var prev = car.querySelector('[data-car-prev]');
      var next = car.querySelector('[data-car-next]');
      function cardStep(){ var c = track.querySelector('.pfcard'); var w = c ? c.getBoundingClientRect().width : 240; return w + 16; }
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var auto = car.hasAttribute('data-carousel-auto') && !reduce;

      // Fallback / reduced-motion: native horizontal scroll driven by the arrows.
      if(!auto){
        car.classList.add('pfcar--scroll');
        var sc = viewport || track;
        if(prev) prev.addEventListener('click', function(){ sc.scrollBy({left:-cardStep()*2, behavior:'smooth'}); });
        if(next) next.addEventListener('click', function(){ sc.scrollBy({left: cardStep()*2, behavior:'smooth'}); });
        return;
      }

      // Marquee: duplicate the set once so the loop is seamless, then drive with transform.
      car.classList.add('pfcar--auto');
      var count = track.children.length;
      Array.prototype.slice.call(track.children).forEach(function(c){
        var cl = c.cloneNode(true); cl.setAttribute('aria-hidden','true'); cl.tabIndex = -1; track.appendChild(cl);
      });
      function setWidth(){ return track.children[count].offsetLeft - track.children[0].offsetLeft; }
      var setW = setWidth();
      var offset = 0, boost = 0, paused = false, last = 0;
      function render(){ track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)'; }
      window.addEventListener('resize', function(){ setW = setWidth(); });
      car.addEventListener('mouseenter', function(){ paused = true; });
      car.addEventListener('mouseleave', function(){ paused = false; });
      car.addEventListener('focusin', function(){ paused = true; });
      car.addEventListener('focusout', function(){ paused = false; });
      if(prev) prev.addEventListener('click', function(){ boost -= cardStep()*2; });
      if(next) next.addEventListener('click', function(){ boost += cardStep()*2; });

      function tick(t){
        if(!last) last = t;
        var dt = Math.min(64, t - last); last = t;
        var move = paused ? 0 : (dt/1000) * 42;        // steady ~42px/s drift
        var b = boost * Math.min(1, (dt/1000) * 7);     // eased arrow nudge on top
        boost -= b;
        offset += move + b;
        if(setW > 0){ offset = ((offset % setW) + setW) % setW; }
        render();
        requestAnimationFrame(tick);
      }
      render();
      requestAnimationFrame(tick);
    });
  }

  function start(){ injectLogos(); initLang(); initNav(); initReveal(); initCarousel(); }
  if(document.readyState!=='loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
