// Wikialisalabs Docs — Changelog page (MD-driven)
import { loadMd, injectMdStyles } from '../lib/md.js';

export async function render(el) {
  injectMdStyles();
  el.innerHTML = `<div class="md-page"><div class="md-loading">Loading…</div></div>`;
  try {
    const { meta, html } = await loadMd('src/content/changelog.md');
    el.innerHTML = `
<div class="md-page">
  <div class="md-page-header">
    <div class="md-page-badge" style="background:#BEFF6C;color:#000;border-color:#000;">
      ${meta.version || 'v6.0.0'} · Latest
    </div>
  </div>
  <div class="md-body">${html}</div>
</div>
<style>
.md-page { max-width: 900px; padding: 12px 0 48px; }
.md-page-header { margin-bottom: 8px; }
.md-page-badge { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .5px; border: 1.5px solid; padding: 2px 10px; }
.md-loading { color: #888; font-size: 14px; padding: 48px 0; }
</style>`;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><div class="empty-title">Failed to load page</div><div class="empty-desc">${err.message}</div></div>`;
  }
}
