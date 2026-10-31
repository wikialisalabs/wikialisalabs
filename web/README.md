# Wikialisalabs — Design System Docs

> All-in-One Atomic Design System & UI Kit · v1.0

A static, zero-build SPA that documents the entire Wikialisalabs design system — tokens, icons, components, app zones, and mobile screens.

---

## Architecture

```
site/
├── index.html              SPA shell (sidebar + topbar + #app mount)
├── landing.html            Marketing landing / showcase page
├── netlify.toml            Netlify deployment config
├── vercel.json             Vercel deployment config
├── package.json
└── src/
    ├── lib/
    │   └── md.js           Zero-dep Markdown → HTML renderer + frontmatter parser
    ├── content/            Markdown source files (edit these!)
    │   ├── overview.md     Overview page — pure MD
    │   ├── tokens.md       Tokens reference prose — hybrid (MD + live explorer)
    │   ├── icons.md        Icons reference prose — hybrid (MD + live search)
    │   ├── components.md   Component docs — hybrid (MD + live previews)
    │   └── zones.md        App zones — pure MD
    ├── pages/              Route page modules (loaded by router)
    │   ├── overview.js     Loads overview.md → renders with md.js
    │   ├── tokens.js       Loads tokens.md + renders live token explorer
    │   ├── icons.js        Loads icons.md + renders live icon search
    │   ├── components.js   Loads components.md + renders live component previews
    │   └── zones.js        Loads zones.md → renders with md.js
    ├── router/
    │   └── index.js        Hash router (#/ #/tokens #/icons …)
    ├── data/
    │   ├── tokens.js       Token data (PRIMITIVE_COLORS, SEMANTIC_COLORS, …)
    │   ├── icons.js        Icon index loader + svgPath helper
    │   └── icons-index.json  Icon name list
    └── style/
        ├── shell.css       Sidebar + topbar layout
        └── pages.css       Shared page utilities
```

---

## MD Content System

All page content lives in `src/content/*.md`. To update documentation, **edit the `.md` files** — no JS changes needed.

### Frontmatter

```yaml
---
title: Overview
route: /
description: Wikialisalabs All-in-One Atomic Design System & UI Kit
version: 1.0.0
---
```

### Supported Markdown

| Syntax | Output |
| --- | --- |
| `# Heading` | `<h1>` … `<h6>` |
| `**bold**` | `<strong>` |
| `_italic_` | `<em>` |
| `` `code` `` | `<code>` |
| ` ```lang ``` ` | Fenced code block |
| `:::preview … :::` | Raw HTML island (live component demo) |
| `- item` | Unordered list |
| `1. item` | Ordered list |
| `\| col \|` | Table (GFM-style) |
| `> quote` | Blockquote |
| `---` | Horizontal rule |
| `[text](url)` | Link |
| `![alt](src)` | Image |

### Page Types

| Type | Pages | How it works |
| --- | --- | --- |
| **Pure MD** | Overview, Zones | Page JS fetches `.md` file, passes to `md.js`, renders HTML |
| **Hybrid** | Tokens, Icons, Components | Page JS renders MD prose as collapsible header + live interactive explorer below |

---

## Running Locally

```bash
cd site
npx serve . -l 3000
# Open http://localhost:3000
```

No build step required — all ES modules load directly in the browser.

---

## Links

- **Landing/Showcase:** [landing.html](./landing.html)
- **Component Preview (Astro):** [../preview/](../preview/)
- **GitHub:** [github.com/Wikialisalabslabs](https://github.com/Wikialisalabslabs)
- **Contact:** contact@wikialisalabs.axvn.vn
