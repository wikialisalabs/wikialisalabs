// Wikialisalabs Docs — App Zones page (MD-driven)
import { loadMd, injectMdStyles } from '../lib/md.js';

export async function render(el) {
  injectMdStyles();

  el.innerHTML = `<div class="md-page"><div class="md-loading">Loading…</div></div>`;

  try {
    const { html } = await loadMd('src/content/zones.md');

    el.innerHTML = `
<div class="md-page">
  <div class="md-body">${html}</div>
</div>

<style>
.md-page { max-width: 900px; padding: 12px 0 48px; }
.md-loading { color: #888; font-size: 14px; padding: 48px 0; }
/* ASCII diagram in fenced code block — monospace with visible structure */
.md-page .md-pre {
  background: #1a1f2e;
  font-size: 13px;
  letter-spacing: 0.02em;
}
/* Zone section h3 gets colored left bar using a cycling set */
.md-body .md-h3 {
  border-left: 5px solid #49DBC8;
  padding-left: 12px;
  margin-top: 32px;
}
.md-body .md-h3:nth-of-type(2) { border-color: #BEFF6C; }
.md-body .md-h3:nth-of-type(3) { border-color: #AF96FB; }
.md-body .md-h3:nth-of-type(4) { border-color: #FFF172; }
.md-body .md-h3:nth-of-type(5) { border-color: #FC7339; }
.md-body .md-h3:nth-of-type(6) { border-color: #FD9FDD; }
/* Ordered rules list */
.md-body .md-ol { counter-reset: none; }
.md-body .md-ol .md-li { padding: 4px 0; }
</style>
`;
  } catch (err) {
    el.innerHTML = `<div class="md-page">
      <p style="color:#FF3D71;font-weight:600;">Failed to load zones.md: ${err.message}</p>
    </div>`;
  }
}
