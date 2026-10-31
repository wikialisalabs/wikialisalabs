---
title: App Zones
route: /zones
description: Six defined zones that make up the Wikialisalabs Docs shell layout
---

# App Zones

> Six defined zones that make up the AXQ Docs shell layout. Each zone has fixed responsibilities, spacing specs, and z-index rules.

---

## Layout Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Topbar (56px) — breadcrumb · search · GitHub               │
├────────────────┬────────────────────────────────────────────┤
│                │                                            │
│  Sidebar       │   Content Area (#app mount point)          │
│  (240px)       │                                    [Toast] │
│                │                                            │
│  Navigation    │                                            │
│  Links         │                                            │
│                │                                            │
├────────────────┴────────────────────────────────────────────┤
│  Mobile Overlay  (z:99 — backdrop on screens < 768px)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Zone Reference

### Zone 1 — App Shell

The persistent outer frame — sidebar, topbar, and content area. Always visible regardless of route.

| Spec | Value |
| --- | --- |
| Sidebar width | `240px` |
| Topbar height | `56px` |
| Sidebar z-index | `100` |
| Content padding | `24px 32px` |

---

### Zone 2 — Navigation

Primary navigation links in the sidebar. Hash-router driven, active state via `.active` class.

| Spec | Value |
| --- | --- |
| Link height | `38px` |
| Link padding | `8px 20px` |
| Sub-link indent | `36px left` |
| Active indicator | `3px left border` |

---

### Zone 3 — Content Area

The `#app` mount point. Each route's `module.render(el)` injects HTML here. Scrolls independently.

| Spec | Value |
| --- | --- |
| Max width | `900px` (page-dependent) |
| Padding | `24px 32px` |
| Scroll | vertical, independent |
| Mount element | `#app` |

---

### Zone 4 — Topbar

Sticky top bar showing breadcrumb, optional icon search (only on `/icons`), and GitHub link.

| Spec | Value |
| --- | --- |
| Height | `56px` |
| Background | `#ffffff` with blur |
| Breadcrumb | `#bcCurrent span` |
| Search shown | route === `/icons` only |

---

### Zone 5 — Mobile Overlay

Translucent backdrop shown on mobile when sidebar is open. Tap to dismiss.

| Spec | Value |
| --- | --- |
| Breakpoint | `< 768px` |
| z-index | `99` |
| Background | `rgba(0,0,0,0.4)` |
| Toggle | `#menuBtn` click |

---

### Zone 6 — Toast

Transient copy confirmation. Add `.show` class to display, auto-removed after 2 seconds.

| Spec | Value |
| --- | --- |
| Position | fixed, bottom-right |
| Duration | `2000ms` |
| Trigger | add `.show` class |
| Element | `#copyToast` |

---

## Layout Rules

1. **Sidebar is always in DOM** — it is never destroyed between routes. Only the `#app` content is replaced.
2. **Topbar search is hidden by default** — only the Icons page shows it via `topbarSearch.style.display = 'flex'`.
3. **Content area scrolls independently** — sidebar and topbar are sticky/fixed; only the page content scrolls.
4. **Mobile breakpoint is 768px** — below this, the sidebar collapses off-screen and the hamburger menu button appears.
5. **Hash routing** — all navigation uses `window.location.hash` (`#/`, `#/tokens`, `#/icons`, etc.) so the shell never reloads.
6. **Toast is globally shared** — the `#copyToast` element lives in the shell and is reused by all pages.
7. **No server required** — all JS modules load as ES modules via `type="module"`. A static file server is sufficient.
8. **Theme** — `data-theme="light"` on `<html>`. Dark mode support via `data-theme="dark"` (CSS variables auto-switch).

---

## Token → Zone Mapping

| Token | Zone | Value |
| --- | --- | --- |
| `--axq-shell-sidebar-width` | App Shell | `240px` |
| `--axq-shell-topbar-height` | Topbar | `56px` |
| `--axq-shell-sidebar-z` | App Shell | `100` |
| `--axq-shell-overlay-z` | Mobile Overlay | `99` |
| `--axq-content-padding` | Content Area | `24px 32px` |
| `--axq-content-max-width` | Content Area | `900px` |
| `--axq-toast-duration` | Toast | `2000ms` |
