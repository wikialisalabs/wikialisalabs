// Wikialisalabs Docs — Token Explorer (hybrid: MD prose header + live token explorer)
import { loadMd, injectMdStyles, renderMd } from '../lib/md.js';
import {
  PRIMITIVE_COLORS, PRIMITIVE_SPACING, PRIMITIVE_RADIUS,
  SEMANTIC_COLORS,
  COMPONENT_TOKENS,
} from '../data/tokens.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function contrastColor(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114) / 1000 > 128 ? '#000' : '#fff';
}

// ── Token renderers (live explorer — kept as JS) ───────────────────────────────

function renderPrimitive() {
  const groups = {};
  PRIMITIVE_COLORS.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  const colorsHtml = Object.entries(groups).map(([group, tokens]) => `
    <div class="token-group">
      <h3 class="token-group-title">${group}</h3>
      <div class="swatch-grid">
        ${tokens.map(t => `
          <div class="swatch-cell" title="Click to copy" data-copy="${t.cssVar}">
            <div class="swatch-color" style="background:${t.hex}">
              <span class="swatch-hex" style="color:${contrastColor(t.hex)}">${t.hex}</span>
            </div>
            <div class="swatch-info">
              <div class="swatch-name">${t.name}</div>
              <code class="swatch-var">${t.cssVar}</code>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const spacingHtml = `
    <div class="token-group">
      <h3 class="token-group-title">Spacing</h3>
      <div class="spacing-list">
        ${PRIMITIVE_SPACING.map(t => `
          <div class="spacing-row token-row" data-copy="${t.cssVar}">
            <div class="spacing-bar-wrap">
              <div class="spacing-bar" style="width:${Math.min(t.value, 128)}px; height:16px; background:#000;"></div>
            </div>
            <code class="token-name">${t.cssVar}</code>
            <span class="token-value">${t.value}${t.unit}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const radiusHtml = `
    <div class="token-group">
      <h3 class="token-group-title">Radius</h3>
      <div class="radius-list">
        ${PRIMITIVE_RADIUS.map(t => `
          <div class="radius-row token-row" data-copy="${t.cssVar}">
            <div class="radius-demo" style="border:2px solid #000; width:40px; height:40px; border-radius:${Math.min(t.value,20)}px;"></div>
            <code class="token-name">${t.cssVar}</code>
            <span class="token-value">${t.value === 9999 ? '9999px (full)' : t.value + t.unit}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return colorsHtml + spacingHtml + radiusHtml;
}

function renderSemantic() {
  const groups = {};
  SEMANTIC_COLORS.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });
  return Object.entries(groups).map(([group, tokens]) => `
    <div class="token-group">
      <h3 class="token-group-title">${group}</h3>
      <div class="token-table">
        ${tokens.map(t => `
          <div class="token-row" data-copy="${t.cssVar}">
            <div class="token-swatch-sm" style="background:${t.hex}; border:1px solid ${t.hex === '#FFFFFF' ? '#ccc' : t.hex}"></div>
            <code class="token-name">${t.cssVar}</code>
            <span class="token-hex">${t.hex}</span>
            <span class="token-alias">${t.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderComponent() {
  const comps = {};
  COMPONENT_TOKENS.forEach(t => {
    if (!comps[t.component]) comps[t.component] = [];
    comps[t.component].push(t);
  });
  return Object.entries(comps).map(([comp, tokens]) => `
    <div class="token-group">
      <h3 class="token-group-title">${comp}</h3>
      <div class="token-table">
        ${tokens.map(t => `
          <div class="token-row" data-copy="${t.cssVar}">
            ${t.type === 'color'
              ? `<div class="token-swatch-sm" style="background:${t.hex}; border:1px solid ${t.hex === '#FFFFFF' ? '#ccc' : t.hex}"></div>`
              : `<div class="token-swatch-sm token-swatch-num">${t.value}</div>`
            }
            <code class="token-name">${t.cssVar}</code>
            <span class="token-value">${t.type === 'color' ? t.hex : t.value}</span>
            <span class="token-alias">${t.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ── Main render ───────────────────────────────────────────────────────────────

export async function render(el) {
  injectMdStyles();

  // Load MD prose header
  let proseHtml = '';
  try {
    const { html } = await loadMd('src/content/tokens.md');
    proseHtml = html;
  } catch (_) {
    proseHtml = renderMd('# Design Tokens\n\nThree-layer token system — Primitive → Semantic → Component.');
  }

  el.innerHTML = `
<div class="page-tokens">

  <!-- MD prose header (from tokens.md) -->
  <div class="md-body tokens-prose">${proseHtml}</div>

  <!-- Live Token Explorer -->
  <div class="tokens-explorer-header">
    <h2 class="explorer-title">Live Token Explorer</h2>
    <p class="explorer-sub">Click any row or swatch to copy the CSS variable to clipboard.</p>
  </div>

  <div class="tabs" id="tokenTabs">
    <button class="tab active" data-tab="primitive">Primitive</button>
    <button class="tab"        data-tab="semantic">Semantic</button>
    <button class="tab"        data-tab="component">Component</button>
  </div>

  <div class="tab-panel"        id="tab-primitive">${renderPrimitive()}</div>
  <div class="tab-panel hidden" id="tab-semantic">${renderSemantic()}</div>
  <div class="tab-panel hidden" id="tab-component">${renderComponent()}</div>
</div>

<style>
.page-tokens { max-width: 900px; padding: 12px 0 48px; }

/* Prose section: collapse the full reference tables from MD — show only the intro */
.tokens-prose .md-h1 { font-size: clamp(28px,4vw,44px); letter-spacing:-1px; }
.tokens-prose .md-h2 { font-size: 20px; }
/* Hide the big reference tables from the MD prose (they are in the live explorer) */
.tokens-prose .md-table-wrap { display: none; }

/* Explorer divider */
.tokens-explorer-header {
  margin: 40px 0 20px;
  padding-top: 32px;
  border-top: 3px solid #000;
}
.explorer-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.explorer-sub   { font-size: 14px; color: #555; }

.tabs { display: flex; gap: 0; border: 2px solid #000; width: fit-content; margin-bottom: 32px; }
.tab {
  padding: 8px 20px; font-size: 14px; font-weight: 600;
  border: none; border-right: 2px solid #000; background: #fff;
  cursor: pointer; transition: background .15s; font-family: inherit;
}
.tab:last-child { border-right: none; }
.tab.active  { background: #000; color: #fff; }
.tab:hover:not(.active) { background: #BEFF6C; }
.tab-panel.hidden { display: none; }

.token-group { margin-bottom: 40px; }
.token-group-title {
  font-size: 15px; font-weight: 700; margin-bottom: 14px;
  padding-bottom: 6px; border-bottom: 2px solid #000;
}
.swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 12px; }
.swatch-cell { border: 2px solid #000; cursor: pointer; transition: transform .15s, box-shadow .15s; }
.swatch-cell:hover { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 #000; }
.swatch-color { height: 56px; display: flex; align-items: flex-end; padding: 6px; }
.swatch-hex  { font-size: 10px; font-weight: 600; font-family: monospace; }
.swatch-info { padding: 6px 8px; }
.swatch-name { font-size: 11px; font-weight: 600; margin-bottom: 2px; }
.swatch-var  { font-size: 10px; color: #666; word-break: break-all; }
.token-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px; border-bottom: 1px solid #e5e7eb;
  cursor: pointer; transition: background .1s;
}
.token-row:hover { background: #f7f8fa; }
.token-swatch-sm { width: 28px; height: 28px; flex-shrink: 0; border-radius: 4px; }
.token-swatch-num {
  background: #EDF1F7; font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; font-family: monospace;
}
.token-name  { font-size: 13px; flex: 1; color: #000; }
.token-value, .token-hex { font-size: 12px; color: #555; font-family: monospace; }
.token-alias { font-size: 11px; color: #999; margin-left: auto; }
.spacing-list { display: flex; flex-direction: column; }
.spacing-bar-wrap { width: 140px; flex-shrink: 0; }
.radius-list { display: flex; flex-direction: column; }
.radius-demo { flex-shrink: 0; }
.token-table { border: 2px solid #000; }
.token-table .token-row:last-child { border-bottom: none; }
</style>
`;

  // Tab switching
  el.querySelector('#tokenTabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    el.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    el.querySelector(`#tab-${btn.dataset.tab}`).classList.remove('hidden');
  });

  // Copy on row/swatch click
  el.addEventListener('click', e => {
    const row = e.target.closest('[data-copy]');
    if (!row) return;
    navigator.clipboard.writeText(row.dataset.copy).then(() => {
      const toast = document.getElementById('copyToast');
      toast.textContent = `Copied: ${row.dataset.copy}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    });
  });
}
