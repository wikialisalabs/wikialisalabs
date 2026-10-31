// Wikialisalabs Docs — Guidelines page (MD-driven, sub-routes)
import { loadMd, injectMdStyles } from '../lib/md.js';

const GUIDE_MAP = {
  '/guidelines/dark-mode':    'src/content/dark-mode.md',
  '/guidelines/a11y':         'src/content/accessibility.md',
  '/guidelines/icon-usage':   'src/content/icon-usage.md',
  '/guidelines/icon-catalog': 'src/content/icon-catalog.md',
  '/guidelines/impl':         'src/content/implementation.md',
};

export async function render(el, route) {
  injectMdStyles();
  const mdPath = GUIDE_MAP[route] || 'src/content/dark-mode.md';
  el.innerHTML = `<div class="md-page"><div class="md-loading">Loading…</div></div>`;
  try {
    const { meta, html } = await loadMd(mdPath);
    el.innerHTML = `
<div class="md-page">
  <div class="md-page-header">
    <div class="md-page-badge">${meta.title || 'Guidelines'}</div>
  </div>
  <div class="md-body">${html}</div>
</div>
<style>
.md-page { max-width: 900px; padding: 12px 0 48px; }
.md-page-header { margin-bottom: 8px; }
.md-page-badge { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .5px; border: 1.5px solid #000; padding: 2px 10px; background: #AF96FB; color: #000; }
.md-loading { color: #888; font-size: 14px; padding: 48px 0; }
</style>`;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><div class="empty-title">Failed to load page</div><div class="empty-desc">${err.message}</div></div>`;
  }
}
