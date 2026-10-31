// Wikialisalabs Docs — Overview page (MD-driven)
import { loadMd, injectMdStyles } from '../lib/md.js';

export async function render(el) {
  injectMdStyles();

  // Optimistic render while fetching
  el.innerHTML = `<div class="md-page"><div class="md-loading">Loading…</div></div>`;

  try {
    const { meta, html } = await loadMd('src/content/overview.md');

    el.innerHTML = `
<div class="md-page">
  <div class="md-page-header">
    <div class="md-page-badge">${meta.version || 'v1.0'} · ${meta.description || 'Design System'}</div>
  </div>
  <div class="md-body">${html}</div>
</div>

<style>
.md-page { max-width: 900px; padding: 12px 0 48px; }
.md-page-header { margin-bottom: 8px; }
.md-page-badge {
  display: inline-block;
  font-size: 11px; font-weight: 600; letter-spacing: .5px;
  border: 1.5px solid #000; padding: 2px 10px;
  background: #BEFF6C; color: #000;
}
.md-loading { color: #888; font-size: 14px; padding: 48px 0; }
/* First h1 gets hero treatment */
.md-body .md-h1:first-child {
  font-size: clamp(36px, 6vw, 56px);
  letter-spacing: -1.5px; margin-bottom: 4px;
}
/* Table in overview: highlight first col */
.md-body .md-table .md-td:first-child { font-weight: 600; }
</style>
`;
  } catch (err) {
    el.innerHTML = `<div class="md-page">
      <p style="color:#FF3D71;font-weight:600;">Failed to load overview.md: ${err.message}</p>
    </div>`;
  }
}
