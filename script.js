/* =============================================
   AUCTI.ON — Shared Scripts
   ============================================= */

// ── Active nav link ──────────────────────────
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'doc.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) {
      a.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
    }
  });
}

// ── Header bg change on scroll ───────────────
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(19,19,21,0.98)';
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      nav.style.background = '';
      nav.style.boxShadow = '';
    }
  }, { passive: true });
}

// ── Burger menu ──────────────────────────────
function initBurger() {
  const burger = document.getElementById('burger-btn');
  const drawer = document.getElementById('menu-drawer');
  const overlay = document.getElementById('menu-overlay');
  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('translate-x-0');
    if (isOpen) {
      closeDrawer();
    } else {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      if (overlay) { overlay.classList.remove('opacity-0', 'pointer-events-none'); overlay.classList.add('opacity-100'); }
      document.body.style.overflow = 'hidden';
    }
  });

  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function closeDrawer() {
  const drawer = document.getElementById('menu-drawer');
  const overlay = document.getElementById('menu-overlay');
  if (!drawer) return;
  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
  if (overlay) { overlay.classList.add('opacity-0', 'pointer-events-none'); overlay.classList.remove('opacity-100'); }
  document.body.style.overflow = '';
}

// ── togglePopup (doc.html menu & filter) ─────
function togglePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  if (id === 'menu-popup') {
    const ov = document.getElementById('menu-overlay');
    const mc = document.getElementById('menu-content');
    if (popup.classList.contains('hidden')) {
      popup.classList.remove('hidden');
      setTimeout(() => {
        if (ov) ov.classList.remove('opacity-0');
        if (mc) mc.classList.remove('translate-x-full');
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      if (ov) ov.classList.add('opacity-0');
      if (mc) mc.classList.add('translate-x-full');
      setTimeout(() => { popup.classList.add('hidden'); document.body.style.overflow = ''; }, 500);
    }
  } else {
    popup.classList.toggle('hidden');
    document.body.style.overflow = popup.classList.contains('hidden') ? '' : 'hidden';
  }
}

// ── Ripple effect ────────────────────────────
function addRipple(e) {
  const btn = e.currentTarget;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  r.style.cssText = `
    position:absolute;width:120px;height:120px;
    background:rgba(255,255,255,0.18);border-radius:50%;
    pointer-events:none;transform:scale(0);
    left:${e.clientX - rect.left - 60}px;
    top:${e.clientY - rect.top - 60}px;
  `;
  btn.style.position = btn.style.position || 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(r);
  r.animate(
    [{ transform: 'scale(0)', opacity: 1 }, { transform: 'scale(4)', opacity: 0 }],
    { duration: 600, easing: 'ease-out' }
  ).onfinish = () => r.remove();
}
function initRipples() {
  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });
}

// ── Countdown timers ─────────────────────────
function initCountdowns() {
  document.querySelectorAll('[data-countdown]').forEach(el => {
    const parts = el.textContent.trim().split(':').map(Number);
    let total = 0;
    if (parts.length === 3) total = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) total = parts[0] * 60 + parts[1];
    const fmt = n => String(n).padStart(2, '0');
    const tick = () => {
      if (total <= 0) { el.textContent = 'ENDED'; return; }
      total--;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      el.textContent = h > 0 ? `${fmt(h)}:${fmt(m)}:${fmt(s)}` : `${fmt(m)}:${fmt(s)}`;
      if (total < 60) el.style.color = '#ef4444';
    };
    tick();
    setInterval(tick, 1000);
  });
}

// ── Glass card mouse glow ─────────────────────
function initCardGlow() {
  document.querySelectorAll('.glass-card, .glass-panel').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// ── Scroll to top ─────────────────────────────
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
  btn.id = 'scroll-top-btn';
  btn.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:998;
    width:44px;height:44px;border-radius:50%;border:none;
    background:rgba(190,198,224,0.15);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.12);
    color:#e4e2e4;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;
    transition:opacity 0.3s,transform 0.2s;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Fetch auction data (GET / async-await) ────
// FakeStore API - საქონლის/პროდუქტების მონაცემები, თემატურად
// შესაბამისი აუქციონის მარკეტპლეისთან (ფასები, კატეგორიები, სურათები)
async function loadAuctionData() {
  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=4');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    console.log('✅ Auction items loaded from API:', data);
    return data;
  } catch (err) {
    console.warn('⚠️ Fetch error:', err.message);
  }
}

// ── localStorage — Cookies notification ───────
function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted') === 'true') return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    z-index:9999;display:flex;align-items:center;gap:16px;
    background:rgba(31,31,33,0.95);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.10);
    padding:14px 24px;border-radius:9999px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    white-space:nowrap;font-family:Inter,sans-serif;
    transition:opacity 0.4s,transform 0.4s;
  `;
  banner.innerHTML = `
    <span style="color:#c6c6cd;font-size:14px;">
      🍪 We use cookies to improve your experience.
    </span>
    <button id="cookie-accept-btn" style="
      background:#bec6e0;color:#283044;border:none;
      padding:7px 20px;border-radius:9999px;
      font-weight:700;font-size:13px;cursor:pointer;
      font-family:Inter,sans-serif;
    ">Accept</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept-btn').addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => banner.remove(), 400);
  });
}

// ── Section animation on scroll ───────────────
function initSectionAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('section, main > div');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Init all ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initNavScroll();
  initBurger();
  initRipples();
  initCountdowns();
  initCardGlow();
  initScrollToTop();
  initSectionAnimations();
  initCookieBanner();
  loadAuctionData();
});