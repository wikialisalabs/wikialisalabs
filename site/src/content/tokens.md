---
title: Tokens
route: /tokens
description: 3-layer design token system — Primitive, Semantic, Component
---

# Design Tokens

> A 3-layer token system ensures visual consistency and makes global theming possible without touching individual components.

---

## Architecture

```
Layer 1: Primitive
  Raw values — color hex codes, px numbers, unitless scales.
  Never used directly in components.

Layer 2: Semantic
  Named by intent — --color-bg-surface, --color-text-primary.
  References primitives. Changes here ripple everywhere.

Layer 3: Component
  Scoped per component — --axq-button-primary-bg.
  References semantic tokens. Max one hop from semantic.
```

**Rule:** Components must never reference primitives directly.

---

## Layer 1 — Primitive Colors

Primitive colors are named by hue and shade. They power every semantic alias.

| Token | Hex | Role |
| --- | --- | --- |
| `--primitive-teal-400` | `#49DBC8` | Brand teal |
| `--primitive-green-400` | `#BEFF6C` | Brand green |
| `--primitive-orange-400` | `#FC7339` | Brand orange |
| `--primitive-pink-400` | `#FD9FDD` | Brand pink |
| `--primitive-purple-400` | `#AF96FB` | Brand purple |
| `--primitive-yellow-400` | `#FFF172` | Brand yellow |
| `--primitive-grey-100` | `#EFEFEF` | Light neutral |
| `--primitive-black` | `#000000` | Pure black |
| `--primitive-white` | `#FFFFFF` | Pure white |

### Status Colors

| Token | Hex | Use |
| --- | --- | --- |
| `--primitive-success` | `#00D68F` | Success states |
| `--primitive-warning` | `#FFAA00` | Warning states |
| `--primitive-error` | `#FF3D71` | Error / destructive |
| `--primitive-info` | `#0095FF` | Informational |

### Greyscale (9 steps)

| Token | Hex |
| --- | --- |
| `--primitive-gs-100` | `#EDF1F7` |
| `--primitive-gs-200` | `#E4E9F2` |
| `--primitive-gs-300` | `#C5CEE0` |
| `--primitive-gs-400` | `#8F9BB3` |
| `--primitive-gs-500` | `#2E3A59` |
| `--primitive-gs-600` | `#222B45` |
| `--primitive-gs-700` | `#192038` |
| `--primitive-gs-800` | `#151A30` |
| `--primitive-gs-900` | `#101426` |

---

## Layer 1 — Primitive Spacing

4px base grid. All spacing values are multiples of 4.

| Token | Value | Use |
| --- | --- | --- |
| `--primitive-space-1` | `4px` | xs — icon gaps, tight padding |
| `--primitive-space-2` | `8px` | sm — inner padding |
| `--primitive-space-3` | `12px` | md-sm |
| `--primitive-space-4` | `16px` | md — default padding |
| `--primitive-space-5` | `20px` | md-lg |
| `--primitive-space-6` | `24px` | lg — section padding |
| `--primitive-space-8` | `32px` | xl |
| `--primitive-space-10` | `40px` | 2xl |
| `--primitive-space-12` | `48px` | 3xl |
| `--primitive-space-16` | `64px` | 4xl — hero sections |

---

## Layer 1 — Primitive Radius

| Token | Value | Shape |
| --- | --- | --- |
| `--primitive-radius-none` | `0px` | Sharp corners |
| `--primitive-radius-sm` | `4px` | Subtle rounding |
| `--primitive-radius-md` | `8px` | Cards, inputs |
| `--primitive-radius-lg` | `12px` | Panels |
| `--primitive-radius-xl` | `16px` | Modals |
| `--primitive-radius-2xl` | `24px` | Sheets |
| `--primitive-radius-3xl` | `32px` | Large cards |
| `--primitive-radius-full` | `9999px` | Pills, chips, avatars |

---

## Layer 2 — Semantic Colors

### Light Mode

| Token | References | Role |
| --- | --- | --- |
| `--color-bg-page` | `--primitive-white` | Page background |
| `--color-bg-surface` | `--primitive-gs-100` | Card / panel surface |
| `--color-bg-overlay` | `rgba(0,0,0,0.4)` | Modal backdrop |
| `--color-text-primary` | `--primitive-black` | Body text |
| `--color-text-secondary` | `--primitive-gs-500` | Muted text |
| `--color-text-accent` | `--primitive-teal-400` | Accent text, links |
| `--color-border-default` | `--primitive-gs-300` | Input / card borders |
| `--color-border-strong` | `--primitive-black` | Neubrutal borders |

### Dark Mode (`data-theme="dark"`)

| Token | Light Value | Dark Value |
| --- | --- | --- |
| `--color-bg-page` | `#FFFFFF` | `#101426` |
| `--color-bg-surface` | `#EDF1F7` | `#151A30` |
| `--color-text-primary` | `#000000` | `#FFFFFF` |
| `--color-text-secondary` | `#2E3A59` | `#8F9BB3` |
| `--color-border-default` | `#C5CEE0` | `#222B45` |

---

## Layer 3 — Component Tokens

### Button

| Token | Value | Description |
| --- | --- | --- |
| `--axq-button-primary-bg` | `#000000` | Primary background |
| `--axq-button-primary-text` | `#FFFFFF` | Primary text |
| `--axq-button-padding-x` | `16px` | Horizontal padding |
| `--axq-button-padding-y` | `8px` | Vertical padding |
| `--axq-button-radius` | `var(--primitive-radius-full)` | Border radius |
| `--axq-button-font-size` | `14px` | Font size |
| `--axq-button-font-weight` | `600` | Font weight |
| `--axq-button-shadow` | `3px 3px 0 #000` | Neubrutal shadow |

### Badge

| Token | Value | Description |
| --- | --- | --- |
| `--axq-badge-font-size` | `12px` | Font size |
| `--axq-badge-padding-x` | `12px` | Horizontal padding |
| `--axq-badge-padding-y` | `4px` | Vertical padding |
| `--axq-badge-radius` | `var(--primitive-radius-full)` | Border radius |

### Input

| Token | Value | Description |
| --- | --- | --- |
| `--axq-input-border` | `1.5px solid var(--color-border-default)` | Default border |
| `--axq-input-border-focus` | `1.5px solid #0095FF` | Focus border |
| `--axq-input-border-error` | `1.5px solid #FF3D71` | Error border |
| `--axq-input-radius` | `var(--primitive-radius-lg)` | Border radius |
| `--axq-input-padding-x` | `16px` | Horizontal padding |
| `--axq-input-padding-y` | `14px` | Vertical padding |
| `--axq-input-font-size` | `14px` | Font size |

### Toggle

| Token | Value | Description |
| --- | --- | --- |
| `--axq-toggle-width` | `52px` | Track width |
| `--axq-toggle-height` | `28px` | Track height |
| `--axq-toggle-on-bg` | `var(--primitive-teal-400)` | On state background |
| `--axq-toggle-off-bg` | `var(--primitive-gs-300)` | Off state background |
| `--axq-toggle-thumb-size` | `20px` | Thumb diameter |

---

## Usage

```css
/* Reference tokens in your component styles */
.my-card {
  background:    var(--color-bg-surface);
  border:        2px solid var(--color-border-strong);
  border-radius: var(--primitive-radius-xl);
  padding:       var(--primitive-space-6);
  box-shadow:    4px 4px 0 var(--color-border-strong);
}

.my-card__title {
  color:       var(--color-text-primary);
  font-size:   var(--axq-h3-size, 17px);
  font-weight: 700;
}

.my-card__meta {
  color:     var(--color-text-secondary);
  font-size: 12px;
}
```
