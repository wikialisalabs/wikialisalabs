// AXQ Docs — Hash Router
// Parses window.location.hash → loads page module → calls module.render(appEl)

const ROUTES = {
  '/':                   { label: 'Overview',              module: () => import('../pages/overview.js') },
  '/tokens':             { label: 'Tokens',                module: () => import('../pages/tokens.js') },
  '/icons':              { label: 'Icons',                 module: () => import('../pages/icons.js') },
  '/components':         { label: 'Components',            module: () => import('../pages/components.js') },
  '/components/button':  { label: 'Components / Button',   module: () => import('../pages/components.js') },
  '/components/badge':   { label: 'Components / Badge',    module: () => import('../pages/components.js') },
  '/components/input':   { label: 'Components / Input',    module: () => import('../pages/components.js') },
  '/components/toggle':  { label: 'Components / Toggle',   module: () => import('../pages/components.js') },
  '/components/card':    { label: 'Components / Card',     module: () => import('../pages/components.js') },
  '/components/navbar':  { label: 'Components / Navbar',   module: () => import('../pages/components.js') },
  '/zones':              { label: 'App Zones',             module: () => import('../pages/zones.js') },
};

const appEl          = document.getElementById('app');
const bcCurrent      = document.getElementById('bcCurrent');
const topbarSearch   = document.getElementById('topbarSearch');
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn        = document.getElementById('menuBtn');

// ── Mobile sidebar ────────────────────────────────────────────────────────────
function openSidebar()  { sidebar.classList.add('open'); sidebarOverlay.classList.add('visible'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('visible'); }

menuBtn.addEventListener('click', () =>
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
);
sidebarOverlay.addEventListener('click', closeSidebar);

// ── Parse hash → route string ─────────────────────────────────────────────────
function parseHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash.startsWith('/') ? hash : '/' + hash;
}

// ── Update sidebar active state ───────────────────────────────────────────────
function setActiveLink(route) {
  document.querySelectorAll('.sidebar-link').forEach(a => {
    const r = a.dataset.route;
    // Exact match OR parent-route match for component sub-links
    const active = r === route || (route.startsWith('/components/') && r === '/components');
    a.classList.toggle('active', active);
  });
}

// ── Navigate ──────────────────────────────────────────────────────────────────
let currentRoute = null;

async function navigate() {
  const route = parseHash();
  if (route === currentRoute) return;
  currentRoute = route;

  // Resolve route config (fallback to '/')
  const config = ROUTES[route] || ROUTES['/'];

  // Update breadcrumb
  bcCurrent.textContent = config.label;

  // Show/hide topbar icon search
  topbarSearch.style.display = route === '/icons' ? 'flex' : 'none';

  // Update sidebar
  setActiveLink(route);

  // Close mobile sidebar
  closeSidebar();

  // Loading state
  appEl.innerHTML = '<div class="page-loading">Loading…</div>';

  try {
    const mod = await config.module();
    // Pass route so component page knows which tab to activate
    await mod.render(appEl, route);
  } catch (err) {
    console.error('[Router] Failed to load page:', route, err);
    appEl.innerHTML = `<div class="empty-state">
      <div class="empty-icon">⚠</div>
      <div class="empty-title">Failed to load page</div>
      <div class="empty-desc">${err.message}</div>
    </div>`;
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', navigate);
window.addEventListener('popstate',   navigate);
navigate(); // initial load
