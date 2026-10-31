---
title: Changelog
route: /changelog
description: Release history for @axioledger/axio-design-system
version: 6.0.0
---

# Changelog

> All notable changes to `@axioledger/axio-design-system`.

---

## [6.0.0] — 2026-10

### Breaking Changes
- Package renamed: `@wikialisalabs/ui` → `@axioledger/axio-design-system`
- CSS token prefix unified: `--axq-*` across all layers
- Requires React 18+, Next.js 15+

### Added — Token System
- `tokens/primitive.css` — Layer 1: raw values (`--axq-p-*`)
- `tokens/semantic.css` — Layer 2: aliases + TLP security tokens + elevation shadows
- `tokens/component.css` — Layer 3: component-scoped tokens (Table, Toast, Drawer)
- `tokens/tailwind-tokens.js` — Tailwind theme extension
- TypeScript token constants: `PRIMITIVE_TOKENS`, `SEMANTIC_TOKENS`, `TLP_CSS_VARS`

### Added — TLP Security
- `resolveTLP()` — namespace → trust level mapping
- `NamespaceBadge` — colour-coded TLP badge with dot indicator
- `SecurityAlert` — anti-phishing alert; `level="blocked"` permanently disables Sign button
- `AddressDisplay` — ANS resolution, `⚠` icon on unregistered raw hex

### Added — New Components (v6)
- `PasskeyButton` — WebAuthn P-256, feature-detect, unsupported fallback
- `OTPInput` — 4/6 digits, auto-advance, paste, arrow keys
- `Checkbox` + `RadioButton` — 5 states incl. indeterminate
- `Dropdown` — single + multi-select, `role="combobox"/"listbox"`
- `SearchBar` — pill shape, `role="searchbox"`
- `Alert` — 4 variants, dismissible, `role="alert"`
- `ProgressBar` — linear, smooth fill, `role="progressbar"`
- `StepIndicator` — done/active/pending, `aria-current="step"`
- `EmptyState` — 7 variants with inline SVG illustrations
- `CryptoAssetCard` — full/compact/minimal with SVG sparkline
- `TransactionItem` — 5 types × 4 statuses
- `BalanceDisplay` — show/hide toggle, 4 quick-action slots
- `PriceTicker` — up/down/neutral with arrow triangles
- `QRCodeDisplay` — receive/inline/loading variants

### Added — Infrastructure
- `AxioProvider` — React context for theme + ANS resolver
- `useTheme` hook — light/dark/system
- `useANSResolver` hook — LRU cache 50ms TTL, RPC fallback
- `useToast` hook — bridged to `ToastContainer`
- Storybook 8 with `addon-a11y` (WCAG 2.1 AA axe-core)
- Jest coverage thresholds 70–80%
- CI: hardcoded hex guard, token pipeline freshness check

---

## [2.0.0] — 2025-07

### Added
- Complete 3-layer CSS Custom Properties token system
- Dark mode via `[data-theme="dark"]` + `prefers-color-scheme`
- TLP security types: `TLPLevel`, `TLP_MAP`, `resolveTLPLevel()`
- 11 core components: Button, Input, Card, Badge, Toggle, Avatar, Skeleton, Tooltip, Modal, Toast, Navbar
- Vite lib mode build — ES + CJS, tree-shakeable

---

## [1.0.0] — 2024

Initial release — static design spec, Figma variables, token documentation.
