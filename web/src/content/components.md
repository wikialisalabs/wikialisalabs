---
title: Components
route: /components
description: 201 token-driven UI components — Atoms to Templates
---

# Components

> 201 token-driven components structured on the Atomic Design methodology. Every component references design tokens — never raw values.

---

## Atomic Hierarchy

```
Atoms         →  Molecules          →  Organisms           →  Templates
──────────────    ──────────────────    ──────────────────     ──────────────────
Button            Navbar                Calendar / DateTime    App Shell Layout
Badge             Search Bar            Statistics Section     Dashboard Layout
Input             Tooltip               Hero Banner            Auth Layout
Toggle            Toast / Notif         Cover / Thumbnail      Card Grid Layout
Avatar            OTP Input             Data Table             Wizard Layout
Icon              Breadcrumb            Chart Block
Chip / Tag        Dropdown Menu         Ledger Explorer
```

---

## Button

Token-driven button component with 7 variants and 3 sizes.

| Variant | Token | Background |
| --- | --- | --- |
| Primary | `--axq-button-primary-bg` | `#000000` |
| Info | `--primitive-info` | `#0095FF` |
| Success | `--primitive-success` | `#00D68F` |
| Warning | `--primitive-warning` | `#FFAA00` |
| Danger | `--primitive-error` | `#FF3D71` |
| Ghost | transparent | border only |

### Sizes

| Size | Class | Padding | Font |
| --- | --- | --- | --- |
| Small | `.axq-btn-sm` | `6px 14px` | `12px` |
| Medium | `.axq-btn` | `8px 16px` | `14px` |
| Large | `.axq-btn-lg` | `12px 24px` | `16px` |

### States

- **Default** — base appearance
- **Hover** — `transform: translate(-2px, -2px)` + deeper shadow
- **Focus** — `outline: 2px solid var(--primitive-info)` (keyboard nav)
- **Disabled** — `opacity: 0.4`, `cursor: not-allowed`, no pointer events
- **Loading** — spinner replaces label, width locked to prevent layout shift

```html
<button class="axq-btn axq-btn-primary">Primary</button>
<button class="axq-btn axq-btn-success">Success</button>
<button class="axq-btn axq-btn-ghost">Ghost</button>
<button class="axq-btn axq-btn-primary axq-btn-sm">Small</button>
<button class="axq-btn axq-btn-primary axq-btn-lg">Large</button>
<button class="axq-btn axq-btn-primary" disabled>Disabled</button>
```

---

## Badge

Inline label for status, count, or category — 4 semantic variants.

| Variant | Background | Text | Border |
| --- | --- | --- | --- |
| Success | `#F0FFF5` | `#00997A` | `#00D68F` |
| Warning | `#FFFDF2` | `#B86E00` | `#FFAA00` |
| Error | `#FFF2F2` | `#B81D5B` | `#FF3D71` |
| Info | `#F2F8FF` | `#0057C2` | `#0095FF` |

```html
<span class="axq-badge badge-success">Confirmed</span>
<span class="axq-badge badge-warning">Pending</span>
<span class="axq-badge badge-error">Failed</span>
<span class="axq-badge badge-info">Processing</span>
```

---

## Input

Validated text inputs with 3 states and 4 special Web3 variants.

### States

| State | Border | Shadow |
| --- | --- | --- |
| Default | `--axq-input-border` | none |
| Focus | `--axq-input-border-focus` | `0 0 0 3px rgba(0,149,255,0.15)` |
| Error | `--axq-input-border-error` | none |
| Disabled | `--primitive-gs-200` | none |

### Special Inputs

- **Wallet Address** — monospace font, auto-truncate long addresses
- **Private Key** — masked by default, reveal on hold
- **OTP / 2FA** — 6 individual cells, auto-focus chain
- **Amount** — right-aligned value, currency prefix/suffix

```html
<input class="axq-input" type="text" placeholder="Enter address…">
<input class="axq-input axq-input-error" type="text" value="Invalid">
<input class="axq-input axq-input-focus" type="text" value="Focused">
```

---

## Toggle / Switch

Binary state control. On state uses `--primitive-teal-400`.

| Spec | Value |
| --- | --- |
| Track width | `52px` |
| Track height | `28px` |
| Thumb size | `20px` |
| Transition | `left 0.2s ease` |
| On color | `#49DBC8` |
| Off color | `--primitive-gs-300` |

```html
<div class="axq-toggle toggle-on">
  <div class="toggle-thumb"></div>
</div>
<div class="axq-toggle toggle-off">
  <div class="toggle-thumb"></div>
</div>
```

---

## Card

Neubrutal card with flat shadow. Composable with any content.

| Spec | Value |
| --- | --- |
| Border | `2px solid #000` |
| Shadow | `4px 4px 0 #000` |
| Radius | `var(--primitive-radius-xl)` — 16px |
| Hover | `translate(-2px, -2px)`, deeper shadow |
| Padding | `var(--primitive-space-6)` — 24px |

### Card Variants

- **Default** — white background, black border + shadow
- **Accent** — colored left border (6px) using brand color
- **Filled** — brand color background (teal, green, pink…)
- **Dark** — `--color-bg-surface` dark surface
- **Ghost** — border only, transparent background

---

## Navbar

Responsive navigation bar with wallet connection states, network indicators, and breadcrumbs.

### Anatomy

```
[Logo]  [Nav Links]  [Search]  [Network Pill]  [Connect Wallet]  [Avatar]
```

### Variants

| Variant | Description |
| --- | --- |
| Default | White bg, black border bottom |
| Transparent | No background, overlays hero |
| Dark | Dark surface, light text |
| Sticky | `position: sticky; top: 0; z-index: 100` |
| Compact | 44px height, smaller links |

### Web3 States

- **Disconnected** — "Connect Wallet" CTA button
- **Connecting** — spinner in button, "Connecting…"
- **Connected** — avatar + truncated address (`0x1a2b…ef3c`)
- **Wrong Network** — orange pill "Switch Network"
- **Mainnet / Testnet** — colored dot indicator

---

## Avatar

Decentralized identifier (DID) ready avatar components with blockie support.

### Sizes

| Size | Class | Diameter |
| --- | --- | --- |
| xs | `.avatar-xs` | `24px` |
| sm | `.avatar-sm` | `32px` |
| md | `.avatar-md` | `40px` |
| lg | `.avatar-lg` | `56px` |
| xl | `.avatar-xl` | `72px` |

### Types

- **Initials** — 1–2 letter monogram on brand color background
- **Image** — circular crop with `object-fit: cover`
- **Blockie** — deterministic Ethereum-style blockie from address hash
- **DID Avatar** — resolved from Decentralized Identity profile
- **NFT PFP** — on-chain token image

### Avatar Group

Overlapping stack of up to 5 avatars + `+N` overflow badge.

```html
<div class="avatar-group">
  <div class="axq-avatar avatar-md" style="background:#49DBC8">WK</div>
  <div class="axq-avatar avatar-md" style="background:#BEFF6C">AX</div>
  <div class="axq-avatar avatar-md" style="background:#AF96FB">VR</div>
  <div class="axq-avatar avatar-md avatar-overflow">+12</div>
</div>
```

---

## Other Components

| Component | Category | Description |
| --- | --- | --- |
| Tooltip | Molecule | Hover contextual help, 4 placements |
| Toast | Molecule | Transaction status (Success/Pending/Failed) |
| Modal | Organism | Confirmation dialogs, multi-step flows |
| Dropdown | Molecule | Action menus, select controls |
| Breadcrumb | Molecule | Hierarchical navigation path |
| Calendar | Organism | Date picker + epoch/block-time converter |
| Chip / Tag | Atom | Category labels, filter chips |
| Progress Bar | Atom | Linear fill, determinate/indeterminate |
| Skeleton | Atom | Loading placeholder shapes |
| OTP Input | Molecule | 6-cell 2FA entry with auto-focus chain |
| Data Table | Organism | Sortable, paginated, selectable rows |
| Chart Block | Organism | Line, bar, candlestick — DeFi optimized |
| Ledger Feed | Organism | Real-time transaction stream with status |

---

## Theming

All components respond to `data-theme="dark"` on `<html>`:

```css
[data-theme="dark"] {
  --color-bg-page:    #101426;
  --color-bg-surface: #151A30;
  --color-text-primary:   #FFFFFF;
  --color-border-default: #222B45;
}
```

No component-level overrides needed — semantic token redefinition handles everything.
