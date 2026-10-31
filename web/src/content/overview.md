---
title: Overview
route: /
description: Wikialisalabs All-in-One Atomic Design System & UI Kit
version: 1.0.0
---

# Build with Wikialisalabs

> An all-in-one Atomic Design System & UI Kit for the AXQ ecosystem — tokens, icons, components, and mobile screens built for blockchain, DeFi, and Web3 products.

---

## Stats at a Glance

| Metric | Value |
| --- | --- |
| Components | 201 |
| Icons | 6000+ |
| Token Layers | 3 |
| iOS Screens | 65+ |
| App Zones | 8 |
| UI Kits | 12 |

---

## What's Inside

### Design Tokens

3-layer token system: **Primitive → Semantic → Component**. CSS custom properties ready for dark/light mode.

- Primitive: raw values — colors, spacing, radius
- Semantic: contextual aliases — bg, text, border, status
- Component: per-component tokens for Button, Badge, Input, Toggle, Card, Navbar

### Icon Library

6000+ outline SVG icons across 20 categories. Search, preview, and copy React/Vue/HTML snippets in one click.

Categories include: General UI, Arrows, Brand, Crypto & Web3, Finance, Communication, Media, Maps, and more.

### Atomic Components

201 components structured on the Atomic Design methodology:

1. **Atoms** — Buttons, Inputs, Badges, Avatars, Icons, Toggles
2. **Molecules** — Navbar, Search bars, Tooltips, Toasters, OTP fields
3. **Organisms** — Calendar/DateTime, Sections, Cover/Thumbnail
4. **Templates** — Layout structures, App shells

### AxioPass Screens

65+ iOS-first mobile screens at 390×844. Neubrutal style, 8 app zones, WebAuthn/Passkey flows.

### 12 UI Kits

Plug-and-play theme bundles per vertical:

| Kit | Target |
| --- | --- |
| Crypto / DeFi Kit | DEX, swap, liquidity, AMM |
| Payment / Fintech Kit | Banking, card, transfers |
| Wallet / Web3 Kit | Key management, dApp browser |
| Dashboard / Analytics Kit | Charts, grids, KPI cards |
| Auth / Onboarding Kit | Sign-in, OTP, Passkey flows |

---

## Package Structure

| Package | Contents |
| --- | --- |
| `@wikialisalabs/tokens` | Colors, Typography, Spacing, Radius |
| `@wikialisalabs/icons` | 6000+ SVG icons, React & Vue components |
| `@wikialisalabs/ui` | Full Atomic UI (Atoms to Templates) |
| `@wikialisalabs/kits` | 12 vertical UI Kits (DeFi, Wallet, Auth) |
| `@wikialisalabs/utils` | Hooks, formatters, shared business logic |
| `@wikialisalabs/bridge` | Blockchain bridge — UI to ledger nodes |

---

## Token Architecture

The 3-layer system ensures no component references a raw primitive directly:

```
Primitive  ->  Semantic              ->  Component
#49DBC8    ->  --color-bg-accent     ->  --axq-button-primary-bg
4px        ->  --spacing-xs          ->  --axq-input-padding-y
8px        ->  --radius-md           ->  --axq-button-radius
```

Retheme the entire system by changing semantic aliases — no component changes needed.

---

## Quick Start

```html
<!-- 1. Include the compiled token CSS -->
<link rel="stylesheet" href="@wikialisalabs/tokens/dist/tokens.css">

<!-- 2. Use CSS variables in your styles -->
<style>
  .my-button {
    background: var(--axq-button-primary-bg);
    color:      var(--axq-button-primary-text);
    padding:    var(--axq-button-padding-y) var(--axq-button-padding-x);
    border-radius: var(--axq-button-radius);
  }
</style>
```

```js
// 3. Import only what you need (tree-shakeable)
import { Button } from '@wikialisalabs/ui/atoms';
import { WalletCard } from '@wikialisalabs/kits/wallet';
```

---

## Brand Palette

| Name | Hex | Role |
| --- | --- | --- |
| Teal | `#49DBC8` | Primary accent, success states |
| Green | `#BEFF6C` | CTA highlights, tags, badges |
| Orange | `#FC7339` | Warnings, energy, alerts |
| Pink | `#FD9FDD` | Soft accent, backgrounds |
| Purple | `#AF96FB` | Secondary accent, blockchain |
| Yellow | `#FFF172` | Info states, highlights |
| Grey | `#EFEFEF` | Neutral backgrounds |
| Black | `#000000` | Base text, borders, shadows |
| White | `#FFFFFF` | Surfaces, text-on-dark |

---

_Wikialisalabs Design System · v1.0 · [GitHub](https://github.com/Wikialisalabslabs) · contact@wikialisalabs.axvn.vn_
