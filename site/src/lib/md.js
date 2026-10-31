/**
 * md.js — Zero-dependency Markdown → HTML renderer
 * Wikialisalabs Design System Docs
 *
 * Supported syntax:
 *   Frontmatter   --- key: value ---  (returned as parsed object)
 *   # … ######   headings
 *   **bold**      strong
 *   _italic_      em
 *   `code`        inline code
 *   ```lang …```  fenced code block
 *   :::preview …:::  raw HTML island (live component preview)
 *   - item        unordered list (nested via leading spaces)
 *   1. item       ordered list
 *   | col |       table (GFM-style, first row = header)
 *   > quote       blockquote
 *   ---           horizontal rule
 *   [text](url)   anchor
 *   ![alt](src)   image
 *   blank line    paragraph break
 */

// ── Frontmatter ───────────────────────────────────────────────────────────────

/**
 * Parse YAML-lite frontmatter.
 * Returns { meta: {key: value, …}, body: 'rest of markdown' }
 */
export function parseFrontmatter(raw) {
  const fmRe = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = raw.match(fmRe);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  match[1].split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = val;
  });

  return { meta, body: raw.slice(match[0].length) };
}

// ── Inline rules ──────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineToHtml(text) {
  return text
    // Images  ![alt](src)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
      `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="md-img">`)
    // Links  [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
      `<a href="${escapeHtml(href)}" class="md-link">${label}</a>`)
    // Bold+italic  ***text***
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold  **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic  _text_  or  *text*
    .replace(/(?<![*_])_([^_]+)_(?![*_])/g, '<em>$1</em>')
    .replace(/(?<![*])\*([^*]+)\*(?![*])/g, '<em>$1</em>')
    // Inline code  `code`
    .replace(/`([^`]+)`/g, (_, code) => `<code class="md-code">${escapeHtml(code)}</code>`)
    // Strikethrough  ~~text~~
    .replace(/~~(.+?)~~/g, '<del>$1</del>');
}

// ── Block rules ───────────────────────────────────────────────────────────────

function renderTable(lines) {
  const rows = lines.map(l =>
    l.replace(/^\||\|$/g, '').split('|').map(c => c.trim())
  );
  const [head, , ...body] = rows; // row[1] is the separator ---
  const thCells = head.map(h => `<th class="md-th">${inlineToHtml(h)}</th>`).join('');
  const tbRows  = body.map(row =>
    `<tr class="md-tr">${row.map(c => `<td class="md-td">${inlineToHtml(c)}</td>`).join('')}</tr>`
  ).join('\n');
  return `<div class="md-table-wrap"><table class="md-table"><thead><tr class="md-tr">${thCells}</tr></thead><tbody>${tbRows}</tbody></table></div>`;
}

function renderList(lines, ordered) {
  const tag = ordered ? 'ol' : 'ul';
  // Simple flat list — strip leading - / 1. and wrap
  const items = lines.map(l => {
    const content = ordered
      ? l.replace(/^\s*\d+\.\s+/, '')
      : l.replace(/^\s*[-*+]\s+/, '');
    return `<li class="md-li">${inlineToHtml(content)}</li>`;
  }).join('\n');
  return `<${tag} class="md-list md-${tag}">\n${items}\n</${tag}>`;
}

// ── Main renderer ─────────────────────────────────────────────────────────────

/**
 * Render a Markdown string (body, no frontmatter) to an HTML string.
 */
export function renderMd(md) {
  const lines  = md.split(/\r?\n/);
  const out    = [];
  let i        = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block  ```lang
    if (/^```/.test(line)) {
      const lang  = line.slice(3).trim();
      const block = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      out.push(
        `<pre class="md-pre"><code class="md-fenced lang-${escapeHtml(lang || 'text')}">${escapeHtml(block.join('\n'))}</code></pre>`
      );
      continue;
    }

    // ── :::preview raw HTML island
    if (/^:::preview/.test(line)) {
      const block = [];
      i++;
      while (i < lines.length && !/^:::/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      i++; // consume closing :::
      out.push(`<div class="md-preview-island">${block.join('\n')}</div>`);
      continue;
    }

    // ── Horizontal rule
    if (/^(---|\*\*\*|___)\s*$/.test(line)) {
      out.push('<hr class="md-hr">');
      i++;
      continue;
    }

    // ── Heading  # … ######
    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const slug  = hMatch[2].toLowerCase().replace(/[^a-z0-9]+/g, '-');
      out.push(
        `<h${level} class="md-h${level}" id="${slug}">${inlineToHtml(hMatch[2])}</h${level}>`
      );
      i++;
      continue;
    }

    // ── Blockquote  > text
    if (/^>\s?/.test(line)) {
      const block = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        block.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote class="md-blockquote">${block.map(inlineToHtml).join('<br>')}</blockquote>`);
      continue;
    }

    // ── Unordered list  - / * / +
    if (/^\s*[-*+]\s+/.test(line)) {
      const block = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      out.push(renderList(block, false));
      continue;
    }

    // ── Ordered list  1. …
    if (/^\s*\d+\.\s+/.test(line)) {
      const block = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      out.push(renderList(block, true));
      continue;
    }

    // ── Table  | col | col |
    if (/^\|/.test(line)) {
      const block = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      out.push(renderTable(block));
      continue;
    }

    // ── Blank line → paragraph break (skip)
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // ── Paragraph — collect consecutive non-blank, non-special lines
    {
      const block = [];
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^(#{1,6}\s|```|:::preview|>|-\s|\*\s|\+\s|\d+\.\s|\|)/.test(lines[i]) &&
        !/^(---|\*\*\*|___)\s*$/.test(lines[i])
      ) {
        block.push(lines[i]);
        i++;
      }
      if (block.length) {
        out.push(`<p class="md-p">${inlineToHtml(block.join(' '))}</p>`);
      }
    }
  }

  return out.join('\n');
}

// ── Stylesheet injection ──────────────────────────────────────────────────────

const MD_CSS = `
.md-h1 { font-size: 28px; font-weight: 700; margin: 32px 0 12px; letter-spacing: -0.5px; }
.md-h2 { font-size: 22px; font-weight: 700; margin: 28px 0 10px; border-bottom: 2px solid #000; padding-bottom: 6px; }
.md-h3 { font-size: 17px; font-weight: 700; margin: 22px 0 8px; }
.md-h4 { font-size: 15px; font-weight: 700; margin: 18px 0 6px; }
.md-h5,.md-h6 { font-size: 14px; font-weight: 700; margin: 14px 0 4px; }
.md-p  { font-size: 14px; line-height: 1.7; color: #333; margin: 0 0 14px; }
.md-code {
  background: #f0f0f0; padding: 2px 6px;
  font-family: 'Fira Code', 'Consolas', monospace; font-size: 12px;
  border: 1px solid #ddd;
}
.md-pre {
  background: #101426; color: #e6e6e6;
  border: 2px solid #000; padding: 18px 20px;
  font-family: 'Fira Code', 'Consolas', monospace; font-size: 12px;
  line-height: 1.7; overflow-x: auto;
  box-shadow: 4px 4px 0 #000; margin: 16px 0;
}
.md-fenced { display: block; }
.md-list { margin: 0 0 14px; padding-left: 24px; }
.md-ul { list-style: disc; }
.md-ol { list-style: decimal; }
.md-li { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 4px; }
.md-blockquote {
  border-left: 4px solid #BEFF6C; margin: 16px 0;
  padding: 12px 16px; background: #fffdf0; font-size: 14px;
  color: #555; font-style: italic;
}
.md-hr { border: none; border-top: 2px solid #e5e7eb; margin: 32px 0; }
.md-table-wrap { overflow-x: auto; margin: 16px 0; }
.md-table { border-collapse: collapse; width: 100%; font-size: 13px; border: 2px solid #000; }
.md-th { background: #000; color: #fff; font-weight: 700; padding: 10px 14px; text-align: left; }
.md-td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; }
.md-tr:nth-child(even) .md-td { background: #f7f8fa; }
.md-link { color: #7C5CF6; text-decoration: underline; font-weight: 600; }
.md-img { max-width: 100%; height: auto; border: 2px solid #000; }
.md-preview-island {
  border: 2px solid #000; border-left: 6px solid #49DBC8;
  padding: 24px; margin: 16px 0; box-shadow: 4px 4px 0 #000; background: #fff;
}
`;

let mdCssInjected = false;

/**
 * Inject the MD stylesheet once into <head>.
 */
export function injectMdStyles() {
  if (mdCssInjected) return;
  mdCssInjected = true;
  const style = document.createElement('style');
  style.id    = 'md-styles';
  style.textContent = MD_CSS;
  document.head.appendChild(style);
}

// ── Convenience: fetch + parse + render ───────────────────────────────────────

/**
 * Fetch a .md file, parse frontmatter, render body to HTML.
 * Returns { meta, html }
 */
export async function loadMd(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} — ${res.status}`);
  const raw = await res.text();
  const { meta, body } = parseFrontmatter(raw);
  const html = renderMd(body);
  return { meta, html };
}
