# Changelog

All notable changes to `@axioledger/axio-design-system` are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [2.0.0] — 2025-07

### 🚀 Major release — complete rewrite from spec

#### Phase 0 — Foundation
- **Token system**: 3-layer CSS Custom Properties (`--color-*`, `--tlp-*`, typography, spacing, radius)
- **Dark mode**: `[data-theme="dark"]` + `prefers-color-scheme` via `AxioProvider`
- **TLP security types**: `TLPLevel`, `TLP_MAP`, `resolveTLPLevel()` — namespace → trust level mapping
- **`AxioProvider`**: React context for theme + ANS resolver config
- **Hooks**: `useTheme`, `useANSResolver` (LRU cache, graceful RPC fallback), `useToast`
- **Build**: Vite lib mode, ES + CJS, `vite-plugin-dts`, tree-shakeable barrel exports
- **Storybook 8**: `addon-a11y` (WCAG 2.1 AA axe-core), `addon-themes`, `addon-essentials`

#### Phase 1 — Core Components (11 components)
- **`Button`** — 3 variants × 8 colors × 4 sizes; a11y fix: `yellow`/`green`/`warning` use dark text (`#1E2A59`) not white (contrast)
- **`Input`** — floating label, password toggle, search clear, ANS-aware, `role="alert"` on error
- **`Card`** — clickable with Enter/Space keyboard activation
- **`Badge` + `Chip`** — 5 variants + dot mode; Chip active/removable/disabled
- **`Toggle`** — `role="switch"`, Space key, controlled/uncontrolled
- **`Avatar`** — image → initials → SVG fallback; status dot; ring
- **`Skeleton`** — 3 variants + preset composites (`SkeletonListItem`, `SkeletonCard`, `SkeletonProfile`)
- **`Tooltip`** — 4 placements, `role="tooltip"`, `aria-describedby`, delay
- **`Modal` + `BottomSheet`** — focus trap, Escape-to-close, focus restore, drag-to-dismiss
- **`Toast` + `ToastContainer`** — 3 positions, `aria-live="polite"`, bridged to `useToast`
- **`Navbar`** — bottom nav, badge count (99+), safe-area inset, `role="tab" aria-selected`

#### Phase 2 — Advanced & Crypto Components (20 components)
- **`OTPInput`** — 4/6 digits, auto-focus advance, paste, ArrowLeft/Right, `autoComplete="one-time-code"`
- **`Checkbox`** — 5 states incl. indeterminate; `RadioButton` with dot animation
- **`Dropdown`** — single + multi-select; `role="combobox"/"listbox"`; outside-click + Escape close
- **`SearchBar`** — pill shape, `role="searchbox"`, hides native cancel button
- **`Alert`** — 4 variants, border-left accent, dismissible, `role="alert"`
- **`SecurityAlert`** — TLP-aware; **HARD RULE**: `level="blocked"` → Sign button permanently disabled (`disabled` + `aria-disabled` + `pointer-events:none`) — 14 tests enforce this invariant
- **`ProgressBar`** — linear, thin/default sizes, smooth CSS fill transition, `role="progressbar"`
- **`StepIndicator`** — done/active/pending states, `aria-current="step"`, connector lines
- **`EmptyState`** — 7 variants with inline SVG illustrations, optional CTA
- **`NamespaceBadge`** — TLP colour-coded badge with dot indicator
- **`AddressDisplay`** — ANS resolution, `⚠` icon on raw hex, copy button, TLP badge
- **`PasskeyButton`** — WebAuthn `navigator.credentials.create/get`, feature-detect, unsupported fallback
- **`CryptoAssetCard`** — full/compact/minimal; SVG sparkline from 7-point data
- **`TransactionItem`** — 5 types × 4 statuses, colour-coded icons
- **`BalanceDisplay`** — show/hide toggle, 4 quick-action slots, `aria-live`
- **`PriceTicker`** — up/down/neutral with arrow triangles
- **`QRCodeDisplay`** — receive/inline/loading variants, copy + share

#### Phase 3 — Quality & Release
- **Storybook stories**: 100% component coverage, dark-mode story on every component
- **Security tests**: `SecurityAlert` blocked-state invariant × 14 test cases; `resolveTLPLevel` × 10 mapping cases
- **Jest config**: jsdom, ts-jest, CSS module stub, coverage ≥80% global
- **CI**: TypeScript + ESLint + test:coverage + build + bundle-size + Storybook build
- **Publish workflow**: tag-triggered, GitHub Packages, GitHub Release creation
- **Bundle size gate**: gzipped JS < 50 KB, CSS < 25 KB

### ⚠️ Breaking Changes
- Complete rewrite — no migration path from v1.x
- CSS token prefix changed from `--axq-*` (docs only) to `--color-*` (canonical)
- Requires React 18+

### Security Notes
- `SecurityAlert` with `level="blocked"`: sign/send is permanently blocked at the component level
- `AddressDisplay` shows `⚠` icon when ANS unavailable — never silently renders unverified raw hex as trusted
- `PasskeyButton` is the sole authentication entry point — no private key API exposed

---

## [1.x.x] — (legacy, pre-rewrite)

> Components from the original UI Kit — replaced by v2.0.0.
> See design-system/ui.html for the static preview reference.
