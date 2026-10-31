// Wikialisalabs Docs — Components page (hybrid: MD docs reference + live previews)
// Button, Badge, Input, Toggle, Card, Navbar — live preview + token props
import { loadMd, injectMdStyles } from '../lib/md.js';

const COMPONENTS = ['button', 'badge', 'input', 'toggle', 'card', 'navbar'];

// ── Button ────────────────────────────────────────────────────────────────────
function renderButton() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Button</h2>
  <p class="comp-desc">Token-driven button component with 7 variants and 3 sizes.</p>

  <div class="preview-card">
    <div class="preview-label">Variants</div>
    <div class="preview-area" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <button class="axq-btn axq-btn-primary">Primary</button>
      <button class="axq-btn axq-btn-info">Info</button>
      <button class="axq-btn axq-btn-success">Success</button>
      <button class="axq-btn axq-btn-warning">Warning</button>
      <button class="axq-btn axq-btn-danger">Danger</button>
      <button class="axq-btn axq-btn-ghost">Ghost</button>
      <button class="axq-btn axq-btn-primary" disabled>Disabled</button>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Sizes</div>
    <div class="preview-area" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <button class="axq-btn axq-btn-primary axq-btn-sm">Small</button>
      <button class="axq-btn axq-btn-primary">Medium</button>
      <button class="axq-btn axq-btn-primary axq-btn-lg">Large</button>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">With Icons</div>
    <div class="preview-area" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <button class="axq-btn axq-btn-primary" style="display:flex;align-items:center;gap:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        Add Item
      </button>
      <button class="axq-btn axq-btn-ghost" style="display:flex;align-items:center;gap:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        Delete
      </button>
    </div>
  </div>

  <div class="token-ref-table">
    <div class="token-ref-header">Tokens used</div>
    ${[
      ['--axq-button-primary-bg',     '#000000', 'Primary background'],
      ['--axq-button-primary-text',   '#FFFFFF', 'Primary text'],
      ['--axq-button-padding-x',      '16px',    'Horizontal padding'],
      ['--axq-button-padding-y',      '8px',     'Vertical padding'],
      ['--axq-button-radius',         '24px',    'Border radius'],
      ['--axq-button-font-size',      '16px',    'Font size'],
    ].map(([v,val,desc]) => `
      <div class="token-ref-row">
        <code>${v}</code>
        <span class="tr-val">${val}</span>
        <span class="tr-desc">${desc}</span>
      </div>
    `).join('')}
  </div>
</div>`;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function renderBadge() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Badge</h2>
  <p class="comp-desc">Small status labels for categories, states, and counts.</p>

  <div class="preview-card">
    <div class="preview-label">Variants</div>
    <div class="preview-area" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span class="axq-badge axq-badge-default">Default</span>
      <span class="axq-badge axq-badge-info">Info</span>
      <span class="axq-badge axq-badge-success">Success</span>
      <span class="axq-badge axq-badge-warning">Warning</span>
      <span class="axq-badge axq-badge-danger">Danger</span>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Solid</div>
    <div class="preview-area" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span class="axq-badge axq-badge-solid-black">Black</span>
      <span class="axq-badge axq-badge-solid-teal">Teal</span>
      <span class="axq-badge axq-badge-solid-green">Green</span>
      <span class="axq-badge axq-badge-solid-orange">Orange</span>
      <span class="axq-badge axq-badge-solid-pink">Pink</span>
      <span class="axq-badge axq-badge-solid-purple">Purple</span>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">With dot</div>
    <div class="preview-area" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <span class="axq-badge axq-badge-success"><span class="badge-dot" style="background:#00D68F"></span>Active</span>
      <span class="axq-badge axq-badge-danger"><span class="badge-dot" style="background:#FF3D71"></span>Error</span>
      <span class="axq-badge axq-badge-warning"><span class="badge-dot" style="background:#FFAA00"></span>Warning</span>
    </div>
  </div>
</div>`;
}

// ── Input ─────────────────────────────────────────────────────────────────────
function renderInput() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Input</h2>
  <p class="comp-desc">Text input fields with label, helper text, and state variants.</p>

  <div class="preview-card">
    <div class="preview-label">States</div>
    <div class="preview-area" style="display:flex;flex-direction:column;gap:16px;max-width:380px">
      <div class="axq-field">
        <label class="axq-label">Default</label>
        <input class="axq-input" type="text" placeholder="Enter value…" />
      </div>
      <div class="axq-field">
        <label class="axq-label">With value</label>
        <input class="axq-input" type="text" value="Hello AXQ" />
      </div>
      <div class="axq-field">
        <label class="axq-label">Error state</label>
        <input class="axq-input axq-input-error" type="text" value="Bad input" />
        <span class="axq-helper axq-helper-error">This field is required.</span>
      </div>
      <div class="axq-field">
        <label class="axq-label axq-label-disabled">Disabled</label>
        <input class="axq-input" type="text" placeholder="Disabled" disabled />
      </div>
      <div class="axq-field">
        <label class="axq-label">With icon</label>
        <div class="axq-input-wrap">
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="axq-input axq-input-icon" type="text" placeholder="Search…" />
        </div>
      </div>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Textarea</div>
    <div class="preview-area" style="max-width:380px">
      <div class="axq-field">
        <label class="axq-label">Description</label>
        <textarea class="axq-input" rows="3" placeholder="Enter description…"></textarea>
      </div>
    </div>
  </div>
</div>`;
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function renderToggle() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Toggle</h2>
  <p class="comp-desc">Binary on/off switch — click to toggle state.</p>

  <div class="preview-card">
    <div class="preview-label">States</div>
    <div class="preview-area" style="display:flex;flex-direction:column;gap:16px">
      <label class="axq-toggle-row">
        <span class="axq-toggle-label">Notifications</span>
        <div class="axq-toggle on" data-toggle>
          <div class="axq-toggle-thumb"></div>
        </div>
      </label>
      <label class="axq-toggle-row">
        <span class="axq-toggle-label">Dark mode</span>
        <div class="axq-toggle" data-toggle>
          <div class="axq-toggle-thumb"></div>
        </div>
      </label>
      <label class="axq-toggle-row">
        <span class="axq-toggle-label axq-label-disabled">Analytics (disabled)</span>
        <div class="axq-toggle disabled">
          <div class="axq-toggle-thumb"></div>
        </div>
      </label>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Sizes</div>
    <div class="preview-area" style="display:flex;gap:16px;align-items:center">
      <div class="axq-toggle on axq-toggle-sm"><div class="axq-toggle-thumb"></div></div>
      <div class="axq-toggle on"><div class="axq-toggle-thumb"></div></div>
      <div class="axq-toggle on axq-toggle-lg"><div class="axq-toggle-thumb"></div></div>
    </div>
  </div>
</div>`;
}

// ── Card ──────────────────────────────────────────────────────────────────────
function renderCard() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Card</h2>
  <p class="comp-desc">Versatile content container with header, body, and footer slots.</p>

  <div class="preview-card">
    <div class="preview-label">Basic Cards</div>
    <div class="preview-area" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px">
      <div class="axq-card">
        <div class="axq-card-header">
          <strong>Design Tokens</strong>
          <span class="axq-badge axq-badge-success">Active</span>
        </div>
        <div class="axq-card-body">
          Three-layer token system powering every AXQ component.
        </div>
        <div class="axq-card-footer">
          <button class="axq-btn axq-btn-ghost axq-btn-sm">View</button>
        </div>
      </div>
      <div class="axq-card">
        <div class="axq-card-header">
          <strong>Icon Library</strong>
          <span class="axq-badge axq-badge-info">5130+</span>
        </div>
        <div class="axq-card-body">
          Outline and filled SVG icons, ready to use in any project.
        </div>
        <div class="axq-card-footer">
          <button class="axq-btn axq-btn-ghost axq-btn-sm">Browse</button>
        </div>
      </div>
      <div class="axq-card axq-card-highlighted">
        <div class="axq-card-header">
          <strong>Components</strong>
          <span class="axq-badge axq-badge-solid-black">New</span>
        </div>
        <div class="axq-card-body">
          Live previews with all token-driven props controllable.
        </div>
        <div class="axq-card-footer">
          <button class="axq-btn axq-btn-primary axq-btn-sm">Explore</button>
        </div>
      </div>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Image Card</div>
    <div class="preview-area">
      <div class="axq-card" style="max-width:260px">
        <div class="axq-card-img" style="background:linear-gradient(135deg,#49DBC8,#BEFF6C);height:120px;display:flex;align-items:center;justify-content:center;font-size:40px;">🎨</div>
        <div class="axq-card-body">
          <strong>Community Design</strong>
          <p style="margin-top:6px;font-size:13px;color:#555">A design system built for the AXQ ecosystem.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function renderNavbar() {
  return `
<div class="comp-section">
  <h2 class="comp-title">Navbar</h2>
  <p class="comp-desc">Application top navigation bar with logo, links, and actions.</p>

  <div class="preview-card">
    <div class="preview-label">Default</div>
    <div class="preview-area" style="padding:0">
      <nav class="axq-navbar">
        <div class="axq-navbar-brand">
          <div class="axq-navbar-logo">AXQ</div>
        </div>
        <div class="axq-navbar-links">
          <a class="axq-nav-link active" href="#">Overview</a>
          <a class="axq-nav-link" href="#">Tokens</a>
          <a class="axq-nav-link" href="#">Icons</a>
          <a class="axq-nav-link" href="#">Components</a>
        </div>
        <div class="axq-navbar-actions">
          <button class="axq-btn axq-btn-primary axq-btn-sm">Get Started</button>
        </div>
      </nav>
    </div>
  </div>

  <div class="preview-card">
    <div class="preview-label">Dark</div>
    <div class="preview-area" style="padding:0">
      <nav class="axq-navbar axq-navbar-dark">
        <div class="axq-navbar-brand">
          <div class="axq-navbar-logo" style="color:#BEFF6C">AXQ</div>
        </div>
        <div class="axq-navbar-links">
          <a class="axq-nav-link" href="#" style="color:rgba(255,255,255,.7)">Overview</a>
          <a class="axq-nav-link" href="#" style="color:#fff;font-weight:600">Tokens</a>
          <a class="axq-nav-link" href="#" style="color:rgba(255,255,255,.7)">Icons</a>
        </div>
        <div class="axq-navbar-actions">
          <button class="axq-btn axq-btn-ghost axq-btn-sm" style="border-color:#fff;color:#fff">Docs</button>
        </div>
      </nav>
    </div>
  </div>
</div>`;
}

// ── Main render ───────────────────────────────────────────────────────────────
export async function render(el, route) {
  injectMdStyles();

  const activeTab = route.replace('/components/', '') || 'button';

  // Load MD docs in parallel with rendering shell
  let proseHtml = '';
  try {
    const { html } = await loadMd('src/content/components.md');
    proseHtml = html;
  } catch (_) {}

  el.innerHTML = `
<div class="page-components">

  <!-- MD documentation reference (collapsible) -->
  <details class="comp-docs">
    <summary class="comp-docs-toggle">Component Reference <span class="docs-toggle-hint">click to collapse</span></summary>
    <div class="md-body comp-prose">${proseHtml}</div>
  </details>

  <!-- Live Preview Explorer -->
  <div class="comp-explorer-header">
    <h2 class="explorer-title">Live Preview</h2>
    <p class="page-subtitle">Click a component to see live previews driven by design tokens.</p>
  </div>

  <div class="comp-tabs" id="compTabs">
    ${COMPONENTS.map(c => `
      <button class="comp-tab ${c === activeTab || (activeTab === 'components' && c === 'button') ? 'active' : ''}"
              data-comp="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</button>
    `).join('')}
  </div>

  <div id="compContent"></div>
</div>

<!-- Component Styles -->
<style>
.page-components { max-width: 900px; padding: 12px 0 48px; }
.page-subtitle { color: #555; font-size: 14px; }

/* MD docs collapsible */
.comp-docs {
  border: 2px solid #000; margin-bottom: 32px; box-shadow: 4px 4px 0 #000;
}
.comp-docs-toggle {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; cursor: pointer; font-size: 15px; font-weight: 700;
  background: #49DBC8; border-bottom: 2px solid #000; list-style: none;
  user-select: none;
}
.comp-docs-toggle::-webkit-details-marker { display: none; }
.docs-toggle-hint { font-size: 11px; font-weight: 400; color: #555; }
.comp-prose { padding: 20px 24px; background: #fff; }
/* Live preview divider */
.comp-explorer-header { margin-bottom: 12px; }
.explorer-title { font-size: 20px; font-weight: 700; margin-bottom: 4px; }

.comp-tabs { display: flex; flex-wrap: wrap; gap: 0; border: 2px solid #000; width: fit-content; margin-bottom: 32px; }
.comp-tab {
  padding: 8px 18px; font-size: 13px; font-weight: 600;
  border: none; border-right: 2px solid #000; background: #fff; cursor: pointer;
  text-transform: capitalize;
}
.comp-tab:last-child { border-right: none; }
.comp-tab.active { background: #000; color: #fff; }
.comp-tab:hover:not(.active) { background: #BEFF6C; }

.comp-section { }
.comp-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.comp-desc  { color: #555; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
.preview-card { border: 2px solid #000; margin-bottom: 20px; }
.preview-label { font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; padding: 8px 16px; background: #f7f8fa;
  border-bottom: 2px solid #000; color: #555; }
.preview-area { padding: 24px 20px; }

/* Token ref table */
.token-ref-table { border: 2px solid #000; margin-top: 20px; }
.token-ref-header { font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .5px; padding: 8px 14px; background: #f7f8fa;
  border-bottom: 2px solid #000; color: #555; }
.token-ref-row {
  display: flex; gap: 12px; align-items: center; padding: 7px 14px;
  border-bottom: 1px solid #e5e7eb; font-size: 13px;
}
.token-ref-row:last-child { border-bottom: none; }
.token-ref-row code { flex: 1; font-size: 12px; color: #000; }
.tr-val  { font-family: monospace; font-size: 12px; color: #555; min-width: 60px; }
.tr-desc { font-size: 12px; color: #999; }

/* ── BUTTON ── */
.axq-btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px; padding: 8px 16px; font-size: 16px; font-weight: 600;
  border: 2px solid #000; border-radius: 24px; cursor: pointer;
  text-decoration: none; transition: transform .15s, box-shadow .15s;
  font-family: inherit; line-height: 1;
}
.axq-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 #000; }
.axq-btn:disabled { opacity: .5; cursor: not-allowed; }
.axq-btn-sm { font-size: 13px; padding: 6px 12px; border-radius: 20px; }
.axq-btn-lg { font-size: 18px; padding: 12px 24px; border-radius: 28px; }

.axq-btn-primary { background: #000; color: #fff; border-color: #000; }
.axq-btn-info    { background: #0095FF; color: #fff; border-color: #0095FF; }
.axq-btn-success { background: #00D68F; color: #fff; border-color: #00D68F; }
.axq-btn-warning { background: #FFAA00; color: #fff; border-color: #FFAA00; }
.axq-btn-danger  { background: #FF3D71; color: #fff; border-color: #FF3D71; }
.axq-btn-ghost   { background: #fff; color: #101426; border-color: #E4E9F2; }
.axq-btn-ghost:hover:not(:disabled) { box-shadow: 4px 4px 0 #000; border-color: #000; }

/* ── BADGE ── */
.axq-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; font-size: 12px; font-weight: 600;
  border-radius: 9999px; border: 1px solid transparent;
}
.badge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.axq-badge-default { background: #EDF1F7; color: #2E3A59; border-color: #C5CEE0; }
.axq-badge-info    { background: #F2F8FF; color: #006FD6; border-color: #94CBFF; }
.axq-badge-success { background: #F0FFF5; color: #00997A; border-color: #8CFAC7; }
.axq-badge-warning { background: #FFFDF2; color: #B86E00; border-color: #FFE59E; }
.axq-badge-danger  { background: #FFF2F2; color: #B81D5B; border-color: #FFA8B4; }
.axq-badge-solid-black  { background: #000; color: #fff; }
.axq-badge-solid-teal   { background: #49DBC8; color: #000; }
.axq-badge-solid-green  { background: #BEFF6C; color: #000; }
.axq-badge-solid-orange { background: #FC7339; color: #fff; }
.axq-badge-solid-pink   { background: #FD9FDD; color: #000; }
.axq-badge-solid-purple { background: #AF96FB; color: #000; }

/* ── INPUT ── */
.axq-field { display: flex; flex-direction: column; gap: 4px; }
.axq-label { font-size: 13px; font-weight: 600; color: #101426; }
.axq-label-disabled { color: #C5CEE0; }
.axq-input {
  background: #fff; border: 2px solid #E4E9F2;
  border-radius: 8px; padding: 8px 12px;
  font-size: 14px; font-family: inherit; color: #101426;
  transition: border-color .15s; outline: none; width: 100%;
}
.axq-input::placeholder { color: #8F9BB3; }
.axq-input:focus { border-color: #000; }
.axq-input:disabled { background: #EDF1F7; color: #C5CEE0; cursor: not-allowed; }
.axq-input-error { border-color: #FF3D71 !important; }
.axq-helper { font-size: 12px; color: #555; }
.axq-helper-error { color: #FF3D71; }
.axq-input-wrap { position: relative; }
.input-icon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%); color: #8F9BB3;
}
.axq-input-icon { padding-left: 36px; }

/* ── TOGGLE ── */
.axq-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; cursor: pointer; max-width: 320px; }
.axq-toggle-label { font-size: 14px; font-weight: 500; }
.axq-toggle {
  width: 44px; height: 24px; border-radius: 9999px;
  background: #C5CEE0; border: 2px solid #000;
  position: relative; cursor: pointer; flex-shrink: 0;
  transition: background .2s;
}
.axq-toggle.on  { background: #000; }
.axq-toggle.disabled { opacity: .4; cursor: not-allowed; }
.axq-toggle-thumb {
  width: 16px; height: 16px; background: #fff; border-radius: 50%;
  position: absolute; top: 2px; left: 2px;
  transition: left .2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.axq-toggle.on .axq-toggle-thumb { left: 22px; }
.axq-toggle-sm { width: 32px; height: 18px; }
.axq-toggle-sm .axq-toggle-thumb { width: 10px; height: 10px; top: 2px; left: 2px; }
.axq-toggle-sm.on .axq-toggle-thumb { left: 16px; }
.axq-toggle-lg { width: 56px; height: 30px; }
.axq-toggle-lg .axq-toggle-thumb { width: 22px; height: 22px; top: 2px; left: 2px; }
.axq-toggle-lg.on .axq-toggle-thumb { left: 28px; }

/* ── CARD ── */
.axq-card { border: 2px solid #000; background: #fff; border-radius: 0; }
.axq-card-highlighted { box-shadow: 4px 4px 0 #49DBC8; }
.axq-card-img { overflow: hidden; }
.axq-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 2px solid #e5e7eb;
  font-size: 14px;
}
.axq-card-body { padding: 14px 16px; font-size: 13px; color: #555; line-height: 1.6; }
.axq-card-footer {
  padding: 12px 16px; border-top: 2px solid #e5e7eb;
  display: flex; gap: 8px;
}

/* ── NAVBAR ── */
.axq-navbar {
  display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
  padding: 0 20px; height: 56px; border-bottom: 2px solid #e5e7eb;
  background: #fff;
}
.axq-navbar-dark { background: #101426; border-color: #222B45; }
.axq-navbar-brand { flex-shrink: 0; }
.axq-navbar-logo { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; }
.axq-navbar-links { display: flex; gap: 4px; flex: 1; }
.axq-nav-link {
  padding: 6px 12px; font-size: 14px; font-weight: 500;
  text-decoration: none; color: #555; border-radius: 4px;
  transition: background .15s, color .15s;
}
.axq-nav-link:hover { background: #f0f0f0; color: #000; }
.axq-nav-link.active { color: #000; font-weight: 700; }
.axq-navbar-actions { margin-left: auto; }
</style>
`;

  const RENDERERS = { button: renderButton, badge: renderBadge, input: renderInput, toggle: renderToggle, card: renderCard, navbar: renderNavbar };

  function showComp(name) {
    const content = el.querySelector('#compContent');
    content.innerHTML = (RENDERERS[name] || renderButton)();
    // Wire toggles
    content.querySelectorAll('[data-toggle]').forEach(t => {
      t.addEventListener('click', () => {
        if (!t.classList.contains('disabled')) t.classList.toggle('on');
      });
    });
  }

  // Init
  const initComp = COMPONENTS.includes(activeTab) ? activeTab : 'button';
  showComp(initComp);

  el.querySelector('#compTabs').addEventListener('click', e => {
    const btn = e.target.closest('.comp-tab');
    if (!btn) return;
    el.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    showComp(btn.dataset.comp);
  });
}
