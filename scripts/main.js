/* ==========================================================================
   BAC — main.js
   - Inject header/footer partials
   - Mobile menu toggle
   - Header shrink on scroll
   - Active nav link
   - Dynamic year
   - Form UX placeholders (loading/disabled + message)
   - Portfolio filters (portfolio.html)
   ========================================================================== */

async function injectPartial(targetId, url) {
  const el = document.getElementById(targetId);
  if (!el) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
  } catch (e) {
    // If partials fail, keep page usable (do not hard-crash)
    el.innerHTML = `
      <div class="mx-auto max-w-7xl px-6 py-4 text-sm text-slate-600">
        No se pudo cargar un componente compartido (${url}). Revisá rutas relativas / GitHub Pages.
      </div>
    `;
  }
}

function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isHidden = nav.classList.contains("hidden");
    nav.classList.toggle("hidden", !isHidden);
    btn.setAttribute("aria-expanded", String(isHidden));
  });

  // Close menu when clicking a link
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function setupHeaderShrink() {
  const header = document.getElementById("siteHeader");
  const inner = document.getElementById("headerInner");
  if (!header || !inner) return;

  const SHRINK_AT = 40;

  const apply = () => {
    const scrolled = window.scrollY > SHRINK_AT;

    // Background + shadow when scrolled
    header.classList.toggle("bg-white/95", scrolled);
    header.classList.toggle("shadow-soft", scrolled);

    // Optional: make border slightly more defined when scrolled (subtle)
    header.classList.toggle("border-slate-200/90", scrolled);
    header.classList.toggle("border-slate-200/70", !scrolled);

    // Padding shrink (must exist on inner)
    inner.classList.toggle("py-3", scrolled);
    inner.classList.toggle("py-5", !scrolled);
  };

  window.addEventListener("scroll", apply, { passive: true });
  apply(); // run once on load (important if page loads mid-scroll)
}

function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".navlink").forEach((a) => {
    const p = (a.getAttribute("data-path") || "").toLowerCase();
    if (p && p === path) {
      a.classList.add("text-primary");
      a.classList.remove("text-slate-700");
    }
  });
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function setupFormUX() {
  document.querySelectorAll("form[data-ux='loading']").forEach((form) => {
    const submitBtn = form.querySelector("button[type='submit']");
    const msg = form.querySelector("[data-form-message]");
    if (!submitBtn) return;

    form.addEventListener("submit", (e) => {
      // No backend yet — keep as placeholder behavior
      e.preventDefault();

      // HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      const prev = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <span class="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin"></span>
          Enviando…
        </span>
      `;

      window.setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = prev;
        if (msg) {
          msg.classList.remove("hidden");
          msg.textContent = "Recibido. Este formulario aún no tiene backend conectado.";
        }
      }, 900);
    });
  });
}

function setupPortfolioFilters() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  const sector = document.getElementById("filterSector");
  const stage = document.getElementById("filterStage");
  const q = document.getElementById("filterQuery");
  const count = document.getElementById("filterCount");

  const cards = Array.from(grid.querySelectorAll("[data-card='portfolio']"));

  function norm(s) {
    return (s || "").toLowerCase().trim();
  }

  function apply() {
    const s = norm(sector?.value);
    const t = norm(stage?.value);
    const query = norm(q?.value);

    let visible = 0;
    cards.forEach((c) => {
      const cs = norm(c.getAttribute("data-sector"));
      const ct = norm(c.getAttribute("data-stage"));
      const name = norm(c.getAttribute("data-name"));
      const desc = norm(c.getAttribute("data-desc"));

      const okS = !s || s === "all" || cs === s;
      const okT = !t || t === "all" || ct === t;
      const okQ = !query || name.includes(query) || desc.includes(query);

      const ok = okS && okT && okQ;
      c.classList.toggle("hidden", !ok);
      if (ok) visible += 1;
    });

    if (count) count.textContent = String(visible);
  }

  [sector, stage, q].forEach((el) => el && el.addEventListener("input", apply));
  apply();
}

(async function boot() {
  await injectPartial("site-header", "./partials/header.html");
  await injectPartial("site-footer", "./partials/footer.html");

  // Must run AFTER header partial is injected (otherwise elements don't exist)
  setupMobileMenu();
  setupHeaderShrink();

  setActiveNav();
  setYear();
  setupFormUX();
  setupPortfolioFilters();
})();
